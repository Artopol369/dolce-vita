# Design Spec — La Dolce Gera: Pitch-Website + Telegram-Export Importer

- **Date:** 2026-05-21
- **Author:** Artem (with Claude/superpowers-brainstorming)
- **Working directory:** `C:\Users\Asus\dolcevitta\`
- **Mode:** Pitch deliverable (demo for the cafe owners to win the engagement). Production-grade structure with placeholder legal data is acceptable.
- **Status:** awaiting user review

---

## 1. Context

**The business.** *La Dolce Gera* — Ukrainian-owned confectionery (Konditorei) operating inside restaurant **1880 ABACO** at Stadtgraben 14, 07545 Gera, Thuringia. Run by **Дарья Громова + Nataliia**. Channel registered as supergroup «Konditorei im 1880 ABACO Gera» on 12.07.2024. Today (2026-05-21): 444 subscribers, no website, all orders via Telegram DM with 3-day lead.

**What we have.** A complete Telegram Desktop HTML export (`ChatExport_2026-05-21 (1)`) covering 581 messages between 12.07–31.08.2024: 412 with photos, 32 with videos. Sufficient real product photography, real prices, real customer testimonials, and real owner voice for a pitch-ready site without inventing content.

**Why a site.** The channel is doing the heavy lifting on discovery + ordering, but a website unlocks: (1) Google search for `Konditorei Gera`, `Tortenbestellung Gera`, `українські торти Gera`; (2) credibility for first-time German walk-ins; (3) DSGVO-compliant public-facing surface for the legal address, contact, and allergen disclosure that Telegram cannot legally serve; (4) a static brochure to forward to wedding/birthday clients.

**The pitch hypothesis Artem is testing.** Build something visually compelling, legally structured, and grounded in their actual content — show it to the owners cold and pitch the productisation. Phase 2 (real legal data, real consents, hand-off) only triggers if pitch lands.

## 2. Goals

**G1.** Static multilingual marketing site live on a Vercel preview URL, visually anchored in the Modern-Italian "La Dolce Vita" direction (cream + burgundy + serif headers), within one short build session.

**G2.** Real content from their own channel populates the catalog and journal — no lorem-ipsum, no stock photos. Owner sees their cakes on the page.

**G3.** German legal pages (Impressum §5 TMG, Datenschutzerklärung DSGVO) present, structurally correct, clearly marked as drafts/placeholders where real data is missing — never silently false.

**G4.** A reusable Node-based importer that turns any future Telegram export into the site's content collections, idempotent and filtered.

## 3. Non-Goals

- **No live channel-watcher / no auto-sync.** Artem explicitly framed it as "бот заполнит сайт информацией которую я скачаю" — manual export → manual run. No Telegram Bot API or MTProto integration.
- **No online ordering / no checkout / no AGB.** Their orders flow through Telegram DM with custom quotes; replicating that on the site requires legal copy and payment integration that's wrong for a pitch.
- **No CMS / no admin panel.** Owners do not edit the site. The "edit" loop is: re-export TG → re-run importer → git commit.
- **No customer-account features, no newsletter signup (yet).** Newsletter adds DSGVO consent flow that's premature.
- **No event-booking page for kids parties (yet).** Artem explicitly dropped this block from scope in brainstorming. Easy to add later as `/events`.
- **No actual customer-name-attributed testimonials in v1.** Anonymise to first-name or initials until consent flow exists.

## 4. Audiences & Top User Journeys

**Persona A — Ukrainian/Russian-speaking diaspora in Gera region (primary buyer today).**
- Lands on UK version (auto via Accept-Language or explicit switch).
- Wants: visual proof of cake variety + reassurance they can order in Ukrainian + clear lead-time + contact CTA.
- Success: lands on `/tortes`, clicks a cake card, sees signature offering, hits the "Замовити в Telegram" CTA → opens t.me/la_dolce_gera.

**Persona B — Local German walking past or googling.**
- Lands on DE version (auto by Accept-Language).
- Wants: legit confectionery in Gera, address, opening hours, what's typically available, basic allergen comfort.
- Success: sees address + map link + Telegram CTA (or copy phone if/when provided).

**Persona C — Event planner (wedding / corporate).**
- Lands anywhere, scrolls journal for proof of capability and scale (custom orders, large quantities).
- Wants: clear range of work + how-to-order + ballpark price ladder.
- Success: forwards page to decision-maker via WhatsApp / Telegram.

## 5. Site Architecture

```
/                       Home (Hero · About · 3 services · Top journal entries · Contact)
/tortes                 Custom-cake catalog (filterable by filling / occasion)
/tortes/[slug]          Single-cake detail (gallery + price + lead-time + CTA)
/sweets                 Cupcakes + cookies catalog (smaller cards, by-piece pricing)
/sweets/[slug]          Single-item detail
/journal                Reverse-chronological feed (in-stock / showcase / delivered)
/journal/[slug]         Single post detail (when text > 80 chars)
/impressum              §5 TMG legal page (DE primary, UK translation below)
/datenschutz            DSGVO privacy policy (DE primary, UK translation below)
404                     Branded not-found
```

**i18n routing.** Astro v5 i18n built-in. Default locale `de`. Routes:
- `/` → DE (no prefix), `/uk/` → UK
- `<link rel="alternate" hreflang="...">` on each page
- Legal pages: **DE is legally authoritative**, UK is informational translation (with disclaimer at top).

**Navigation.** Sticky top bar: logo (left) · Torten · Süßes · Journal · Impressum · 🇺🇦/🇩🇪 lang toggle (right). Mobile: hamburger.

**Footer.** Address · phone-placeholder · email-placeholder · Telegram icon link · `Impressum` · `Datenschutz` · © 2026 La Dolce Gera. Cookie banner only if non-essential cookies actually loaded (see §10).

## 6. Brand Direction Summary

**Confirmed: Modern Italian / La Dolce Vita.**
- **Palette:** crema `#F7EEE3` (background), burgundy `#8B2635` (primary), espresso `#3A2419` (text), gold `#C9A565` (accent), warm white `#FFFBF5` (cards).
- **Typography:** display serif (e.g. *Cormorant Garamond*, *Playfair Display* — self-hosted, no Google Fonts CDN per DSGVO) + neutral sans (e.g. *Inter*) for body.
- **Logo treatment in v1:** typeset wordmark "la dolce *Gera*" — italic display serif, two lines, with subline `CAFFÈ · DOLCI · GERA`. No icon required for v1.
- **Imagery:** their own photos. Mild treatment: consistent 4:5 crop for catalog cards, lazy-loaded, lossless WebP. Hero image = single hero cake shot from export (cherry-picked).
- **Voice:**
  - DE: warm-professional, "Hausgemachte Torten aus dem Herzen der Ukraine, frisch aus 1880 ABACO". Avoid corporate stiffness.
  - UK: warm-personal, **echo Дарья's existing voice** ("Найсмачніші ... ❤️"). Reuse phrases from her posts where on-brand.
