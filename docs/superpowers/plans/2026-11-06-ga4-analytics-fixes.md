# GA4 Analytics Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix GA4 data quality on byfabrico.com by adding Consent Mode v2, a cookie consent banner, correcting a schema URL bug, completing the sitemap, and documenting UTM links.

**Architecture:** Static GitHub Pages site — 9 standalone HTML files, no build system. Consent logic is split: the head block (inline per-page) handles default state + immediate restoration for returning visitors; `assets/consent.js` (loaded before `</body>`) handles the banner UI. This split ensures returning users who already accepted get full tracking on the very first page event.

**Tech Stack:** Vanilla HTML/JS/CSS, Google Analytics 4 (GA4) Consent Mode v2, GitHub Pages, localStorage for preference persistence.

---

## File Map

| File | Action | What changes |
|------|--------|-------------|
| `assets/consent.js` | **Create** | Banner HTML+CSS render, accept/decline handlers |
| `index.html` | Modify L656–663, before L664+end-of-body | Consent head block + consent.js script tag |
| `basement-conversions.html` | Modify L335–342, before L343+L636 | Same as above |
| `commercial.html` | Modify L335–342, before L343+L589 | Same as above |
| `lofts.html` | Modify L335–342, before L343+L575 | Same as above |
| `new-builds.html` | Modify L335–342, before L343+L579 | Same as above |
| `renovations.html` | Modify L335–342, before L343+L578 | Same as above |
| `extensions.html` | Modify L335–342, before L343+L575 | Same as above |
| `house-to-flat.html` | Modify L335–342, before L343+L588 | Same as above |
| `privacy-policy.html` | Modify L157–164, before L165+L266 | Same as above |
| `sitemap.xml` | Rewrite | Add 6 service pages, remove fragments |
| `README.md` | Append | UTM cheat-sheet section |

---

## Task 1: Create `assets/consent.js`

**Files:**
- Create: `assets/consent.js`

This file renders the banner and wires the buttons. It does NOT set consent defaults or restore stored consent — that happens in the per-page `<head>` block (Task 2). By the time this script runs (bottom of body), `gtag` is already defined and the consent state is already correct for returning users.

- [ ] **Step 1: Create `assets/consent.js` with the following content**

```javascript
(function () {
  var KEY = 'fabrico_consent';

  // If already decided, no banner needed
  if (localStorage.getItem(KEY) !== null) return;

  // Inject styles
  var style = document.createElement('style');
  style.textContent =
    '#cb{position:fixed;bottom:0;left:0;right:0;z-index:9999;' +
    'background:#0f0f0d;color:rgba(255,255,255,.75);' +
    'padding:16px 60px;display:flex;align-items:center;' +
    'justify-content:space-between;gap:24px;' +
    'font-family:Outfit,sans-serif;font-size:12px;font-weight:300;' +
    'border-top:1px solid rgba(255,255,255,.08);}' +
    '#cb p{margin:0;line-height:1.6;}' +
    '#cb a{color:#2e8a71;text-decoration:underline;}' +
    '#cb .ca{display:flex;gap:10px;flex-shrink:0;}' +
    '#cb-ok,#cb-no{padding:8px 20px;border:none;cursor:pointer;' +
    'font-family:Outfit,sans-serif;font-size:9px;font-weight:400;' +
    'letter-spacing:.15em;text-transform:uppercase;transition:all .2s;}' +
    '#cb-ok{background:#1b5e50;color:#fff;}' +
    '#cb-ok:hover{background:#2e8a71;}' +
    '#cb-no{background:transparent;color:rgba(255,255,255,.5);' +
    'border:1px solid rgba(255,255,255,.15);}' +
    '#cb-no:hover{border-color:rgba(255,255,255,.4);color:rgba(255,255,255,.75);}' +
    '@media(max-width:768px){#cb{flex-direction:column;align-items:flex-start;' +
    'padding:20px 24px;gap:16px;}}';
  document.head.appendChild(style);

  // Render banner
  var banner = document.createElement('div');
  banner.id = 'cb';
  banner.innerHTML =
    '<p>We use analytics cookies to understand how visitors use this site. ' +
    '<a href="/privacy-policy">Privacy&nbsp;Policy</a></p>' +
    '<div class="ca">' +
    '<button id="cb-ok">Accept</button>' +
    '<button id="cb-no">Decline</button>' +
    '</div>';
  document.body.appendChild(banner);

  // Accept
  document.getElementById('cb-ok').addEventListener('click', function () {
    localStorage.setItem(KEY, 'granted');
    if (typeof gtag === 'function') {
      gtag('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage: 'granted'
      });
    }
    banner.remove();
  });

  // Decline
  document.getElementById('cb-no').addEventListener('click', function () {
    localStorage.setItem(KEY, 'denied');
    banner.remove();
  });
})();
```

