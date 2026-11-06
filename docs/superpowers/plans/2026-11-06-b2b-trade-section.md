# B2B Trade & Professionals Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Trade & Professionals section to the homepage, host the trade pack PDF, add a footer link, and tighten all 6 service page meta descriptions.

**Architecture:** Static HTML site served by GitHub Pages. No build system, no bundler. All changes are direct edits to standalone `.html` files. The PDF asset already exists in the working tree and just needs committing. Each task produces a standalone commit.

**Tech Stack:** Plain HTML, inline CSS (matches existing site pattern), git

---

## File Map

| File | Change |
|------|--------|
| `assets/ByFabrico.pdf` | Stage and commit (already on disk) |
| `index.html` | Add `#trade` section before contact (L1097); add footer link in Company column (L1201) |
| `lofts.html` | Update `<meta name="description">` at L15 |
| `new-builds.html` | Update `<meta name="description">` at L15 |
| `renovations.html` | Update `<meta name="description">` at L15 |
| `extensions.html` | Update `<meta name="description">` at L15 |
| `commercial.html` | Update `<meta name="description">` at L15 |
| `house-to-flat.html` | Update `<meta name="description">` at L15 |

---

## Task 1: Commit ByFabrico.pdf

The file `assets/ByFabrico.pdf` (2.6 MB) already exists on disk but has never been committed. The Download Trade Pack button will 404 until this is in git.

**Files:**
- Stage: `assets/ByFabrico.pdf`

- [ ] **Step 1: Verify the file exists**

```powershell
ls "C:\Users\LeNZ\dev\byfabrico\assets\ByFabrico.pdf"
```

Expected: file listed, size ~2.6 MB.

- [ ] **Step 2: Stage and commit the PDF**

```bash
git add assets/ByFabrico.pdf
git commit -m "feat: add trade pack PDF asset"
```

Expected output: `1 file changed` with a binary file addition.

- [ ] **Step 3: Verify it is tracked**

```bash
git show --stat HEAD
```

Expected: shows `assets/ByFabrico.pdf` in the diff.

---

## Task 2: Add Trade & Professionals section to index.html

**Files:**
- Modify: `index.html` — insert new section between the Instagram banner `</style>` (L1095) and `<section class="contact-layout" id="contact">` (L1097)

The section uses the same dark-background pattern as `.ig-banner`. It has its own class `.trade-banner` and its own `<style>` block immediately after.

- [ ] **Step 1: Verify the insertion point**

Open `index.html` and check that L1095–1097 reads:

```html
  </style>

  <section class="contact-layout" id="contact">
```

If line numbers have drifted, search for `</style>` immediately before `<section class="contact-layout"`.

- [ ] **Step 2: Insert the trade section**

In `index.html`, replace:

```html
  </style>

  <section class="contact-layout" id="contact">
```

with:

```html
  </style>

  <div class="trade-banner" id="trade">
    <div>
      <div class="trade-eyebrow">Professionals &amp; Trade</div>
      <div class="trade-heading">Working with Architects &amp; Design Professionals</div>
      <p class="trade-copy">We work directly with architects, surveyors, interior designers and project managers across London and Berkshire. Our team handles the entire build — from planning submission to handover — so you can focus on design.</p>
      <div class="trade-trust">Fully Insured &nbsp;·&nbsp; 200+ Projects Delivered</div>
      <div class="trade-ctas">
        <a href="/assets/ByFabrico.pdf" target="_blank" rel="noopener" class="trade-btn-primary">Download Trade Pack</a>
        <a href="mailto:info@byfabrico.com" class="trade-btn-secondary">Email the Trade Team</a>
      </div>
    </div>
  </div>
  <style>
    .trade-banner { background:var(--near-black); padding:60px; border-top:1px solid rgba(255,255,255,0.06); }
    .trade-eyebrow { font-size:9px; letter-spacing:0.4em; text-transform:uppercase; color:rgba(46,138,113,0.8); margin-bottom:12px; }
    .trade-heading { font-family:'Playfair Display',serif; font-size:clamp(22px,3vw,36px); color:var(--white); font-weight:300; margin-bottom:16px; }
    .trade-copy { font-size:14px; color:rgba(255,255,255,0.55); line-height:1.75; max-width:620px; margin-bottom:16px; }
    .trade-trust { font-size:10px; letter-spacing:0.1em; text-transform:uppercase; color:rgba(255,255,255,0.3); margin-bottom:28px; }
    .trade-ctas { display:flex; gap:16px; flex-wrap:wrap; }
    .trade-btn-primary { display:inline-block; padding:16px 36px; background:var(--teal); color:var(--white); text-decoration:none; font-size:11px; letter-spacing:0.2em; text-transform:uppercase; transition:background 0.25s; }
    .trade-btn-primary:hover { background:var(--teal-light); }
    .trade-btn-secondary { display:inline-flex; align-items:center; padding:16px 32px; border:1px solid rgba(255,255,255,0.15); color:rgba(255,255,255,0.8); text-decoration:none; font-size:11px; letter-spacing:0.2em; text-transform:uppercase; transition:all 0.25s; }
    .trade-btn-secondary:hover { border-color:var(--teal-light); color:var(--teal-light); }
    @media (max-width:960px) { .trade-banner { padding:40px 24px; } }
  </style>

  <section class="contact-layout" id="contact">
```