- **Forbidden:** vyshyvanka motifs, blue-yellow gradients, brush-script font for body, stock cake photography.

## 7. Content Model

### 7.1 Astro content collections (`src/content/`)

**`tortes/<slug>.mdx`** — custom cakes catalog:
```yaml
---
title: "Наполеон"
title_de: "Napoleon"
slug: "napoleon"
price_per_kg_eur: 20
min_weight_kg: 1
lead_time_days: 3
hero_image: "../../../public/photos/napoleon-1.webp"
gallery:
  - "../../../public/photos/napoleon-2.webp"
  - "../../../public/photos/napoleon-3.webp"
tags: ["classic", "ukrainian"]
allergens: ["gluten", "eggs", "milk", "nuts"]
source_message_id: "473"
source_ts: "2024-07-28T13:19:18+01:00"
---

# UK body (default)
Класичний український Наполеон з ніжним кремом...

# DE body (after `:::de` fence)
:::de
Klassisches ukrainisches Napoleon-Törtchen mit zarter Creme...
:::
```

**`sweets/<slug>.mdx`** — same shape but `price_per_piece_eur` instead of per-kg, plus `pieces_per_kg` where relevant.

**`journal/<YYYY-MM-DD>-<id>.mdx`** — channel-imported journal entries:
```yaml
---
date: "2024-07-27"
title_uk: "Французький Фрезʼє на вітрині"
title_de: null      # auto-translate or human-fill later
category: "in_stock" | "showcase" | "delivered" | "event_teaser" | "testimonial"
photos: ["..."]
source_message_id: "456"
---
Body text from the Telegram post (UK only by default; bot doesn't translate).
```

