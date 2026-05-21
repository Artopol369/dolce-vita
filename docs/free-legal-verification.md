# Free Legal Verification — як перевірити сайт без юриста

> Усі сервіси нижче — **безкоштовні** та доступні без реєстрації або з безкоштовним tier.
> Це не замінює юриста на 100%, але закриває ~80% типових Abmahnung-ризиків.

## 1. Impressum — крос-валідація

| Сервіс | Що робить | Як використати |
|---|---|---|
| [eRecht24 Impressum-Generator](https://www.e-recht24.de/impressum-generator.html) | Генерує юр-коректний Impressum згідно § 5 DDG | Введи свої дані → порівняй з тим, що у нас |
| [IT-Recht Kanzlei Impressum-Generator](https://www.it-recht-kanzlei.de/impressumgenerator.html) | Аналогічно, але формат трохи інший | Запусти обидва, перевір розбіжності |
| [Muster-Impressum.de Kleinunternehmer](https://muster-impressum.de/vorlagen/musterimpressum-fuer-einen-kleinunternehmer/) | Шаблон специально для §19 UStG | Якщо Дар'я як Kleinunternehmerin — це твій базовий шаблон |

**Дія:** Згенеруй на 2-х сайтах → порівняй з нашим Impressum → доповни що бракує.

## 2. Datenschutzerklärung — крос-валідація

| Сервіс | Що робить |
|---|---|
| [eRecht24 Datenschutz-Generator](https://www.e-recht24.de/muster-datenschutzerklaerung.html) | Базовий шаблон DSGVO (free tier) |
| [Datenschutz-Generator.de Brandi](https://datenschutz-generator.de/) | Найповніший — від адвоката, free для непрофесійних сайтів |
| [activeMind Generator](https://www.activemind.de/datenschutz/datenschutzhinweisgenerator/) | Free, добре по структурі |

**Дія:** Згенеруй через Brandi (найкращий free) → порівняй з нашим Datenschutz → додай блоки, що бракують.

## 3. Технічний DSGVO-аудит (сторонні запити, cookies, fingerprinting)

| Сервіс | URL | Що показує |
|---|---|---|
| **Webbkoll** | [webbkoll.dataskydd.net](https://webbkoll.dataskydd.net/) | Сканує сторінку: всі сторонні запити, cookies, headers, referrer leaks. Швед-сервіс, точно під DSGVO |
| **Blacklight (The Markup)** | [themarkup.org/blacklight](https://themarkup.org/blacklight) | Виявляє трекери, fingerprinting, session replays |
| **2 Click Social Media Tester** | [heise.de](https://www.heise.de/security/dienste/Soziale-Netzwerke-Privatsphaere-Check-2440407.html) | Чи витікають дані до Facebook/Google/etc. |
| **Cookiebot Free Scan** | [cookiebot.com](https://www.cookiebot.com/en/cookie-scanner/) | Перерахує всі cookies (free до 100 сторінок) |

**Дія:** Запусти Webbkoll на ladolcegera.de → результат має бути «нуль сторонніх запитів». Якщо є — фіксуй.

## 4. Security & HTTP-headers (це теж DSGVO-аргумент: "захист даних by design")

| Сервіс | URL | Що оцінює |
|---|---|---|
| **Mozilla Observatory** | [observatory.mozilla.org](https://observatory.mozilla.org/) | A–F рейтинг по security-headers (CSP, HSTS, X-Frame-Options) |
| **Security Headers** | [securityheaders.com](https://securityheaders.com/) | Скоро-оцінка headers |
| **SSL Labs** | [ssllabs.com/ssltest](https://www.ssllabs.com/ssltest/) | TLS-конфіг (Vercel зазвичай A+) |
| **HSTS Preload Check** | [hstspreload.org](https://hstspreload.org/) | Чи внесений сайт у preload-list |

**Мета:** Mozilla Observatory ≥ B, ідеально A.

## 5. SEO & Schema.org валідація

| Сервіс | URL | Що робить |
|---|---|---|
| **Google Rich Results Test** | [search.google.com/test/rich-results](https://search.google.com/test/rich-results) | Перевіряє JSON-LD schemas, що ми додали |
| **Schema.org Validator** | [validator.schema.org](https://validator.schema.org/) | Окрема валідація на схема-помилки |
| **Google Search Console** | [search.google.com/search-console](https://search.google.com/search-console) | Free, але треба підтвердити володіння домену. Показує всі indexation-проблеми |
| **Bing Webmaster Tools** | [bing.com/webmasters](https://www.bing.com/webmasters/) | Free, аналогічно |

## 6. OG-image preview (як буде виглядати при шерингу)

| Сервіс | URL |
|---|---|
| **OpenGraph.xyz** | [opengraph.xyz](https://www.opengraph.xyz/) |
| **Twitter Card Validator** | [cards-dev.twitter.com/validator](https://cards-dev.twitter.com/validator) (потрібен X-аккаунт) |
| **Facebook Sharing Debugger** | [developers.facebook.com/tools/debug](https://developers.facebook.com/tools/debug/) |
| **LinkedIn Post Inspector** | [linkedin.com/post-inspector](https://www.linkedin.com/post-inspector/) |

## 7. LMIV / алергени — крос-перевірка

| Ресурс | Як використати |
|---|---|
| [Lebensmittelklarheit.de](https://www.lebensmittelklarheit.de/) | Verbraucherzentrale-портал, описує що має бути на упаковці/онлайн |
| [Lebensmittelverband Pflichtangaben](https://www.lebensmittelverband.de/de/lebensmittel/kennzeichnung/lebensmittelinformationsverordnung) | Чек-лист обов'язкових позначень |
| [BVL Кennzeichnungs-FAQ](https://www.bvl.bund.de/DE/Arbeitsbereiche/01_Lebensmittel/03_Verbraucher/02_KennzeichnungLM/01_Ueberblick/lm_kennzeichnung_lebensmittel_Ueberblick_node.html) | Офіційний регулятор |

**Дія:** Для кожного торта пройди чек-лист → 14 алергенів зазначені? Склад є?

## 8. Werbung / Irreführung (UWG) — sanity-check

| Ресурс | Що дає |
|---|---|
| [Wettbewerbszentrale FAQ](https://www.wettbewerbszentrale.de/) | Free Q&A база, шукай "hausgemacht", "handgemacht" — є приклади дозволено/заборонено |
| [Lebensmittelklarheit Werbeaussagen](https://www.lebensmittelklarheit.de/informationen/werbung-werbeaussagen) | Що можна, що не можна у харчовій рекламі |

## 9. Безкоштовні консультації (по запиту)

| Орган | Кому | Як отримати |
|---|---|---|
| **IHK Gera** | Зареєстрованим Gewerbe | Free Erstberatung по праву та податках, [ihk-ostthueringen.de](https://www.gera.ihk.de/) |
| **Thüringer Landesbeauftragter für Datenschutz (TLfDI)** | Усі підприємства Тюрингії | Free DSGVO-консультації: [tlfdi.de](https://www.tlfdi.de) |
| **Verbraucherzentrale Thüringen** | Дрібний бізнес | Платно, але часто є вебінари free |
| **Existenzgründer-Beratung Gera** | Стартапи | Free coaching, інколи покриває юр-питання |
| **Handwerkskammer Ostthüringen** | Якщо Konditorei = Handwerk | Free початкова консультація |

## 10. Сам-чек: TLfDI Online-Selbsttest

Тюрінгський наглядовий орган має **free DSGVO-Selbstcheck** для малого бізнесу: [tlfdi.de → Mittelstand & Datenschutz](https://www.tlfdi.de). Заповнюєш онлайн-форму → отримуєш рейтинг ризику.

---

## 🎯 Рекомендований порядок дій (1 день роботи)

1. **Перегенеруй Impressum** через eRecht24 + IT-Recht Kanzlei → порівняй з нашим → допиши що бракує
2. **Перегенеруй Datenschutz** через datenschutz-generator.de (Brandi) → те саме
3. **Запусти Webbkoll** на live-URL → результат має бути 0 сторонніх запитів
4. **Mozilla Observatory** → ціль ≥ B
5. **Google Rich Results Test** → перевір schemas що ми додали
6. **OpenGraph.xyz** → подивись як виглядає прев'ю при шерингу
7. **LMIV-чек** для кожного торта вручну за списком 14 алергенів
8. **TLfDI Selbsttest** → подивись рейтинг ризику
9. **(опція)** Запиши до IHK Gera на free Erstberatung — раз у житті можна

Якщо все 1–8 кроків зелені — ризик Abmahnung **в межах звичайного для малого бізнесу**.
Якщо щось червоне — фіксуй або питай TLfDI.

---

## ⚠️ Що навіть free-tools не зловлять

- Чи реально Дар'я має дозвіл від Lebensmittelüberwachung Gera виробляти на цій кухні
- Чи має §43 IfSG-сертифікат (Belehrung)
- Чи коректний AGB для food on demand
- Точність "handgemacht" заяви (тільки сам знаєш)
- Дозвіл на використання фото гостей у тестімоніалах

Це питання, які треба закрити організаційно, не онлайн-перевіркою.
