# Next Session Plan — La Dolce Gera v1.3+

> **Точка входу для нового AI-агента.** Прочитай цей файл першим, потім [AGENTS.md](../AGENTS.md), потім [docs/master-prompt-antigravity.md](master-prompt-antigravity.md).
>
> Поточна версія: **v1.2.0** (sample-data + legal-fixes + marketing pack)
> Гілка: `main` (комітимо лінійно, без feature-branches поки)
> Live: https://dolcevitta-tawny.vercel.app

---

## 📍 Де ми зараз (стан v1.2.0)

✅ **Закрито:**
- v1: pitch-site + Telegram importer (cfcfc17)
- v1.1: sample data в `src/data/` + About / Order Process / FAQ / Voices / `/events` сторінка
- v1.1: legal-fix — Heinrichstraße 47 синхронізовано всюди, §5 TMG → §5 DDG
- v1.2: WhatsApp як другий канал, Schema.org JSON-LD (Bakery + FAQPage + Product), OG-image SVG + meta-теги
- Legal/marketing audit: [docs/legal-marketing-audit-2026-05-21.md](legal-marketing-audit-2026-05-21.md)
- Free verification playbook: [docs/free-legal-verification.md](free-legal-verification.md)

🔴 **Відкриті критичні юр-блокери (must перед публічним launch):**
1. **LMIV Art. 14** — алергени + Zutatenliste на кожній сторінці продукту
2. **PAngV § 4** — Grundpreis €/kg обов'язково для всього на вагу
3. Перевірити правдивість "handgemacht" у текстах
4. Реальні дані Дар'ї (адреса, телефон, email, USt-Id / §19) замість placeholder
5. **Конвертувати `public/og-image.svg` → `og-image.png`** (зараз meta вказує на неіснуючий .png)

---

## 🎯 План для наступної сесії (priority order)

### Phase 1 — Закрити LMIV & PAngV (юр-критично, ~2 год)

**[T1] Розширити схему `src/content/config.ts`:**
- Додати `ingredients_de: z.string()` і `ingredients_uk: z.string()` у `tortes` і `sweets`.
- Розширити дефолтний `allergens` — додати в enum усі 14 (gluten, eggs, milk, nuts, soy, sesame, sulphites, celery, mustard, lupin, fish, crustaceans, molluscs, peanuts).

**[T2] Оновити importer (`scripts/import-tg-channel.js` чи де він):**
- Поки що Дар'я не дає реальних ingredients → лишити placeholder `"Zutaten werden auf Anfrage mitgeteilt — bitte via Telegram"` і додати disclaimer banner.

**[T3] Оновити `CatalogDetail.astro`:**
- Відобразити блок "Zutaten" перед "Allergene".
- Формат: `Zutaten: ...` + `**Enthält:** Gluten, Eier, Milch...` (LMIV Art. 21).

**[T4] PAngV Grundpreis на картах і деталях:**
- У `CardTorte.astro` і `CatalogDetail.astro`: якщо `price_per_piece_eur` є — додатково показати `(€/kg: X)` де можливо.
- Для тортів з мінімальною вагою (`min_weight_kg`) показати: `ab 25 € (3.13 €/100g)`.

### Phase 2 — Дозаповнення sample-data → реальні дані (~1 год, потребує Дар'їного input)