**Why MDX, not pure Markdown.** Bot can embed a `<TelegramCta />` component at the foot of each journal entry without rewriting templates.

### 7.2 UI strings (`src/i18n/`)

Two JSON files: `de.json`, `uk.json`. Keys for nav, CTAs, footer, legal disclaimers. No translation library dependency — Astro's built-in `getStaticPaths`-driven i18n is enough.

## 8. Importer Bot Design

### 8.1 CLI

```
node scripts/import_tg_to_content.mjs <export_folder> [--dry-run] [--since YYYY-MM-DD]
```

- `<export_folder>` = path to `ChatExport_*` directory.
- `--dry-run` reports what would be written without touching the filesystem.
- `--since` skips messages older than the date (useful for incremental imports later).

### 8.2 Pipeline

1. **Parse** — read `messages.html` via UTF-8, extract message blocks with their text + photos + replies + reactions + timestamps. Reuse logic from `scripts/analyze_tg_export.mjs`.
2. **Classify** — assign each owner-authored message to ONE category:
   - `catalog` — contains a price + ассортимент (regex: `\d+\s*€\s*/\s*кг` AND keyword pool: «наполеон», «медівник», «капкейк» etc.)
   - `in_stock` — contains «В НАЯВНОСТІ», «забрати», «вже зараз»
   - `showcase` — contains «вітрина», «терасі»
   - `delivered` — contains «віддавали», «сьогодні відда», «зробили для»
   - `event_teaser` — contains «суботі», «акційн» + date hint
   - `testimonial` — message has `reply_to` AND author is not the owner
   - `morning` — short text matching greeting templates; **drop**
   - `local_rec` — mentions external location ("Kaimberg" etc.); **drop**
   - `conflict` — heuristic: contains «борг», «ігнорує», or thread with negative reactions; **drop with log**
3. **Deduplicate by slug** — slug = `<category>-<keyword-from-text>` or `<YYYY-MM-DD>-<msg_id>` for journal. Re-running with same input never duplicates files.
4. **Optimise photos** — copy referenced photos from `<export_folder>/photos/` to `public/photos/<slug>-N.webp`, max 1600px on long side, WebP quality 82. Skip if target file already exists.
5. **Generate MDX** — write to appropriate `src/content/<type>/<slug>.mdx`. For first-run on a catalog message, generate the canonical `tortes/<keyword>.mdx`; on subsequent matching catalog messages, **append the new photo to the gallery** of the existing card (do NOT create dupes for the same cake type).
6. **Report** — write `analysis/import-report-<timestamp>.md`:
   - Counts per category
   - List of dropped messages with reasons
   - List of created/updated files
   - List of skipped duplicates

### 8.3 Catalog-card consolidation rules

When the channel has 12 posts about Napoleon, we don't want 12 catalog cards. The bot maintains a stable mapping of `keyword → slug`:
- "наполеон" → `tortes/napoleon.mdx`
- "медівник", "медівнич" → `tortes/medivnyk.mdx`
- "фрез", "frezier" → `tortes/frezier.mdx`
- "капкейк" → `sweets/cupcakes.mdx`
- "печиво" → `sweets/cookies.mdx`
- etc.

First post about Napoleon creates `napoleon.mdx`. Subsequent ones append photos to the gallery (deduped by source filename hash) and update `last_seen_ts`. The mapping table lives in `scripts/catalog_keywords.json` and is editable.

