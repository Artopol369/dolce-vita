# Legal & Marketing Audit — La Dolce Gera v1.1.0

**Дата:** 21 травня 2026 · **Reviewer:** Claude (Anthropic) · **Не є юридичною консультацією**

> Цей документ — чесний first-pass аудит, з посиланнями на актуальні джерела. Перед публічним запуском **обов'язково** валідуйте у німецького Rechtsanwalt für IT-Recht або через сервіс на кшталт e-recht24.de / IT-Recht Kanzlei. Все що нижче — це чек-лист, а не "Freibrief".

---

## 🟥 Критичні юр-ризики (fix перед launch)

### 1. ✅ ВИПРАВЛЕНО — Невідповідність адреси
**Було:** Stadtgraben 14 в Impressum / Datenschutz / Footer, але Heinrichstraße 47 в business.json і на головній → Impressum обов'язково має співпадати з реальною робочою адресою (§ 5 DDG).
**Тепер:** усі шляхи синхронізовано → Heinrichstraße 47. Замінити на реальну адресу Дар'ї перед launch.

### 2. ✅ ВИПРАВЛЕНО — Застаріле посилання §5 TMG
**Було:** Impressum посилався на § 5 TMG.
**Факт:** З 14.05.2024 TMG скасовано, замінено **Digitale-Dienste-Gesetz (DDG)**. Правильна норма — **§ 5 DDG**.
**Тепер:** усі згадки оновлено на DDG.
*Джерело: [selbststaendigkeit.de — Impressum Kleinunternehmer 2026](https://selbststaendigkeit.de/buchhaltung-fuer-gruender/impressum-kleinunternehmer/).*

### 3. 🔴 ВІДКРИТО — LMIV Fernabsatz: алергени та склад мають бути ДО покупки
**Проблема:** Сайт продає торти на замовлення (онлайн-канал). Згідно **LMIV Art. 14**, у Fernabsatz усі обов'язкові відомості (склад, 14 алергенів, харчова цінність) **мають бути доступні до укладення договору** — тобто на сторінці продукту, а не "за запитом".

Зараз у схемі `tortes` поле `allergens` існує, але:
- мінімальний набір `["gluten", "eggs", "milk"]` за замовчуванням — не повністю покриває 14 алергенів (горіхи, соя, сезам, сульфіти, селера, гірчиця, люпин, риба/молюски, арахіс…)
- складу (Zutatenliste) немає взагалі — це порушення LMIV
- формат "Enthält:" згідно Art. 21 LMIV не використовується

**Дія перед launch:**
- Додати поле `ingredients_de` / `ingredients_uk` у схему `tortes` та `sweets`.
- Відображати на детальній сторінці продукту блок:
  *"Zutaten: Mehl (Weizen), Butter, Eier, Zucker, Mandeln… **Enthält:** Gluten, Eier, Milch, Schalenfrüchte."*
- Або міцний disclaimer "Vollständige Zutaten- und Allergenliste auf Anfrage vor Bestellung per Telegram" — формально слабше, ймовірність abmahnung вища.

*Джерело: [it-recht-kanzlei.de — Allergenkennzeichnung Online-Handel](https://www.it-recht-kanzlei.de/allergenkennzeichnung-lebensmittel.html), [LGL Bayern — LMIV FAQ](https://www.lgl.bayern.de/lebensmittel/kennzeichnung/lmiv_faq.htm).*

### 4. 🟡 ВІДКРИТО — Preisangabenverordnung (PAngV) Grundpreis
**Норма:** § 4 PAngV — товари, що продаються **за вагою**, мусять мати **Grundpreis (€/kg)** поряд із загальною ціною.
**Стан сайту:** Карти тортів показують `€/kg` — це добре. Але якщо торт іде з фіксованою ціною "ab 25 €" без перерахунку на кг — це порушення.
**Дія:** перевірити кожну детальну сторінку — для всього що продається на вагу, показувати **і ціну, і Grundpreis**.
**Винятки:** дуже малі прямі продавці (Hofläden, Imker) можуть мати exemption, але домашня кондитерська через сайт **не підпадає** під виняток за замовчуванням.

*Джерело: [PAngV § 4](https://www.buzer.de/4_Preisangabenverordnung.htm), [IHK München — Neue PAngV](https://www.ihk-muenchen.de/ratgeber/recht/werbung-fairer-wettbewerb/preisangabenverordnung/).*

### 5. 🟡 ВІДКРИТО — Werbung "handgemacht" / "hausgemacht" / "frisch aus der Backstube"
**Норма:** § 5 UWG (Irreführung). Якщо торти НЕ повністю від руки на власній кухні (наприклад, частково фабрична заготовка коржа), вживання "handgemacht" / "hausgemacht" може бути irreführend → Abmahnung конкурентом або Wettbewerbszentrale.
**Стан сайту:** subtitle на головній — "handgemacht". Якщо це правда (Дар'я справді все ліпить сама) — OK. Якщо ні — потрібно змінити.

*Джерело: [IHK Frankfurt — Irreführende Werbung](https://www.frankfurt-main.ihk.de/recht/uebersicht-alle-rechtsthemen/wettbewerbsrecht/unlauterer-wettbewerb/irrefuehrende-werbung).*

### 6. 🟡 ВІДКРИТО — Lebensmittelhygiene та реєстрація бізнесу
Не стосується самого сайту, але **передумова** для легальної роботи кондитерської в Гері:
- Реєстрація в **Lebensmittelüberwachungs- und Veterinäramt der Stadt Gera** (вже згадано в Impressum — добре).
- **Gewerbeanmeldung** + іспит **Gesundheitszeugnis (§ 43 IfSG)** для Дар'ї.
- Сертифікат **HACCP** / Hygieneschulung.
- Якщо кухня домашня — Lebensmittelüberwachung має дозволити роботу з домашньої кухні (часто складно). Більш безпечно — оренда сертифікованої виробничої кухні.

Це не блокер для запуску **сайту**, але блокер для реальних продажів.

---

## 🟧 Середній ризик (бажано закрити до v1.5)

### 7. Cookie-Banner — не потрібен (підтверджено)
Сайт не використовує non-essential cookies (це задекларовано в Datenschutz § 4). Fonts хостяться локально, немає GA / Pixel / GTM. Cookie-banner не потрібен. ✅

### 8. Telegram-інтеграція — disclosure OK
Datenschutz § 7 коректно описує, що при кліку на Telegram-посилання користувач залишає сайт і потрапляє під політику Telegram FZ-LLC. **Не обіймати Telegram як "процесора" — у Telegram немає AVV-договору (Auftragsverarbeitungsvertrag) за Art. 28 DSGVO**, тому не можна обробляти PII клієнтів **через бот** від імені бізнесу без додаткових застережень.
**Рекомендація:** не приймати в Telegram-чаті чутливі дані (адреса доставки → лише після підтвердження, мінімум потрібних полів).
*Джерело: [datenschutz.org — Telegram](https://www.datenschutz.org/telegram/), [externer-datenschutzbeauftragter-dresden.de](https://externer-datenschutzbeauftragter-dresden.de/datenschutz/telegram-datenschutz/).*

### 9. Vercel + USA-Drittlandtransfer
Datenschutz § 3 згадує SCC та Frankfurt-region. Це OK, але:
- варто додати посилання на конкретний DPA Vercel (Data Processing Addendum), не лише на privacy policy
- варто експліцитно зазначити **категорії даних**, що передаються до США (зараз тільки "Server-Logs")

### 10. Kleinunternehmer §19 UStG
Не обов'язково в Impressum (Digitale-Dienste-Gesetz цього не вимагає), але **рекомендовано** додати один рядок:
> *"Kleinunternehmerin gemäß § 19 UStG — keine Umsatzsteuer ausgewiesen."*
Це попереджає питання "де USt-Id?" у клієнтів і Finanzamt.
*Джерело: [muster-impressum.de](https://muster-impressum.de/vorlagen/musterimpressum-fuer-einen-kleinunternehmer/), [it-recht-kanzlei.de — Kleinunternehmer Online-Handel](https://www.it-recht-kanzlei.de/aenderung-hinweis-kleinunternehmer-online-handel.html).*

### 11. AGB (Загальні умови) — відсутні
Для бізнесу, що приймає замовлення онлайн, **AGB не є обов'язковими** (на відміну від Impressum), але вкрай рекомендовані для:
- зрозумілих умов оплати, доставки, скасування
- захисту від спорів про "торт виявився не таким як очікував"
- термінів зберігання / повернення (продукт швидкопсувний → особливі правила Widerrufsrecht — для свіжих харчових товарів **немає** Widerrufsrecht згідно § 312g BGB)

---

## 🟦 Marketing — пропозиції для посилення (за пріоритетом)

### Trust & Conversion
1. **Real фото Дар'ї + Наталії** замість ініціалів-аватарів. Один портрет на сторінці About підвищує конверсію на ~15–25% у food-нішах.
2. **Schema.org Bakery + LocalBusiness JSON-LD** на головній + Product JSON-LD на сторінках тортів → Google показує rich-snippets (рейтинг, ціна, час приготування). Це безкоштовно, але дає +10–20% CTR з пошуку.
3. **Google Business Profile** (Google Maps listing) — для локальних запитів "Konditorei Gera" критично. Цей канал часто приносить більше трафіку ніж сам сайт.
4. **OG-image** (1200×630) з фірмовим тортом + логотипом → красиві Telegram/WhatsApp-прев'ю при шерингу. Зараз метатег `og:title` є, але `og:image` немає.
5. **WhatsApp як другий канал** поряд із Telegram. У Німеччині WhatsApp домінує (>80% користувачів проти ~5% у Telegram). Втрачаєте величезний сегмент.

### Local SEO
6. **Сторінки під ключі**: `/torten/gera`, `/hochzeitstorte-gera`, `/kindergeburtstag-torte-thueringen`. Зараз вся семантика на одній сторінці — пошуковикам важко.
7. **Блог/Journal посилити** structured-content постами: "Wie viel Torte pro Person?", "Was ist Medivnyk?", "10 ukrainische Süßspeisen die ihr probieren müsst". Це answer-content, що ловиться AI-Overviews.
8. **Backlinks**: ukraine-deutschland.de, gera-tourismus.de, локальні комʼюніті-портали Gera (Geraer Wochenblatt).

### Соціальний доказ
9. **Лічильник "X+ зроблених замовлень за 2026"** на головній. Дуже сильно конвертує.
10. **Instagram-стрічка вбудована (статично, без JS-віджету)** — зробити cron-job, що раз на день генерує статичний грід останніх 6 постів. DSGVO-safe бо без Meta-iframe.
11. **Real testimonials з фото** замість анонімних ініціалів. Або підпис "Anna K., перевірений клієнт, замовлення #2987".

### Конверсія
12. **Pre-filled Telegram link** з контекстом: `https://t.me/ladolcegera_order?text=Hallo!%20Ich%20möchte%20einen%20Napoleon%20bestellen%20für…` — на сторінці кожного торта робить CTA конкретною.
13. **Калькулятор ваги/порцій** прямо в карточці торта: "Гостей: [____] → потрібно ~1.2 kg, ціна ~28 €". Mini-app або просто JS.
14. **Sezonal home-takeover** — у грудні весь головний банер = Christmas-збір замовлень (медівник + штоллен), решта контенту мінімалізована.
15. **Lead-magnet PDF** "10 фірмових українських тортів — рецепти від Дар'ї" в обмін на email (DSGVO double-opt-in newsletter). Будує власну базу не залежну від Telegram.

### Conversion measurement
16. **Plausible / Pirsch Analytics** (DSGVO-compliant, no cookie banner). Без них ви не побачите які сторінки конвертять, який пакет з `/events` популярний, з якого міста заходять.

---

## 📋 Чек-лист перед публічним launch (must-have)

- [ ] Реальна адреса Дар'ї замість Heinrichstraße 47 placeholder
- [ ] Реальні телефон, email, USt-Id / Kleinunternehmer-Hinweis в Impressum
- [ ] **Алергени та склад на кожній сторінці торта** (LMIV Art. 14)
- [ ] **Grundpreis (€/kg) поряд із усіма цінами** (PAngV § 4)
- [ ] Перевірити правдивість "handgemacht" / "hausgemacht" у текстах
- [ ] Lebensmittelüberwachung Gera — реєстрація бізнесу
- [ ] § 43 IfSG (Gesundheitszeugnis) для Дар'ї
- [ ] Юр-валідація фіналу через німецького IT-Anwalt або e-recht24
- [ ] (опція) AGB з умовами замовлення, доставки, скасування

---

## 📚 Sources

- [LGL Bayern — LMIV FAQ](https://www.lgl.bayern.de/lebensmittel/kennzeichnung/lmiv_faq.htm)
- [IT-Recht Kanzlei — Allergenkennzeichnung Online-Handel](https://www.it-recht-kanzlei.de/allergenkennzeichnung-lebensmittel.html)
- [BVL — Kennzeichnung Lebensmittel](https://www.bvl.bund.de/DE/Arbeitsbereiche/01_Lebensmittel/03_Verbraucher/02_KennzeichnungLM/01_Ueberblick/lm_kennzeichnung_lebensmittel_Ueberblick_node.html)
- [Gesetze-im-Internet — PAngV](https://www.gesetze-im-internet.de/pangv_2022/BJNR492110021.html)
- [Buzer.de — § 4 PAngV Grundpreis](https://www.buzer.de/4_Preisangabenverordnung.htm)
- [IHK München — Neue Preisangabenverordnung](https://www.ihk-muenchen.de/ratgeber/recht/werbung-fairer-wettbewerb/preisangabenverordnung/)
- [IHK Frankfurt — Irreführende Werbung](https://www.frankfurt-main.ihk.de/recht/uebersicht-alle-rechtsthemen/wettbewerbsrecht/unlauterer-wettbewerb/irrefuehrende-werbung)
- [Selbststaendigkeit.de — Impressum Kleinunternehmer 2026](https://selbststaendigkeit.de/buchhaltung-fuer-gruender/impressum-kleinunternehmer/)
- [Muster-Impressum.de — Kleinunternehmer Vorlage](https://muster-impressum.de/vorlagen/musterimpressum-fuer-einen-kleinunternehmer/)
- [Datenschutz.org — Telegram](https://www.datenschutz.org/telegram/)
- [IT-Recht Kanzlei — Kleinunternehmer Online-Handel 2026](https://www.it-recht-kanzlei.de/aenderung-hinweis-kleinunternehmer-online-handel.html)
- [E-Recht24 — Telegram DSGVO](https://www.e-recht24.de/dsg/13383-kommunikation-via-telegram.html)