**[T5] Перебіг через [docs/free-legal-verification.md](free-legal-verification.md) кроки 1-2:**
- Згенеруй Impressum через [eRecht24](https://www.e-recht24.de/impressum-generator.html) + [IT-Recht Kanzlei](https://www.it-recht-kanzlei.de/impressumgenerator.html)
- Згенеруй Datenschutz через [Brandi datenschutz-generator.de](https://datenschutz-generator.de/)
- Порівняй з нашими файлами → допиши що бракує.

**[T6] OG-image конверсія:**
- Конвертуй `public/og-image.svg` → `public/og-image.png` через [cloudconvert.com](https://cloudconvert.com/svg-to-png) (free, без реєстрації).
- Перевір через [OpenGraph.xyz](https://www.opengraph.xyz/).

### Phase 3 — Marketing-усилення (~2-3 год, опційно для v1.3)

З [legal-marketing-audit-2026-05-21.md](legal-marketing-audit-2026-05-21.md) топ-пропозицій залишилися:

**[M1] Google Business Profile** — створити лістинг "La Dolce Gera, Konditorei in Gera". *Не код, але критично.*

**[M2] Pre-filled Telegram links на сторінках продуктів:**
- Замість `https://t.me/ladolcegera_order` → `https://t.me/ladolcegera_order?text=Hallo!%20Ich%20möchte%20einen%20Napoleon%20bestellen%20für…`
- Файл: `src/components/CatalogDetail.astro` + `TelegramCta.astro` — додати prop `message`.

**[M3] Калькулятор ваги/порцій:**
- На сторінці кожного торта міні-JS-блок: "Гостей: [____] → потрібно ~1.2 kg, ціна ~28 €".
- Без фреймворку — pure JS в `<script>` тег.

**[M4] Plausible Analytics (DSGVO-compliant, без cookie-banner):**
- Додати `<script defer data-domain="ladolcegera.de" src="https://plausible.io/js/script.js"></script>` у Base.astro head.
- Потрібно акаунт у Plausible (€9/міс) — або self-hosted альтернатива Umami (free).

**[M5] Sezonal Christmas home-takeover:**
- Hero сцена з business.json events → якщо зараз листопад-грудень, замінити hero на Christmas-collect.

### Phase 4 — Free legal verification run (~3 год)

Пройди весь чек-лист [docs/free-legal-verification.md](free-legal-verification.md):
- [ ] Impressum generators крос-валідація
- [ ] Datenschutz Brandi
- [ ] Webbkoll (0 сторонніх запитів)
- [ ] Mozilla Observatory ≥ B
- [ ] Google Rich Results Test → schemas валідні
- [ ] OpenGraph.xyz
- [ ] LMIV-чек по кожному торту
- [ ] TLfDI Selbsttest
- [ ] (опція) IHK Gera Erstberatung

---

## 📂 Структура файлів (релевантні для v1.3)

```
src/
├── data/                          # ⭐ Sample data — замінити на real перед launch
│   ├── business.json              # owners, address, hours, contacts
│   ├── testimonials.json          # 8 sample reviews
│   ├── faq.json                   # 7 Q/A bilingual
│   ├── events.json                # 4 event packages
│   └── order-process.json         # 5-step ordering
├── components/
│   ├── StructuredData.astro       # ⭐ JSON-LD Bakery/Product/FAQ
│   ├── WhatsAppCta.astro          # ⭐ NEW
│   ├── TelegramCta.astro          # → потребує prop `message` для M2
│   ├── HomeContent.astro          # ⭐ містить About/Order/Voices/FAQ
│   ├── EventsPage.astro           # ⭐ NEW
│   └── CatalogDetail.astro        # → потребує ingredients block (T3)
├── content/
│   └── config.ts                  # → потребує ingredients_de/uk (T1)
├── pages/
│   ├── events.astro (+ uk/)       # ⭐ NEW
│   ├── tortes/[slug].astro        # ⭐ Product schema підключено
│   └── ...
├── i18n/
│   ├── de.json                    # ⭐ ABACO/Stadtgraben зачищено
│   └── uk.json                    # ⭐ той самий
public/
└── og-image.svg                   # ⭐ NEW — конвертуй у .png

docs/
├── legal-marketing-audit-2026-05-21.md   # ⭐ Юр-аудит, 16 пунктів
├── free-legal-verification.md            # ⭐ Free playbook
├── NEXT-SESSION-PLAN.md                  # ← цей файл
├── master-prompt-antigravity.md
└── superpowers/specs/2026-05-21-...md
```

---

## 🚀 Що сказати агенту на старті нового діалогу

> "Прочитай `docs/NEXT-SESSION-PLAN.md`, потім `AGENTS.md`, потім `docs/master-prompt-antigravity.md`. Поточна версія v1.2.0. Стартуй з Phase 1 (LMIV/PAngV блокери). Якщо є питання по реальних даних Дар'ї — спитай мене."

Або коротше:

> "Продовжи з NEXT-SESSION-PLAN.md, Phase 1."

---

## ⚙️ Команди-нагадування

```bash
npm install        # після клону
npm run dev        # localhost:4321
npm run check      # типи + Astro
npm run build      # production build
```

Деплой через push у `main` → Vercel auto.

---

## 📦 Що НЕ робити в наступній сесії

- ❌ Не змінюй sample-data в `src/data/` "просто щоб гарніше" — це placeholder, який буде замінено на real від Дар'ї.
- ❌ Не додавай React/SPA — сайт max-static (Astro правило).
- ❌ Не підключай Google Fonts / Maps / GTM — DSGVO-блокер.
- ❌ Не пуш `--force` і не міняй git-історію.
- ❌ Не запускай `vercel --prod` без явної команди Артьома.