### 8.4 What never enters the site

- Personal conflict thread (Oleg Droga, Aug 25)
- Customer phone/contact fragments leaked in chat
- Customer profile photos
- Replies that are pure emoji or under 8 characters
- Owner debugging messages ("чек", "число", etc.)

## 9. German Legal Scope

### 9.1 Impressum (`/impressum`)

Mandatory per §5 TMG / §55 RStV. Required fields (with placeholder strategy):

| Field | Pitch placeholder | Real data needed from owner |
|---|---|---|
| Trading name | "La Dolce Gera (Konditorei in 1880 ABACO)" | confirm legal entity name |
| Owner / Geschäftsführer | "Дарья Громова" | confirm full legal name + spelling |
| Address | "c/o 1880 ABACO, Stadtgraben 14, 07545 Gera" | confirm or replace with their registered address |
| Phone | `[wird beim Launch ergänzt]` | required for §5 TMG quick contact |
| Email | `[wird beim Launch ergänzt]` | required for §5 TMG quick contact |
| USt-IdNr | `[falls vorhanden, wird ergänzt]` | optional if Kleinunternehmer §19 UStG |
| Verantwortlich §55 RStV | same as owner | |

The placeholders MUST be visibly flagged as such on the pitch site (yellow disclaimer banner: *"Demo-Version. Final legal data wird vor Veröffentlichung ergänzt."*). Site must not go to a public production URL without the placeholders being filled.

### 9.2 Datenschutzerklärung (`/datenschutz`)