- [ ] **Step 2: Verify file exists**

```
ls assets/consent.js
```

Expected: file listed, ~2 KB.

- [ ] **Step 3: Commit**

```bash
git add assets/consent.js
git commit -m "feat: add cookie consent banner (assets/consent.js)"
```

---

## Task 2: Update `index.html` — consent head block + consent.js tag

**Files:**
- Modify: `index.html` around L656 (GA4 block) and before the closing `</body>` tag

The consent head block replaces the existing `<!-- Google Analytics 4 -->` comment + scripts. It adds:
1. A consent default (denied for new users)
2. An immediate localStorage check to restore consent for returning visitors (runs synchronously in `<head>` before GA4 fires its first hit)
3. The GA4 loader + config (unchanged)

- [ ] **Step 1: Replace the existing GA4 block in `index.html`**

Find this block (around L656):
```html
  <!-- Google Analytics 4 -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-WGYN4EZ5EB"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-WGYN4EZ5EB');
  </script>
</head>
```

Replace with:
```html
  <!-- Google Analytics 4 + Consent Mode v2 -->
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('consent', 'default', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      wait_for_update: 500
    });
    try {
      if (localStorage.getItem('fabrico_consent') === 'granted') {
        gtag('consent', 'update', {
          analytics_storage: 'granted',
          ad_storage: 'granted'
        });
      }
    } catch(e) {}
  </script>
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-WGYN4EZ5EB"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-WGYN4EZ5EB');
  </script>
</head>
```

- [ ] **Step 2: Add consent.js script tag just before `</body>` in `index.html`**

Find (near end of file):
```html
</body>
</html>
```

Replace with:
```html
  <script src="/assets/consent.js"></script>
</body>
</html>
```

- [ ] **Step 3: Verify the changes look correct**

```bash
grep -n "consent\|G-WGYN\|consent.js" index.html | head -20
```

Expected output should show:
- consent default block near line 656
- GA4 config a few lines after
- `consent.js` script tag near the end of file

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat(index): add GA4 consent mode v2 and cookie banner"
```

---

## Task 3: Apply consent blocks to all 8 remaining HTML files

**Files:**
- Modify: `basement-conversions.html`, `commercial.html`, `lofts.html`, `new-builds.html`, `renovations.html`, `extensions.html`, `house-to-flat.html`, `privacy-policy.html`

All 8 files share the same GA4 block structure at the same line numbers (L335–343 for the 7 service pages, L157–165 for `privacy-policy.html`). The replacement is identical to Task 2.

- [ ] **Step 1: Replace GA4 block in `basement-conversions.html`**

Find (around L335):
```html
  <!-- Google Analytics 4 -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-WGYN4EZ5EB"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-WGYN4EZ5EB');
  </script>
</head>
```

Replace with:
```html
  <!-- Google Analytics 4 + Consent Mode v2 -->
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('consent', 'default', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      wait_for_update: 500
    });
    try {
      if (localStorage.getItem('fabrico_consent') === 'granted') {
        gtag('consent', 'update', {
          analytics_storage: 'granted',
          ad_storage: 'granted'
        });
      }
    } catch(e) {}
  </script>
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-WGYN4EZ5EB"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-WGYN4EZ5EB');
  </script>
