# B2B Trade & Professionals Section — byfabrico.com

**Date:** 2026-11-06
**Repo:** github.com/B1t3My8B1t/byfabrico (GitHub Pages static site)

---

## Goal

Make byfabrico.com more visible to architects, surveyors, and project managers so the site can support Google Ads targeting trade professionals. Add a dedicated homepage section for the professional audience, host the existing trade pack PDF, and tighten service page meta descriptions for richer search snippets.

---

## Architecture

Static site: standalone HTML files served by GitHub Pages. No build system. All changes are HTML edits + one binary asset commit.

**Changes required:**
1. New `#trade` section in `index.html` — just before the contact section (L1097)
2. Footer link to `#trade` — added to the "Company" column in the footer
3. Fix 6 thin meta descriptions — `lofts.html`, `new-builds.html`, `renovations.html`, `extensions.html`, `commercial.html`, `house-to-flat.html`
4. Commit `assets/ByFabrico.pdf` to git (file already exists in the working tree)

---

## Section 1: Trade & Professionals section on index.html

**Location:** Inserted immediately before `<section class="contact-layout" id="contact">` (currently at L1097 of `index.html`). Inserted after the Instagram banner `</style>` closing tag at L1095.

**Style:** Matches the existing `.ig-banner` block — `background:var(--near-black)`, same padding/border pattern. Uses a new class `.trade-banner` so its CSS is independent.

**HTML structure:**

```html
<div class="trade-banner" id="trade">
  <div>
    <div class="trade-eyebrow">Professionals & Trade</div>
    <div class="trade-heading">Working with Architects &amp; Design Professionals</div>
    <p class="trade-copy">We work directly with architects, surveyors, interior designers and project managers across London and Berkshire. Our team handles the entire build — from planning submission to handover — so you can focus on design.</p>
    <div class="trade-trust">CHAS Accredited &nbsp;·&nbsp; Fully Insured &nbsp;·&nbsp; 200+ Projects Delivered</div>
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
```

**CSS variables used** (already defined in index.html):
- `--near-black`: dark background
- `--white`: white text
- `--teal`: primary CTA button background
- `--teal-light`: hover state

---

## Section 2: Footer link

**Location:** The "Company" column in `<footer>` (currently ends at L1203 with Privacy Policy). Add one new list item:

```html
<li><a href="#trade">Trade & Professionals</a></li>
```

Add it after the Privacy Policy entry so it appears at the bottom of the Company column.

---

## Section 3: Meta description improvements

Target length: 140–160 characters. Each description should include the city context, the specific service, and a trust signal or unique differentiator.

| File | Current (chars) | New description |
|------|-----------------|-----------------|
| `lofts.html` | ~99 | `Expert loft conversions in London — dormer, mansard and hip-to-gable. Fabrico Design & Build delivers architect-quality loft extensions with full project management.` |
| `new-builds.html` | ~101 | `Bespoke new build homes in London and Berkshire. Fabrico Design & Build manages design, planning and construction from groundworks to handover — no compromises.` |
| `renovations.html` | ~92 | `Full-scale renovations and back-to-brick refurbishments across London. Fabrico Design & Build handles structural work, interiors and project management end to end.` |
| `extensions.html` | ~96 | `Rear, side-return and over-garage extensions in London. Fabrico Design & Build designs and builds high-spec kitchen and living extensions with planning support.` |
| `commercial.html` | ~130 | `Commercial fit-outs, office refurbishments and retail renovations across London. Fabrico Design & Build delivers on spec, on time — with minimal disruption to occupants.` |
| `house-to-flat.html` | ~96 | `House-to-flat conversions and permitted development in London. Fabrico Design & Build manages planning, structural works and fit-out for maximum rental yield.` |

---

## Section 4: Commit ByFabrico.pdf

The file `assets/ByFabrico.pdf` (2.6 MB) already exists in the working tree but has not been committed. It must be staged and committed as part of this work so the Download Trade Pack link resolves on the live site.

**Git command:**
```bash
git add assets/ByFabrico.pdf
git commit -m "feat: add trade pack PDF asset"
```

---

## Files Changed

| File | Change |
|------|--------|
| `index.html` | Add `#trade` section + `<style>` block before contact section; add footer link |
| `lofts.html` | Update meta description |
| `new-builds.html` | Update meta description |
| `renovations.html` | Update meta description |
| `extensions.html` | Update meta description |
| `commercial.html` | Update meta description |
| `house-to-flat.html` | Update meta description |
| `assets/ByFabrico.pdf` | Commit existing file to git |

---

## Out of Scope

- Dedicated `/for-architects` landing page (Option B — deferred; only worth building if running targeted ads to it)
- Schema markup for the trade section
- Form or gated PDF download (PDF is open/ungated by design — lower friction for trade professionals)