Required sections:
- Verantwortlicher (= same as Impressum)
- Allgemeine Hinweise zur Datenverarbeitung
- Server logs (hosting provider's processing — Vercel: link to Vercel DPA, US transfer disclosure, SCC reference)
- Cookies — only if used; v1 ships **without non-essential cookies** so this section says so
- Fonts — **self-hosted, no Google Fonts CDN** (this is THE common Abmahnung trigger for small DE sites)
- Contact via Telegram — disclose that clicking the Telegram CTA leaves our site and Telegram's privacy policy applies
- Map embed — **no Google Maps embed v1**; instead a static screenshot or address text + "Open in Google Maps" outbound link. Embedded maps load Google IPs and require consent banner.
- Rights of data subjects (Auskunft, Berichtigung, Löschung, Widerspruch)
- Beschwerderecht bei der Aufsichtsbehörde (Thüringer Landesbeauftragter für Datenschutz)

### 9.3 Cookies / Tracking

**v1 = no analytics, no Google Fonts CDN, no Maps embed, no YouTube embed.** Therefore no consent banner required. If later Plausible Analytics is added, it's cookieless and stays compliant.

### 9.4 Allergens (per EU 1169/2011 + German LMIV)

For shop-style sites with food: declared allergens must be available before order. Approach: each `tortes/*.mdx` and `sweets/*.mdx` has an `allergens: [...]` frontmatter; UI renders icons with hover tooltip + textual list. Default value set conservatively (Gluten, Eier, Milch, Nüsse — these are present in nearly every cake) with a `lastReviewedBy: "placeholder"` flag. Page disclaimer: *"Aktuelle Allergeninformationen erhalten Sie auf Anfrage über Telegram."* until owner reviews.

### 9.5 Preisangabenverordnung

All EUR prices shown on the site are **Endpreise inklusive 7% MwSt** (German reduced VAT for foodstuffs). Add `MwSt-Hinweis` near prices and a footnote explaining VAT inclusion. No striking through "before" prices.

### 9.6 BFSG (Barrierefreiheitsstärkungsgesetz, in force 28.06.2025)

The cafe likely qualifies for the Kleinstunternehmen exemption (<10 employees, <€2M turnover). We build to WCAG 2.1 AA anyway because Astro + Tailwind give it nearly free:
- Semantic HTML (`<nav>`, `<main>`, `<article>`, `<footer>`)
- Color contrast ≥ 4.5:1 (the burgundy on cream palette passes)
- Alt text on every photo (generated from frontmatter `title` if not specified)
- Keyboard-navigable menu + language switcher
- No autoplay video

## 10. Privacy / DSGVO Decisions for Imported Content

| Decision | Choice | Reasoning |
|---|---|---|
| Customer names in testimonials | Anonymise to first-name only ("Anna H.", "Yuliia Z.") or initials | Reposting identifiable comments from a Telegram supergroup on a commercial site = lawful basis unclear. Anonymisation is the safe v1 path. |
| Customer profile photos | Never used | Telegram avatars belong to users, not us. |
| Customer-posted photos of cakes | Use only with owner's blanket OK (Phase 2); v1 prefers owner-uploaded photos | Authorship attribution unclear. |
| Owner's photos | Used freely | Their content, our pitch context. |
| Telegram message IDs | Stored in frontmatter as audit trail | Helps Phase-2 consent flow ("for cake from message #473 we'd need...") |
| Conflict messages | Hardcoded drop in importer | Reputational risk. |

## 11. Testing Approach

Pitch site, so testing scaled accordingly:

- **Manual visual QA** in Chrome + Safari + Firefox + mobile viewport.
- **`astro check`** — type-checks the content collections against the Zod schemas defined in `src/content/config.ts`.
- **Importer unit test** — one fixture `__fixtures__/sample_messages.html` exercises classifier + slug consolidation + idempotency (run twice, expect identical output).
- **Lighthouse** — target 95+ Performance / 100 Accessibility / 100 SEO on the home page.
- **No e2e tests** in v1.

## 12. Implementation Order

1. **Phase 0** — Astro scaffold + Tailwind + i18n routing + design tokens.
2. **Phase 1** — Importer bot + run on the real export → populates `src/content/`. Manual review of imported files.
3. **Phase 2** — Page templates: home, `/tortes`, `/sweets`, `/journal` + dynamic routes.
4. **Phase 3** — Legal pages (Impressum + Datenschutz, both languages).
5. **Phase 4** — Polish (alt text fill, allergen icons, hero copy, CTA links).
6. **Phase 5** — Deploy to Vercel, get preview URL, share for pitch.

Each phase is a few hours of focused work. Total: one productive evening for v1.

## 13. Open Questions (deferred — answer post-pitch, before any real launch)

- Legal entity name + USt-IdNr if any
- Phone + email for Impressum
- Confirmed opening hours
- Real allergen review per product
- Consent flow for using customer testimonials with attribution
- Domain choice (`ladolcegera.de` vs `.com` vs `.ua`)
- Whether to add `/events` page for kids parties (was in scope, dropped to keep pitch tight)
- Whether to add Plausible (DE-hosted alternative also exists)

## 14. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Owner doesn't like Modern-Italian direction in person | Direction was chosen with reasoning the user accepted; pivoting in pitch session means showing 2 secondary mockups (Cozy Artisan + minimal-Slavic accent) — bring a v2 directory next to v1. |
| Real customer recognises their words on site → complaint | Anonymisation per §10; if pushed, take down individual entry within 24h via journal git revert. |
| Telegram export format changes | Importer is reading HTML, not API. Telegram desktop export format has been stable since 2017; low risk. We pin the parser to current selectors and add tests against the fixture. |
| Google Fonts loaded by mistake (e.g. via npm theme) | Pre-commit grep for `fonts.googleapis.com` in built `dist/`. Fail the deploy if found. |
| Owner provides a different address post-pitch | All address strings live in `src/i18n/<lang>.json` under a single key. One-line change. |

## 15. Open work tracked outside this spec

- Persistent memory updated: `C:\Users\Asus\.claude\projects\C--Users-Asus-dolcevitta\memory\project_la_dolce_gera.md`
- Analysis artefacts: `C:\Users\Asus\dolcevitta\analysis\` (kept in repo, NOT public to web)
- Importer scaffold not yet written — Phase 1 deliverable

---
*End of design spec. Awaiting user review before invoking `writing-plans` skill.*
