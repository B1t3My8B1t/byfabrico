# GA4 Analytics Fixes — byfabrico.com

**Date:** 2026-11-06  
**Repo:** github.com/B1t3My8B1t/byfabrico (GitHub Pages static site)  
**GA4 ID:** G-WGYN4EZ5EB

---

## Problem

Google Analytics shows misleading data: "direct / none" source for many sessions, UK location appearing without source context. Root causes identified:

1. No GA4 Consent Mode v2 — UK GDPR non-compliant; modeled data can pollute attribution
2. No cookie consent banner — users never get the chance to opt-in; analytics always runs unconsented
3. BreadcrumbList schema in `index.html` uses wrong slug (`/basements` → should be `/basement-conversions`)
4. Sitemap only lists homepage + `/basement-conversions`; 6 service pages are missing
5. No UTM parameters on any outbound marketing links — WhatsApp/Instagram/email all appear as `(direct)`

---

## Architecture

Static site: 8 standalone HTML files served by GitHub Pages. No build system, no bundler. Assets in `/assets/`.

New file: `assets/consent.js` — single source of truth for the cookie banner. All 8 HTML files get a `<script src="/assets/consent.js">` reference added.

---

## Fix 1: GA4 Consent Mode v2 (all 8 HTML files)

In every `<head>`, **before** the existing `gtag('config', ...)` call, insert:

```html
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('consent', 'default', {
    'analytics_storage': 'denied',
    'ad_storage': 'denied',
    'wait_for_update': 500
  });
</script>
```

Then the existing GA4 script block follows unchanged:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-WGYN4EZ5EB"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-WGYN4EZ5EB');
</script>
```

**Note:** `gtag()` and `dataLayer` are redeclared in the second block — this is the standard GA4 pattern and is safe (array already exists, function is idempotent).

Affected files: `index.html`, `basement-conversions.html`, `commercial.html`, `lofts.html`, `new-builds.html`, `renovations.html`, `extensions.html`, `house-to-flat.html`

---

## Fix 2: Cookie Consent Banner (`assets/consent.js`)

New file. Self-contained: renders banner HTML, injects CSS, handles user choice.

**Behaviour:**
- On page load: check `localStorage.getItem('fabrico_consent')`
  - If `'granted'` → call `gtag('consent', 'update', { analytics_storage: 'granted', ad_storage: 'granted' })`, no banner
  - If `'denied'` → no banner, leave consent as denied
  - If `null` → show banner
- Accept button → update consent to `granted`, persist `'granted'` in localStorage, hide banner
- Decline button → persist `'denied'` in localStorage, hide banner (consent stays denied)
- Banner resets if localStorage is cleared (standard browser behaviour)

**UI:** Fixed bottom bar, matches Fabrico brand (`#1b5e50` teal, Outfit font already loaded). Minimal: one line of text + two buttons (Accept / Decline). No overlay, no blocking.

**Script tag added to every page** (just before `</body>`):
```html
<script src="/assets/consent.js"></script>
```

---

## Fix 3: BreadcrumbList Schema (index.html only)

Current (wrong):
```json
{ "@type": "ListItem", "position": 5, "name": "Basements", "item": "https://byfabrico.com/basements" }
```

Fixed:
```json
{ "@type": "ListItem", "position": 5, "name": "Basements", "item": "https://byfabrico.com/basement-conversions" }
```

---

## Fix 4: Sitemap (`sitemap.xml`)

Add entries for all 6 missing service pages. Full updated URL list:

| URL | Priority | Changefreq |
|-----|----------|------------|
| `/` | 1.0 | weekly |
| `/basement-conversions` | 0.9 | monthly |
| `/lofts` | 0.9 | monthly |
| `/new-builds` | 0.9 | monthly |
| `/renovations` | 0.9 | monthly |
| `/extensions` | 0.9 | monthly |
| `/commercial` | 0.8 | monthly |
| `/house-to-flat` | 0.8 | monthly |
| `/privacy-policy` | 0.4 | yearly |

Remove the `#anchor` entries (sitemaps should not contain fragment URLs — they don't represent distinct pages and are ignored by Googlebot).

---

## Fix 5: UTM Cheat-Sheet (README.md)

Add a "UTM Links for Marketing" section to README.md with ready-to-copy tagged URLs:

| Channel | URL |
|---------|-----|
| Instagram bio | `https://byfabrico.com?utm_source=instagram&utm_medium=social&utm_campaign=bio` |
| WhatsApp shares | `https://byfabrico.com?utm_source=whatsapp&utm_medium=referral` |
| Email signature | `https://byfabrico.com?utm_source=email&utm_medium=email&utm_campaign=signature` |
| Google Business Profile | `https://byfabrico.com?utm_source=google_business&utm_medium=organic` |

---

## Files Changed

| File | Change |
|------|--------|
| `assets/consent.js` | **New** — cookie banner logic |
| `index.html` | Consent default block + consent.js script tag + schema bugfix |
| `basement-conversions.html` | Consent default block + consent.js script tag |
| `commercial.html` | Consent default block + consent.js script tag |
| `lofts.html` | Consent default block + consent.js script tag |
| `new-builds.html` | Consent default block + consent.js script tag |
| `renovations.html` | Consent default block + consent.js script tag |
| `extensions.html` | Consent default block + consent.js script tag |
| `house-to-flat.html` | Consent default block + consent.js script tag |
| `privacy-policy.html` | Consent default block + consent.js script tag |
| `sitemap.xml` | Add 6 service pages, remove fragment entries |
| `README.md` | UTM cheat-sheet section |

---

## Out of Scope

- Event tracking (contact form submissions, phone clicks) — separate task
- Google Tag Manager migration — not needed for current scale
