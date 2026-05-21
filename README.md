# La Dolce Gera — Pitch Site + Telegram Importer

Ukrainian confectionery (Konditorei) operating inside restaurant 1880 ABACO in Gera, Germany. Pitch-deliverable Astro site + Node-based importer that turns a Telegram Desktop channel export into the site's content collections.

**🟣 Live:** https://dolcevitta-tawny.vercel.app
**📐 Spec:** [docs/superpowers/specs/2026-05-21-la-dolce-gera-site-and-importer-design.md](docs/superpowers/specs/2026-05-21-la-dolce-gera-site-and-importer-design.md)
**🤖 Continue in a new AI session:** open [docs/master-prompt-antigravity.md](docs/master-prompt-antigravity.md) and paste it into Anti-Gravity / Cursor / Codex
**💡 What's next:** [docs/v2-ideas-and-gaps.md](docs/v2-ideas-and-gaps.md) — v2 directions + gap-audit of v1

---

## Quick start

```bash
npm install         # one-time

npm run dev         # dev server at http://127.0.0.1:4321
npm run build       # production build into dist/
npm run preview     # serve dist/ for verification
npm run check       # astro check (type-validate content + routes)
```

## Filling the site from a Telegram export

1. In Telegram Desktop → channel → ⋯ → **Export chat history** → format **HTML** → choose photos + videos.
2. Run the importer:
   ```bash
   npm run import -- "C:\path\to\ChatExport_2026-05-21"
   # or:  node scripts/import_tg_to_content.mjs "<path-to-export>"
   ```
3. Optional flags:
   ```bash
   --dry-run                # show what would be written, change nothing
   --since=2024-09-01       # skip messages older than this date
   --max-photos=8           # cap photos per catalog card (default 8)
   --max-journal=60         # cap journal entries to keep (default 60)
   ```
4. Importer outputs:
   - `src/content/tortes/*.mdx` — custom cake catalog (one MDX per cake type, consolidated)
   - `src/content/sweets/*.mdx` — cupcakes + cookies + macarons + brownie etc.
   - `src/content/journal/*.mdx` — Telegram posts (in-stock / showcase / delivered / testimonial / event_teaser / seasonal)
   - `public/photos/*.webp` — resized + WebP-optimised images (max 1600px, q82)
   - `analysis/import-report-*.json` — what was classified, dropped, written

The importer is **idempotent** — running it twice on the same export does nothing new. It also drops greetings, local-recommendation posts, conflict threads, and anything under 10 chars.

## Project layout

```
src/
  pages/                   # Astro routes (file-based)
    index.astro            # DE home (default locale = no prefix)
    impressum.astro        # §5 TMG legal page
    datenschutz.astro      # DSGVO privacy policy
    tortes/                # custom-cake catalog
      index.astro
      [slug].astro         # one per cake type
    sweets/                # small-format sweets catalog
      index.astro
      [slug].astro
    journal/               # imported channel posts
      index.astro
      [slug].astro
    uk/                    # Ukrainian locale (mirrors DE structure)
    404.astro

  components/              # Reusable .astro components
    Base.astro             # in layouts/, wraps every page
    Nav.astro
    Footer.astro
    HeroLogo.astro
    HomeContent.astro      # large home-page composition
    CatalogIndex.astro     # tortes/sweets list
    CatalogDetail.astro    # tortes/sweets single page
    JournalIndex.astro
    JournalDetail.astro
    CardTorte.astro
    AllergenList.astro
    TelegramCta.astro
    PlaceholderBanner.astro
    LegalPage.astro

  content/
    config.ts              # Zod schemas for tortes / sweets / journal collections
    tortes/*.mdx           # populated by importer
    sweets/*.mdx
    journal/*.mdx

  i18n/
    de.json                # German UI strings (default)
    uk.json                # Ukrainian UI strings
    ui.ts                  # t() helper + locale routing

  styles/
    global.css             # Tailwind v4 + custom CSS (theme tokens, btn, kicker, etc.)

scripts/
  analyze_tg_export.mjs    # Read-only analyzer (prints stats, dumps JSON)
  import_tg_to_content.mjs # Importer bot — populates content collections
  tg_parser.mjs            # Shared HTML parser (entities, blocks, dates, owner detect)
  catalog_map.mjs          # Cake-type keyword → catalog card mapping + drop patterns

analysis/                  # importer reports + raw extracted data (not deployed)
docs/superpowers/specs/    # design spec
public/photos/             # webp output of importer (deployed)
```

## Brand tokens

CSS variables defined in `src/styles/global.css`. Edit there to retune:

| Token | Value | Use |
|---|---|---|
| `--color-crema` | `#F7EEE3` | page background |
| `--color-warm-white` | `#FFFBF5` | cards |
| `--color-burgundy` | `#8B2635` | primary, links |
| `--color-burgundy-deep` | `#5D1A26` | hover |
| `--color-espresso` | `#3A2419` | body text |
| `--color-gold` | `#C9A565` | accent |
| `--color-mist` | `#E8DCC9` | borders, image background |
| `--font-display` | Cormorant Garamond | headings, italic display |
| `--font-body` | Inter | body |

Fonts are **self-hosted via @fontsource** packages — no Google Fonts CDN (DSGVO).

## i18n routing

- DE = default. URL stays clean: `/`, `/tortes`, `/journal`, etc.
- UK = `/uk/`, `/uk/tortes`, `/uk/journal`.
- Each page has `<link rel="alternate" hreflang="...">` to its sibling locale.
- Legal pages: **DE is legally authoritative**; UK is informational translation with a disclaimer link to the DE version.
- Toggle in nav swaps URLs symmetrically.

## German legal scope

- **Impressum** at `/impressum` with §5 TMG fields. Placeholders (Telefon, E-Mail, USt-IdNr, Rechtsform) are visually flagged (`<span class="placeholder-tag">…</span>`) and the **yellow demo banner** sits at the top of every page until those are filled.
- **Datenschutzerklärung** at `/datenschutz`: explicit Vercel hosting clause (Frankfurt + USA SCC), explicit "no Google Fonts CDN", "no Maps embed", "no analytics in v1, hence no cookie banner". TLfDI (Thuringia) named as Aufsichtsbehörde.
- **Allergens** declared per item; conservative defaults (Gluten / Eier / Milch) with an "ask via Telegram for current info" disclaimer.
- **Pricing** noted "inkl. 7% MwSt" (reduced VAT for foodstuffs).
- **WCAG 2.1 AA** by design: semantic HTML, palette-passing contrast, alt text on every photo, keyboard-navigable nav + lang switcher, no autoplay.

## Deploy

Recommended target: **Vercel** (matches what the Datenschutzerklärung says). Push the repo and connect — Astro v5 is auto-detected. Build command: `npm run build`; output directory: `dist`.

Before flipping to a production URL: fill the Impressum placeholders, get owner consent for any customer-attributed testimonials beyond the anonymised demo set, swap the demo banner off (delete `<PlaceholderBanner />` from `src/layouts/Base.astro`).

## What's intentionally out of scope (v1)

See [spec §3 Non-Goals](docs/superpowers/specs/2026-05-21-la-dolce-gera-site-and-importer-design.md#3-non-goals). Short list: online ordering, AGB, CMS / admin, live channel watcher, kids-party booking page, Russian translation.