</head>
```

- [ ] **Step 2: Add consent.js script tag before `</body>` in `basement-conversions.html`**

Find (near end of file):
```html
</body>
</html>
```

Replace with:
```html
  <script src="/assets/consent.js"></script>
</body>
</html>
```

- [ ] **Step 3: Repeat Steps 1–2 for `commercial.html`** (same replacement, same lines)

- [ ] **Step 4: Repeat Steps 1–2 for `lofts.html`**

- [ ] **Step 5: Repeat Steps 1–2 for `new-builds.html`**

- [ ] **Step 6: Repeat Steps 1–2 for `renovations.html`**

- [ ] **Step 7: Repeat Steps 1–2 for `extensions.html`**

- [ ] **Step 8: Repeat Steps 1–2 for `house-to-flat.html`**

- [ ] **Step 9: For `privacy-policy.html`** — same replacement but block is at L157–165 (not L335). The `</body>` is at L266.

Find (around L157):
```html
  <!-- Google Analytics 4 -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-WGYN4EZ5EB"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-WGYN4EZ5EB');
  </script>
</head>
```

Replace with the same consent block as above. Add `<script src="/assets/consent.js"></script>` before `</body>`.

- [ ] **Step 10: Verify all 8 files were updated**

```bash
grep -rL "analytics_storage" basement-conversions.html commercial.html lofts.html new-builds.html renovations.html extensions.html house-to-flat.html privacy-policy.html
```

Expected: no output (all files now contain the consent block).

```bash
grep -rL "consent.js" basement-conversions.html commercial.html lofts.html new-builds.html renovations.html extensions.html house-to-flat.html privacy-policy.html
```

Expected: no output (all files have the script tag).

- [ ] **Step 11: Commit**

```bash
git add basement-conversions.html commercial.html lofts.html new-builds.html renovations.html extensions.html house-to-flat.html privacy-policy.html
git commit -m "feat(pages): add GA4 consent mode v2 and cookie banner to all subpages"
```

---

## Task 4: Fix BreadcrumbList schema bug in `index.html`

**Files:**
- Modify: `index.html:107`

The BreadcrumbList structured data lists `/basements` as the URL for the Basements page, but the actual page is at `/basement-conversions`.

- [ ] **Step 1: Fix the wrong URL in `index.html`**

Find (line 107):
```json
      { "@type": "ListItem", "position": 5, "name": "Basements", "item": "https://byfabrico.com/basements" },
```

Replace with:
```json
      { "@type": "ListItem", "position": 5, "name": "Basement Conversions", "item": "https://byfabrico.com/basement-conversions" },
```

- [ ] **Step 2: Verify**

```bash
grep -n "byfabrico.com/basements" index.html
```

Expected: no output (the wrong URL is gone).

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "fix: correct BreadcrumbList schema URL /basements -> /basement-conversions"
```

---

## Task 5: Rewrite `sitemap.xml`

**Files:**
- Modify: `sitemap.xml`

Currently the sitemap only lists the homepage and `/basement-conversions`. It also includes `#anchor` fragment entries which Googlebot ignores and which shouldn't be in sitemaps.

- [ ] **Step 1: Replace the entire content of `sitemap.xml`**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">

  <url>
    <loc>https://byfabrico.com/</loc>
    <lastmod>2026-11-06</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>

  <url>
    <loc>https://byfabrico.com/basement-conversions</loc>
    <lastmod>2026-11-06</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>

  <url>
    <loc>https://byfabrico.com/lofts</loc>
    <lastmod>2026-11-06</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>

  <url>
    <loc>https://byfabrico.com/new-builds</loc>
    <lastmod>2026-11-06</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>

  <url>
    <loc>https://byfabrico.com/renovations</loc>
    <lastmod>2026-11-06</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>

  <url>
    <loc>https://byfabrico.com/extensions</loc>
    <lastmod>2026-11-06</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>

  <url>
    <loc>https://byfabrico.com/commercial</loc>
    <lastmod>2026-11-06</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>https://byfabrico.com/house-to-flat</loc>
    <lastmod>2026-11-06</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>https://byfabrico.com/privacy-policy</loc>
    <lastmod>2026-11-06</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.4</priority>
  </url>

