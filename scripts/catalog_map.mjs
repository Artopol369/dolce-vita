// Keyword → catalog card mapping.
// Order: more specific keywords FIRST (longer + multi-token before single short tokens).
// price_per_kg_eur / price_per_piece_eur values come from observed posts in the export.

export const CATALOG_MAP = [
  // === Custom tortes ===
  { keywords: ["наполеон"], collection: "tortes", slug: "napoleon", title_uk: "Наполеон", title_de: "Napoleon", summary_uk: "Класичний український Наполеон з ніжним заварним кремом.", summary_de: "Klassisches ukrainisches Napoleon-Törtchen mit zartem Vanillecreme.", price_per_kg_eur: 20, allergens: ["gluten","eggs","milk"], featured: true, order: 1 },
  { keywords: ["медівник","медівнич","медовик"], collection: "tortes", slug: "medivnyk", title_uk: "Медівник", title_de: "Medivnyk · Honigtorte", summary_uk: "Український медовий торт з нiжним сметанним кремом. Сигнатурний рецепт.", summary_de: "Ukrainische Honigtorte mit zartem Sauerrahm-Creme. Unser Signature-Rezept.", price_per_kg_eur: 22, allergens: ["gluten","eggs","milk","honey"], featured: true, order: 2 },
  { keywords: ["фрез'є","фрезʼє","фрезье","frezier","fraisier"], collection: "tortes", slug: "fraisier", title_uk: "Фрезʼє", title_de: "Fraisier", summary_uk: "Французький легкий торт з полуницею та шоколадним ганашем.", summary_de: "Französischer Sommerkuchen mit frischen Erdbeeren und Schokoladenganache.", price_per_kg_eur: 25, allergens: ["gluten","eggs","milk"], featured: true, order: 3 },
  { keywords: ["шварцвальд","шварцвальдський","schwarzwald","шварцвальдск"], collection: "tortes", slug: "schwarzwald", title_uk: "Шварцвальдський", title_de: "Schwarzwälder Kirsch", summary_uk: "Класична Шварцвальдська вишня з темним шоколадом.", summary_de: "Klassische Schwarzwälder Kirschtorte mit dunkler Schokolade.", price_per_kg_eur: 25, allergens: ["gluten","eggs","milk","cherry"], order: 4 },
  { keywords: ["червоний оксамит","red velvet","оксамит"], collection: "tortes", slug: "red-velvet", title_uk: "Червоний Оксамит", title_de: "Red Velvet", summary_uk: "Бісквіт червоного кольору з ніжним крем-чізом.", summary_de: "Roter Biskuit mit zartem Frischkäse-Frosting.", price_per_kg_eur: 25, allergens: ["gluten","eggs","milk"], order: 5 },
  { keywords: ["снікерс","snickers"], collection: "tortes", slug: "snickers", title_uk: "Снікерс", title_de: "Snickers-Torte", summary_uk: "Шоколадний бісквіт з арахісом і солоною карамеллю.", summary_de: "Schokoladenbiskuit mit Erdnüssen und Salzkaramell.", price_per_kg_eur: 25, allergens: ["gluten","eggs","milk","nuts"], order: 6 },
  { keywords: ["три шоколад","потрійний шоколад","triple chocolate","три шоколада","3 шоколад"], collection: "tortes", slug: "three-chocolate", title_uk: "Три шоколади", title_de: "Drei Schokoladen", summary_uk: "Мусовий торт з білим, молочним та темним шоколадом.", summary_de: "Mousse-Torte mit weißer, Milch- und dunkler Schokolade.", price_per_kg_eur: 25, allergens: ["gluten","eggs","milk","soy"], order: 7 },
  { keywords: ["нью йорк","new york","нью-йорк","ньюйорк"], collection: "tortes", slug: "new-york-cheesecake", title_uk: "Нью-Йорк", title_de: "New York Cheesecake", summary_uk: "Класичний нью-йоркський чізкейк на пісочній основі.", summary_de: "Klassischer New York Cheesecake auf Mürbteigboden.", price_per_kg_eur: 25, allergens: ["gluten","eggs","milk"], order: 8 },
  { keywords: ["чізкейк","чизкейк"], collection: "tortes", slug: "cheesecake", title_uk: "Чізкейк", title_de: "Cheesecake", summary_uk: "Класичний чізкейк, ніжний як хмаринка.", summary_de: "Klassischer Cheesecake — luftig wie eine Wolke.", price_per_kg_eur: 25, allergens: ["gluten","eggs","milk"], order: 9 },
  { keywords: ["молочна дівчинка","молочна","молочная девочка"], collection: "tortes", slug: "milchmaedchen", title_uk: "Молочна дівчинка", title_de: "Milchmädchen", summary_uk: "Тонкі бісквітні коржі з ніжним молочним кремом.", summary_de: "Hauchdünne Biskuitschichten mit zarter Milchcreme.", price_per_kg_eur: 25, allergens: ["gluten","eggs","milk"], order: 10 },
  { keywords: ["бісквіт королеви вікторії","королеви вікторії","queen victoria"], collection: "tortes", slug: "victoria-sponge", title_uk: "Бісквіт Королеви Вікторії", title_de: "Victoria Sponge", summary_uk: "Англійський бісквіт із полуничним ганашем.", summary_de: "Englischer Biskuit mit Erdbeerganache.", price_per_kg_eur: 25, allergens: ["gluten","eggs","milk"], order: 11 },
  { keywords: ["тірамісу","тирамису","tiramisu"], collection: "tortes", slug: "tiramisu", title_uk: "Тірамісу", title_de: "Tiramisù", summary_uk: "Італійська класика з маскарпоне та кавою.", summary_de: "Italienischer Klassiker mit Mascarpone und Espresso.", price_per_kg_eur: 25, allergens: ["gluten","eggs","milk"], order: 12 },
  { keywords: ["бенто","bento"], collection: "tortes", slug: "bento", title_uk: "Бенто-торт", title_de: "Bento-Törtchen", summary_uk: "Маленький торт на 1-2 особи — мінідесерт із записом на коробці.", summary_de: "Mini-Törtchen für 1–2 Personen mit individueller Handschrift.", price_per_piece_eur: 18, allergens: ["gluten","eggs","milk"], featured: true, order: 13 },
  { keywords: ["мак "," мак","маков"], collection: "tortes", slug: "poppyseed", title_uk: "Маковий", title_de: "Mohntorte", summary_uk: "Класична макова з ніжним кремом — улюблений сімейний десерт.", summary_de: "Klassische Mohntorte mit zarter Creme — der Familienliebling.", price_per_kg_eur: 25, allergens: ["gluten","eggs","milk","poppy"], order: 14 },
  { keywords: ["фісташ","fisztaschi","pistazi","fistaschi"], collection: "tortes", slug: "pistachio", title_uk: "Фісташковий", title_de: "Pistazien-Torte", summary_uk: "Тонкий бісквіт з фісташковою пастою і малиною.", summary_de: "Feiner Biskuit mit Pistazienpaste und Himbeere.", price_per_kg_eur: 28, allergens: ["gluten","eggs","milk","nuts"], order: 15 },
  { keywords: ["пасха","паска","easter"], collection: "tortes", slug: "paska", title_uk: "Паска", title_de: "Paska (Osterbrot)", summary_uk: "Українська пасха — традиційний великодній хліб.", summary_de: "Ukrainisches Osterbrot nach traditionellem Rezept.", price_per_kg_eur: 18, allergens: ["gluten","eggs","milk"], order: 20 },
  { keywords: ["дитячий торт","детский торт","дитячий тортик"], collection: "tortes", slug: "kids-cake", title_uk: "Дитячий тортик", title_de: "Kindertorte", summary_uk: "Веселий бісквіт із ніжною начинкою — оформлюємо під вашу тему.", summary_de: "Fröhlicher Biskuit mit zarter Füllung — Motiv nach Wunsch.", price_per_kg_eur: 25, allergens: ["gluten","eggs","milk"], order: 16 },

  // === Sweets (small format) ===
  { keywords: ["капкейк","капкеик","cupcake","брауні з нутел","ванільні дабл","морковні із сол"], collection: "sweets", slug: "cupcakes", title_uk: "Капкейки", title_de: "Cupcakes", summary_uk: "Брауні з нутеллою, ванільні дабл-чіз, морквяні із солоною карамеллю.", summary_de: "Brownie-Nutella, Vanille-Doublecheese, Karotte mit Salzkaramell.", price_per_piece_eur: 2.5, price_per_kg_eur: null, pack_sizes: [6,9,12], allergens: ["gluten","eggs","milk"], featured: true, order: 1 },
  { keywords: ["печив","cookies","печенье","m&m","mm"], collection: "sweets", slug: "cookies", title_uk: "Печиво", title_de: "Cookies", summary_uk: "Американське з M&Ms або мармурове шоколадне — мʼяке, з кропком шоколаду.", summary_de: "Amerikanisch mit M&Ms oder marmoriert mit Schokolade — weich und großzügig.", price_per_kg_eur: 15, allergens: ["gluten","eggs","milk"], featured: true, order: 2 },
  { keywords: ["брауні","brownie","браунi"], collection: "sweets", slug: "brownie", title_uk: "Брауні", title_de: "Brownie", summary_uk: "Щільний шоколадний брауні з насиченим какао-смаком.", summary_de: "Dichter Schokoladenbrownie mit intensivem Kakaogeschmack.", price_per_piece_eur: 2.8, allergens: ["gluten","eggs","milk"], order: 3 },
  { keywords: ["макарон","macaron"], collection: "sweets", slug: "macarons", title_uk: "Макарони", title_de: "Macarons", summary_uk: "Французькі макарони з різними начинками.", summary_de: "Französische Macarons in verschiedenen Geschmacksrichtungen.", price_per_piece_eur: 2.5, allergens: ["eggs","milk","nuts"], order: 4 },
  { keywords: ["еклер","éclair","еклер"], collection: "sweets", slug: "eclair", title_uk: "Еклери", title_de: "Eclairs", summary_uk: "Заварні еклери з кремом і шоколадною глазур'ю.", summary_de: "Brandteig-Eclairs mit Vanillecreme und Schokoglasur.", price_per_piece_eur: 3.5, allergens: ["gluten","eggs","milk"], order: 5 }
];

// Drop categories — these messages NEVER make it to the site
export const DROP_PATTERNS = [
  // greetings
  /^(всім )?добр(ого|ий|ого ранку|ого ранку|ого дня|ого вечора)/i,
  /^доброго ранку$/i,
  /^приємн(ого|ої) (дня|неділі|суботи|вихідного|вечора)/i,
  // standalone emoji-only / very short
  /^[\s\p{Emoji}❤️🩷🌞🌷🌸🌹🎂🍰🧁🍪🍫]{1,8}$/u,
  // owner thank-you replies
  /^(дякую|спасибо|спасибі) за відгук/i,
  // local recommendations (non-bakery)
  /природн.{0,20}басейн|kaimberg|парк|зоопарк|пляж/i,
  // technical / debug
  /^(тест|test|чек|число)$/i
];

// Conflict-trigger phrases — block any thread starting with these
export const CONFLICT_PATTERNS = [
  /борг(у|и|ом)?/i,
  /ігноруе|игнориру/i,
  /шахрай/i,
  /обмани?/i
];
