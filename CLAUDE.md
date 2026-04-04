# CLAUDE.md — Fabrico Design & Build
> This file gives Claude Code full context on the project, stack, conventions, and goals.

---

## Project Overview

**Client:** Fabrico Design & Build
**Website:** [https://www.byfabrico.com](https://www.byfabrico.com)
**Type:** High-end construction & interior design company
**Location:** London & Berkshire, UK
**Founded:** 2017

This is a single-page marketing website for a luxury construction company.
The site is hosted on **GitHub Pages** (repo: `b1t3my8b1t/byfabrico`) with a custom domain managed via **IONOS**.

---

## Tech Stack

| Layer | Tech |
|---|---|
| Hosting | GitHub Pages |
| Domain | IONOS — byfabrico.com |
| HTML | Vanilla HTML5 (single `index.html`) |
| CSS | Embedded `<style>` block in `index.html` |
| Fonts | Google Fonts — Bodoni Moda + Outfit |
| Forms | Web3Forms (access key in index.html) |
| SEO | Schema.org JSON-LD, sitemap.xml, robots.txt |
| Analytics | Google Search Console (verified) |
| Indexing | Google + Bing Webmaster Tools (active) |
| Version Control | Git → GitHub |
| Dev Environment | WSL2 (Ubuntu) on Windows 11 — user: babait |

---

## Repository Structure

```
byfabrico/
├── assets/
│   └── images/
│       ├── projects/
│       │   ├── chelsea/          # SW3 full renovation & extension
│       │   ├── cookham/          # Berkshire new build
│       │   ├── georgestreet/     # Mayfair luxury refurbishment
│       │   ├── thelittleboltons/ # SW5 apartment refurbishment
│       │   ├── renovations/      # General renovation projects
│       │   └── structural/       # Structural works
│       └── general/              # NewBuilds, Patio, end_to_end before/after
├── index.html                    # Main single-page site
├── CNAME                         # GitHub Pages custom domain → byfabrico.com
├── robots.txt                    # Crawl rules
├── sitemap.xml                   # XML sitemap for Google/Bing
├── README.md
└── CLAUDE.md                     # This file
```

---

## Key Business Details

- **Phone:** 07940 219 219 / 0203 883 8288
- **Email:** info@byfabrico.com
- **Address:** 54 Poland Street, Soho, London W1F 7NJ
- **Instagram:** @fabrico_design_build
- **Services:** New Builds, Full Renovations, Extensions, Loft Conversions, Basement Conversions, M&E & Project Management, Interior Design
- **Coverage:** Chelsea, Kensington, Mayfair, Notting Hill, Belgravia, Fulham, Battersea, Knightsbridge, Wandsworth, Richmond, Maidenhead, Windsor, Marlow, Ascot, Cookham, Henley-on-Thames

---

## Site Sections (index.html anchors)

| Anchor | Section |
|---|---|
| `#top` | Hero |
| `#about` | About Fabrico |
| `#services` | Services grid (6 services) |
| `#enquire` | Service selector + contact form |
| `#projects` | Portfolio (Chelsea, Mayfair, SW5, Cookham, Renovations, New Builds, Structural, Before/After) |
| `#process` | 5-step process strip |
| `#reviews` | 3 client testimonials |
| `#contact` | Contact details + enquiry form |

---

## Design System

```css
--white:       #ffffff
--off:         #f7f6f4
--off2:        #f0ede8
--near-black:  #0f0f0d
--ink:         #1a1a18
--mid:         #5a5a56
--faint:       #b0afa8
--teal:        #1b5e50      /* Primary brand colour */
--teal-light:  #2e8a71
--teal-pale:   #e8f0ee
--gold:        #c9a96e      /* Used for star ratings */
```

**Fonts:**
- `Bodoni Moda` — headings, serif, editorial feel
- `Outfit` — body, clean, weight 200–500

**Design principles:**
- Minimal, luxury aesthetic
- No unnecessary colour — teal accents only
- Grid-based layouts with 1px rule borders
- Uppercase tracking on labels and kickers
- Hover states on all interactive elements

---

## SEO Configuration

- **Schema:** LocalBusiness, FAQPage, BreadcrumbList (all in `<head>`)
- **Meta:** title, description, keywords, og:*, twitter:*
- **hreflang:** en-gb
- **Sitemap:** `/sitemap.xml`
- **Robots:** `/robots.txt` — all crawlers allowed, admin/private blocked
- **Google verification:** meta tag in `<head>`
- **Canonical:** https://www.byfabrico.com/
- **Status:** Indexed on Google & Bing. Awaiting Google Business Profile update.

---

## Forms

- **Provider:** Web3Forms
- **Access key:** `2984b81e-fd14-4e9d-92e9-4ae661b43999`
- **Sends to:** info@byfabrico.com
- **Fields:** First name, Last name, Email, Phone, Location, Budget, Message, Services selected
- **Hidden fields:** access_key, subject, from_name, services_selected

---

## Git Workflow

```bash
# Standard commit and push
git add .
git commit -m "descriptive message"
git push origin main
```

- **Branch:** `main`
- **Remote:** `https://github.com/b1t3my8b1t/byfabrico.git`
- **Auth:** Personal Access Token (stored via credential.helper) — migrate to SSH when ready
- **Deploy:** Automatic on push via GitHub Pages

---

## Current Priorities

1. [ ] Reorganise flat file structure into `assets/images/projects/` subfolders
2. [ ] Update all image `src` paths in `index.html` after restructure
3. [ ] Optimise large images (chelsea_01.jpg and Patio.jpg are 7MB+ — need compressing)
4. [ ] Switch Git auth from HTTPS token to SSH key (`id_ed25519` already exists)
5. [ ] Add `og-image.jpg` (referenced in meta but missing from repo)
6. [x] Add `privacy-policy` page (linked in footer)
7. [ ] Await Google Business Profile verification
8. [ ] Consider adding Google Analytics (GA4)

---

## Image Optimisation Notes

These files are oversized and should be compressed before next deployment:

| File | Current Size | Target |
|---|---|---|
| `chelsea_01.jpg` | 7.3MB | <400KB |
| `Patio.jpg` | 7.3MB | <400KB |
| `end_to_end_after.png` | 7.8MB | <500KB |
| `end_to_end_before.png` | 2.1MB | <300KB |
| `structural_04.png` | 1.7MB | <300KB |
| `structural_05.png` | 1.6MB | <300KB |

Use `squoosh`, `imagemagick`, or `sharp` to compress.

---

## Dev Environment Notes

- **OS:** Windows 11 + WSL2 (Ubuntu)
- **WSL user:** `babait`
- **Project path:** `/home/babait/byfabrico`
- **Node:** v24.14.1 (via nvm)
- **npm:** v11.12.1
- **Claude Code:** installed globally via npm

---

## Claude Code Instructions

When working on this project:

1. **Always preserve the design system** — use existing CSS variables, never introduce new colours
2. **Keep it single-file** — all CSS and JS stays in `index.html` unless explicitly told otherwise
3. **SEO is critical** — never remove or alter schema, meta tags, or canonical URLs without instruction
4. **Images** — always use relative paths, always include `alt`, `loading="lazy"`, `width` and `height`
5. **Forms** — do not change the Web3Forms access key or hidden field structure
6. **Git** — always `git add . && git commit -m "..." && git push origin main` after completing tasks
7. **CNAME** — never delete or modify this file — it controls the custom domain
8. **Test responsiveness** — the site has a full mobile breakpoint at 960px, always check both layouts