</urlset>
```

- [ ] **Step 2: Verify URL count**

```bash
grep -c "<loc>" sitemap.xml
```

Expected: `9`

- [ ] **Step 3: Commit**

```bash
git add sitemap.xml
git commit -m "fix: add all service pages to sitemap, remove fragment entries"
```

---

## Task 6: Add UTM cheat-sheet to `README.md`

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Append the UTM section to `README.md`**

Add at the end of the file:

```markdown

---

## UTM Links for Marketing

Use these tagged URLs when sharing the site. They ensure GA4 correctly attributes the visit source instead of showing `(direct) / (none)`.

| Channel | Copy this URL |
|---------|---------------|
| Instagram bio | `https://byfabrico.com?utm_source=instagram&utm_medium=social&utm_campaign=bio` |
| WhatsApp message | `https://byfabrico.com?utm_source=whatsapp&utm_medium=referral` |
| Email signature | `https://byfabrico.com?utm_source=email&utm_medium=email&utm_campaign=signature` |
| Google Business Profile | `https://byfabrico.com?utm_source=google_business&utm_medium=organic` |
| Checkatrade / Houzz | `https://byfabrico.com?utm_source=checkatrade&utm_medium=directory` |

**How to build a custom UTM link:**  
Append `?utm_source=X&utm_medium=Y&utm_campaign=Z` to any page URL.  
Example for a specific campaign landing on the basements page:  
`https://byfabrico.com/basement-conversions?utm_source=instagram&utm_medium=social&utm_campaign=basement_summer_2026`
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: add UTM cheat-sheet for marketing channels"
```

---

## Task 7: Browser test + push

- [ ] **Step 1: Start the local server**

```bash
python serve.py
```

Then open `http://localhost:8000` in a browser.

- [ ] **Step 2: Test new visitor flow**

1. Open DevTools → Application → Local Storage → clear `fabrico_consent` key if it exists
2. Hard-refresh the page
3. Expected: cookie banner appears at the bottom of the page
4. Click **Accept**
5. Expected: banner disappears, `fabrico_consent = granted` appears in localStorage
6. Hard-refresh
7. Expected: banner does NOT reappear

- [ ] **Step 3: Test decline flow**

1. Clear `fabrico_consent` from localStorage
2. Hard-refresh
3. Click **Decline**
4. Expected: banner disappears, `fabrico_consent = denied` in localStorage
5. Hard-refresh
6. Expected: banner does NOT reappear

- [ ] **Step 4: Test returning-visitor consent tracking in Network tab**

1. Set `fabrico_consent = granted` in localStorage manually (Application tab → Local Storage → add key)
2. Hard-refresh
3. Open Network tab, filter by `google-analytics` or `gtag`
4. Expected: GA4 fires a `page_view` hit WITH cookies (you'll see `_ga` cookie in the request)
5. Set `fabrico_consent = denied`
6. Hard-refresh
7. Expected: GA4 still fires (cookieless ping for modeling) but no `_ga` cookie in the request

- [ ] **Step 5: Test on a subpage**

Navigate to `http://localhost:8000/basement-conversions` (or open `basement-conversions.html` directly).
Repeat Steps 2–3. Banner should appear and work identically.

- [ ] **Step 6: Verify sitemap renders correctly**

Open `http://localhost:8000/sitemap.xml` — should show 9 `<loc>` entries, no `#` fragments.

- [ ] **Step 7: Push to GitHub Pages**

```bash
git push origin main
```

Wait ~60 seconds for GitHub Pages to deploy, then verify at `https://byfabrico.com` that:
- Banner appears on first visit (use incognito window to simulate new visitor)
- Accept/Decline both work
- Banner does not reappear after choice

- [ ] **Step 8: Submit updated sitemap to Google Search Console**

In Google Search Console → Sitemaps → submit `https://byfabrico.com/sitemap.xml`.
This prompts Googlebot to re-crawl and index the previously missing service pages.
