#!/usr/bin/env node
/*
 * Telegram Desktop export → Astro content collections importer.
 *
 *   node scripts/import_tg_to_content.mjs <export_folder> [--dry-run] [--since YYYY-MM-DD]
 *
 * Idempotent: re-running on the same export produces the same set of files,
 * just updating last_seen_ts / merging new photos into existing galleries.
 *
 * Drops: greetings, local recommendations, conflict threads, very short messages.
 */

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import {
  readAllMessagesHtml, parseMessages, parseTimestamp, isoDate, isoTimestamp, annotateOwnerContinuation, isOwner
} from "./tg_parser.mjs";
import { CATALOG_MAP, DROP_PATTERNS, CONFLICT_PATTERNS } from "./catalog_map.mjs";

const PROJECT_ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname).replace(/^\//, ""), "..");
const CONTENT_ROOT  = path.join(PROJECT_ROOT, "src", "content");
const PHOTOS_OUT    = path.join(PROJECT_ROOT, "public", "photos");
const ANALYSIS_OUT  = path.join(PROJECT_ROOT, "analysis");

// === args ===
const args = process.argv.slice(2);
const exportRoot = args.find(a => !a.startsWith("--"));
const DRY = args.includes("--dry-run");
const sinceArg = args.find(a => a.startsWith("--since="));
const SINCE = sinceArg ? new Date(sinceArg.slice("--since=".length)) : null;
const MAX_PHOTOS_PER_CARD = parseInt(args.find(a => a.startsWith("--max-photos="))?.slice(13) || "8");
const MAX_JOURNAL_ENTRIES = parseInt(args.find(a => a.startsWith("--max-journal="))?.slice(14) || "60");

if (!exportRoot) {
  console.error("usage: import_tg_to_content.mjs <export_folder> [--dry-run] [--since=YYYY-MM-DD] [--max-photos=N] [--max-journal=N]");
  process.exit(1);
}

// === pipeline ===
console.error(`Reading export: ${exportRoot}`);
const html = readAllMessagesHtml(exportRoot);
let messages = parseMessages(html);
messages = annotateOwnerContinuation(messages);
console.error(`Parsed ${messages.length} messages`);

// stable order by timestamp
messages.sort((a, b) => {
  const ta = parseTimestamp(a.ts)?.getTime() ?? 0;
  const tb = parseTimestamp(b.ts)?.getTime() ?? 0;
  return ta - tb;
});

const stats = {
  total: messages.length,
  classified: { catalog: 0, in_stock: 0, showcase: 0, delivered: 0, event_teaser: 0, testimonial: 0, seasonal: 0 },
  dropped: { greeting: 0, conflict: 0, local_rec: 0, short: 0, no_text_no_photo: 0, not_owner_no_review: 0, since: 0 },
  files_written: { tortes: 0, sweets: 0, journal: 0 },
  photos_written: 0,
  photos_skipped_existing: 0
};

function classify(msg, conflictThreadIds) {
  const text = (msg.text || "").trim();
  const lower = text.toLowerCase();

  if (SINCE) {
    const d = parseTimestamp(msg.ts);
    if (d && d < SINCE) { stats.dropped.since++; return null; }
  }

  // conflict thread participants
  if (conflictThreadIds.has(msg.id) || (msg.reply_to && conflictThreadIds.has(msg.reply_to))) {
    stats.dropped.conflict++; return null;
  }

  // very short / no-text + no-photo
  if (!text && !msg.photos.length) { stats.dropped.no_text_no_photo++; return null; }
  if (text.length > 0 && text.length < 10 && !msg.photos.length) { stats.dropped.short++; return null; }

  // greetings / local
  if (text && DROP_PATTERNS.some(re => re.test(text))) {
    if (/природн|kaimberg|зоопарк|парк/i.test(text)) stats.dropped.local_rec++;
    else stats.dropped.greeting++;
    return null;
  }

  // owner messages → catalog / showcase / delivered / in_stock / event_teaser / seasonal
  if (isOwner(msg)) {
    // CATALOG: explicit pricing + product keyword
    if (/(\d+[\.,]?\d*)\s*€\s*\/?\s*кг/i.test(text) || /(\d+[\.,]?\d*)\s*€\s*\/\s*\d+\s*шт/i.test(text)) {
      const match = matchCatalog(text);
      if (match) {
        stats.classified.catalog++;
        return { type: "catalog", match, msg };
      }
    }
    // Even without price, if a strong product keyword + photo, it's a catalog candidate (consolidation)
    if (msg.photos.length > 0) {
      const match = matchCatalog(text);
      if (match) {
        stats.classified.catalog++;
        return { type: "catalog", match, msg };
      }
    }
    // IN STOCK
    if (/в наявност|забрати (зараз|сьогодні|протягом)|вже зараз|сьогодні в наявн|можна забрати/i.test(text) && msg.photos.length > 0) {
      stats.classified.in_stock++;
      return { type: "journal", category: "in_stock", msg };
    }
    // SHOWCASE / window
    if (/(наша )?вітрин|на терасі|літн[іь]й терас|на вітрин/i.test(text) && msg.photos.length > 0) {
      stats.classified.showcase++;
      return { type: "journal", category: "showcase", msg };
    }
    // DELIVERED order
    if (/(сьогодні )?віддавали|зробили для|такий тортик для|сьогодні (відда|зробил)/i.test(text) && msg.photos.length > 0) {
      stats.classified.delivered++;
      return { type: "journal", category: "delivered", msg };
    }
    // EVENT teaser (Saturday/Sunday + date)
    if (/(цієї|цього) (субот|неділ|тижн)|акційн|святкуєм|акці[яї]/i.test(text)) {
      stats.classified.event_teaser++;
      return { type: "journal", category: "event_teaser", msg };
    }
    // SEASONAL (Christmas, Easter, NY)
    if (/різдв|новий рік|новорічн|пасх|паск|великодн/i.test(text)) {
      stats.classified.seasonal++;
      return { type: "journal", category: "seasonal", msg };
    }
    // Owner post with photo + significant text → journal "showcase" by default
    if (msg.photos.length > 0 && text.length >= 30) {
      stats.classified.showcase++;
      return { type: "journal", category: "showcase", msg };
    }
    return null;
  }

  // GUEST messages → testimonial only if substantive
  if (msg.from && !isOwner(msg)) {
    if (text.length >= 40 && !/^[\?]/.test(text) && !/^добр(ий|ого) (день|ранок)/i.test(lower)) {
      // require positive sentiment cues
      if (/смачн|дякую|неймовірн|вкусн|шикарн|рекоменд|супер|чудов|найкращ|восторг|обожн|👍|❤️|🩷|🔥|спасибо|спасибі/i.test(lower)) {
        stats.classified.testimonial++;
        return { type: "journal", category: "testimonial", msg };
      }
    }
    stats.dropped.not_owner_no_review++;
    return null;
  }
  return null;
}

function matchCatalog(text) {
  const lower = " " + text.toLowerCase() + " ";
  for (const entry of CATALOG_MAP) {
    for (const kw of entry.keywords) {
      if (lower.includes(kw.toLowerCase())) return entry;
    }
  }
  return null;
}

// Detect conflict thread IDs (so we can prune all related messages)
function detectConflictThreads(messages) {
  const conflictRoots = new Set();
  for (const m of messages) {
    const t = m.text || "";
    if (CONFLICT_PATTERNS.some(re => re.test(t))) conflictRoots.add(m.id);
  }
  // expand: if msg replies into a conflict root, it's also in conflict
  const expand = new Set(conflictRoots);
  for (let pass = 0; pass < 3; pass++) {
    for (const m of messages) {
      if (m.reply_to && expand.has(m.reply_to)) expand.add(m.id);
    }
  }
  if (expand.size) console.error(`Conflict threads: ${expand.size} messages quarantined`);
  return expand;
}

const conflictThreadIds = detectConflictThreads(messages);

// === First pass: classify everything ===
const classified = [];
for (const msg of messages) {
  const r = classify(msg, conflictThreadIds);
  if (r) classified.push(r);
}

// === Photo processing ===
async function ensureWebp(srcPhotoRef, outBaseName) {
  const srcPath = path.join(exportRoot, srcPhotoRef);
  const outPath = path.join(PHOTOS_OUT, outBaseName + ".webp");
  const publicPath = "/photos/" + outBaseName + ".webp";
  if (!fs.existsSync(srcPath)) { console.error(`MISSING photo source: ${srcPath}`); return null; }
  if (fs.existsSync(outPath)) { stats.photos_skipped_existing++; return publicPath; }
  if (DRY) { return publicPath; }
  await sharp(srcPath)
    .rotate()
    .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(outPath);
  stats.photos_written++;
  return publicPath;
}

// === Build catalog cards (consolidated by slug) ===
const catalogBySlug = new Map();
for (const r of classified) {
  if (r.type !== "catalog") continue;
  const slug = r.match.slug;
  if (!catalogBySlug.has(slug)) {
    catalogBySlug.set(slug, {
      entry: r.match,
      photos: [], // ordered photos (newest first will be reversed at end)
      sources: [],
      first_ts: r.msg.ts,
      last_ts: r.msg.ts
    });
  }
  const cur = catalogBySlug.get(slug);
  for (const p of r.msg.photos) {
    if (!cur.photos.includes(p)) cur.photos.push(p);
  }
  cur.sources.push(r.msg.id);
  if ((r.msg.ts || "") > (cur.last_ts || "")) cur.last_ts = r.msg.ts;
}

if (!DRY) {
  fs.mkdirSync(PHOTOS_OUT, { recursive: true });
  fs.mkdirSync(path.join(CONTENT_ROOT, "tortes"), { recursive: true });
  fs.mkdirSync(path.join(CONTENT_ROOT, "sweets"), { recursive: true });
  fs.mkdirSync(path.join(CONTENT_ROOT, "journal"), { recursive: true });
  fs.mkdirSync(ANALYSIS_OUT, { recursive: true });
}

// Write catalog (tortes + sweets)
for (const [slug, data] of catalogBySlug) {
  const entry = data.entry;
  const collection = entry.collection;
  // Sort photos: prefer newer (later in messages array = later ts) — already in ts order; reverse to put newest first
  const photos = data.photos.slice().reverse().slice(0, MAX_PHOTOS_PER_CARD);
  const webps = [];
  for (let i = 0; i < photos.length; i++) {
    const outName = `${collection}-${slug}-${i + 1}`;
    const w = await ensureWebp(photos[i], outName);
    if (w) webps.push(w);
  }

  const hero = webps[0] ?? null;
  const gallery = webps.slice(1);

  const fm = {
    slug,
    title_uk: entry.title_uk,
    title_de: entry.title_de,
    summary_uk: entry.summary_uk,
    summary_de: entry.summary_de,
    price_per_kg_eur: entry.price_per_kg_eur ?? null,
    price_per_piece_eur: entry.price_per_piece_eur ?? null,
    pack_sizes: entry.pack_sizes ?? [],
    lead_time_days: 3,
    hero_image: hero,
    gallery,
    tags: entry.tags ?? [],
    allergens: entry.allergens ?? ["gluten", "eggs", "milk"],
    featured: !!entry.featured,
    order: entry.order ?? 100,
    source_message_ids: data.sources,
    last_seen_ts: isoTimestamp(data.last_ts) ?? null
  };

  const isPerPiece = !!entry.price_per_piece_eur && !entry.price_per_kg_eur;
  let body;
  if (collection === "sweets") {
    body = `${entry.summary_uk}\n\nIdeal für Kindergarten, Schule, Büro oder als Candybar-Ergänzung. Mindestens 3 Tage Vorlauf empfohlen.`;
  } else if (isPerPiece) {
    body = `${entry.summary_uk}\n\nMini-Format. Personalisierte Aufschrift inklusive. Mindestens 3 Tage Vorlauf.`;
  } else {
    body = `${entry.summary_uk}\n\n*Werden frisch und auf Bestellung gefertigt. Mindestens 3 Tage Vorlauf, ab 1 kg. Standarddekor inklusive — individuelles Dekor nach Aufwand.*`;
  }

  const mdx = renderMdx(fm, body);
  const file = path.join(CONTENT_ROOT, collection, slug + ".mdx");
  if (!DRY) fs.writeFileSync(file, mdx);
  stats.files_written[collection]++;
  console.error(`  catalog ${collection}/${slug} (${data.sources.length} sources, ${webps.length} photos)`);
}

// === Build journal entries ===
// Filter: keep most recent N
const journalCandidates = classified.filter(r => r.type === "journal");
journalCandidates.sort((a, b) => {
  const ta = parseTimestamp(a.msg.ts)?.getTime() ?? 0;
  const tb = parseTimestamp(b.msg.ts)?.getTime() ?? 0;
  return tb - ta;
});
const journalSlice = journalCandidates.slice(0, MAX_JOURNAL_ENTRIES);

for (const r of journalSlice) {
  const msg = r.msg;
  const d = isoDate(msg.ts) ?? "0000-00-00";
  const slug = `${d}-${msg.id}`;
  const photos = [];
  for (let i = 0; i < Math.min(msg.photos.length, 3); i++) {
    const outName = `journal-${slug}-${i + 1}`;
    const w = await ensureWebp(msg.photos[i], outName);
    if (w) photos.push(w);
  }
  const title_uk = deriveTitle(msg.text, r.category);
  const fm = {
    slug,
    title_uk,
    title_de: null,
    date: isoTimestamp(msg.ts) ?? new Date().toISOString(),
    category: r.category,
    photos,
    source_message_id: msg.id
  };
  const bodyText = sanitiseJournalBody(msg.text || "");
  const mdx = renderMdx(fm, bodyText);
  const file = path.join(CONTENT_ROOT, "journal", slug + ".mdx");
  if (!DRY) fs.writeFileSync(file, mdx);
  stats.files_written.journal++;
}

// === Reports ===
console.error("\n=== Import report ===");
console.error("Classified: " + JSON.stringify(stats.classified));
console.error("Dropped:    " + JSON.stringify(stats.dropped));
console.error("Files:      " + JSON.stringify(stats.files_written));
console.error("Photos:     written=" + stats.photos_written + ", skipped_existing=" + stats.photos_skipped_existing);
console.error(`Mode: ${DRY ? "DRY-RUN" : "WRITE"}`);

if (!DRY) {
  const reportPath = path.join(ANALYSIS_OUT, `import-report-${new Date().toISOString().replace(/[:.]/g, "-")}.json`);
  fs.writeFileSync(reportPath, JSON.stringify(stats, null, 2));
  console.error(`Report saved: ${reportPath}`);
}

// === Helpers ===
function renderMdx(frontmatter, body) {
  const fm = Object.entries(frontmatter).map(([k, v]) => `${k}: ${serialiseYaml(v)}`).join("\n");
  return `---\n${fm}\n---\n\n${body}\n`;
}

function serialiseYaml(v) {
  if (v === null || v === undefined) return "null";
  if (typeof v === "boolean") return v ? "true" : "false";
  if (typeof v === "number") return String(v);
  if (Array.isArray(v)) {
    if (!v.length) return "[]";
    return "\n" + v.map(x => "  - " + serialiseYamlInline(x)).join("\n");
  }
  return serialiseYamlInline(v);
}
function serialiseYamlInline(v) {
  if (v === null || v === undefined) return "null";
  if (typeof v === "boolean") return v ? "true" : "false";
  if (typeof v === "number") return String(v);
  const s = String(v);
  // Force quoting for strings that YAML would parse as another type (numbers, bool-likes, null-likes).
  const looksLikeNumber = /^-?\d+(\.\d+)?$/.test(s);
  const looksLikeBool = /^(true|false|yes|no|on|off|null|~)$/i.test(s);
  const hasSpecialChars = /[":#&*!|>'%@`,\[\]{}\n]/.test(s) || /^\s|\s$/.test(s);
  if (looksLikeNumber || looksLikeBool || hasSpecialChars) {
    return `"${s.replaceAll("\\", "\\\\").replaceAll('"', '\\"')}"`;
  }
  return s;
}

function deriveTitle(text, category) {
  const trimmed = (text || "").split("\n")[0].slice(0, 80).trim();
  if (trimmed.length > 10) return trimmed;
  const fallback = {
    in_stock: "У наявності сьогодні",
    showcase: "Вітрина",
    delivered: "Готовий замовлення",
    event_teaser: "Анонс",
    testimonial: "Відгук гостя",
    seasonal: "Сезонне"
  };
  return fallback[category] || "Допис з каналу";
}

function sanitiseJournalBody(text) {
  // strip Telegram CTAs that don't make sense on the site
  let s = text.replaceAll(/Для замовлення пишіть в приват[^\n]*/gi, "");
  s = s.replaceAll(/Пишіть в приват[^\n]*/gi, "");
  s = s.replaceAll(/👉/g, "");
  // collapse multiple newlines
  s = s.split("\n").map(l => l.trim()).filter(Boolean).join("\n\n");
  return s.trim();
}