- [ ] **Step 3: Verify the section was inserted correctly**

```bash
grep -n "trade-banner\|trade-heading\|Download Trade Pack" index.html
```

Expected: 3+ matches, all within a few lines of each other, well before the contact section.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: add Trade & Professionals section to homepage"
```

---

## Task 3: Add footer link to index.html

**Files:**
- Modify: `index.html` — Company column in `<footer>`, after the Privacy Policy list item (~L1201)

- [ ] **Step 1: Verify the insertion point**

Search for the Privacy Policy footer link:

```bash
grep -n "privacy-policy\|Privacy Policy" index.html | grep "footer\|<li>"
```

Expected: one match around L1201 that reads:
```html
<li><a href="/privacy-policy">Privacy Policy</a></li>
```

- [ ] **Step 2: Add the Trade & Professionals link**

In `index.html`, replace:

```html
          <li><a href="/privacy-policy">Privacy Policy</a></li>
        </ul>
      </div>
      <div class="fcol">
        <h4>Contact</h4>
```

with:

```html
          <li><a href="/privacy-policy">Privacy Policy</a></li>
          <li><a href="#trade">Trade &amp; Professionals</a></li>
        </ul>
      </div>
      <div class="fcol">
        <h4>Contact</h4>
```

- [ ] **Step 3: Verify the link was added**

```bash
grep -n "trade\|Trade" index.html | grep "footer\|fcol\|<li>"
```

Expected: one match showing `<li><a href="#trade">Trade &amp; Professionals</a></li>`.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: add Trade & Professionals link to footer"
```

---

## Task 4: Fix meta descriptions on 6 service pages

**Files:**
- Modify: `lofts.html` L15
- Modify: `new-builds.html` L15
- Modify: `renovations.html` L15
- Modify: `extensions.html` L15
- Modify: `commercial.html` L15
- Modify: `house-to-flat.html` L15

Each file has a `<meta name="description" content="..."/>` at L15. Replace each one with the value below (140–160 chars, specific service detail + trust signal).

- [ ] **Step 1: Update lofts.html**

Replace:
```html
  <meta name="description" content="Loft conversion services in London. Dormer and mansard loft conversions by Fabrico Design &amp; Build."/>
```
With:
```html
  <meta name="description" content="Expert loft conversions in London — dormer, mansard and hip-to-gable. Fabrico Design &amp; Build delivers architect-quality loft extensions with full project management."/>
```

- [ ] **Step 2: Update new-builds.html**

Replace:
```html
  <meta name="description" content="Bespoke new build homes in London and Berkshire. Design and build services by Fabrico Design &amp; Build."/>
```
With:
```html
  <meta name="description" content="Bespoke new build homes in London and Berkshire. Fabrico Design &amp; Build manages design, planning and construction from groundworks to handover — no compromises."/>
```

- [ ] **Step 3: Update renovations.html**

Replace:
```html
  <meta name="description" content="Full renovation and back-to-brick refurbishment services in London by Fabrico Design &amp; Build."/>
```
With:
```html
  <meta name="description" content="Full-scale renovations and back-to-brick refurbishments across London. Fabrico Design &amp; Build handles structural work, interiors and project management end to end."/>
```

- [ ] **Step 4: Update extensions.html**

Replace:
```html
  <meta name="description" content="House extension services in London. Rear, side and kitchen extensions by Fabrico Design &amp; Build."/>
```
With:
```html
  <meta name="description" content="Rear, side-return and over-garage extensions in London. Fabrico Design &amp; Build designs and builds high-spec kitchen and living extensions with planning support."/>
```

- [ ] **Step 5: Update commercial.html**

Replace:
```html
  <meta name="description" content="Commercial construction services in London. Office fit-outs, refurbishments, and commercial renovations by Fabrico Design &amp; Build."/>
```
With:
```html
  <meta name="description" content="Commercial fit-outs, office refurbishments and retail renovations across London. Fabrico Design &amp; Build delivers on spec, on time — with minimal disruption to occupants."/>
```

- [ ] **Step 6: Update house-to-flat.html**

Replace:
```html
  <meta name="description" content="House-to-flat conversions and permitted development services in London by Fabrico Design &amp; Build."/>
```
With:
```html
  <meta name="description" content="House-to-flat conversions and permitted development in London. Fabrico Design &amp; Build manages planning, structural works and fit-out for maximum rental yield."/>
```

- [ ] **Step 7: Verify all 6 descriptions were updated**

```bash
grep -n "meta name=\"description\"" lofts.html new-builds.html renovations.html extensions.html commercial.html house-to-flat.html
```

Expected: 6 lines, each containing the new longer description text (none should still say "by Fabrico Design & Build." at the end — the new versions all end differently).

- [ ] **Step 8: Commit**

```bash
git add lofts.html new-builds.html renovations.html extensions.html commercial.html house-to-flat.html
git commit -m "seo: expand meta descriptions on all 6 service pages"
```
