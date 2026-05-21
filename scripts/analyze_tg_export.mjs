#!/usr/bin/env node
// Parse Telegram Desktop "messages.html" export → structured JSON + report.
// Usage: node analyze_tg_export.mjs "<export_folder>"

import fs from "node:fs";
import path from "node:path";

const root = process.argv[2];
if (!root) { console.error("usage: analyze_tg_export.mjs <export_folder>"); process.exit(1); }
const htmlFiles = fs.readdirSync(root)
  .filter(f => /^messages\d*\.html$/.test(f))
  .sort((a, b) => {
    const na = a === "messages.html" ? 0 : parseInt(a.match(/\d+/)[0]);
    const nb = b === "messages.html" ? 0 : parseInt(b.match(/\d+/)[0]);
    return na - nb;
  });
if (!htmlFiles.length) { console.error("no messages*.html found in " + root); process.exit(1); }
console.error("Reading: " + htmlFiles.join(", "));
const html = htmlFiles.map(f => fs.readFileSync(path.join(root, f), "utf8")).join("\n");

const decodeEntities = (s) => s
  .replaceAll("&amp;", "&").replaceAll("&laquo;", "«").replaceAll("&raquo;", "»")
  .replaceAll("&quot;", '"').replaceAll("&apos;", "'").replaceAll("&lt;", "<").replaceAll("&gt;", ">")
  .replaceAll("&nbsp;", " ");
const stripTags = (s) => decodeEntities(s.replaceAll(/<br\s*\/?>/g, "\n").replaceAll(/<[^>]+>/g, "")).trim();

const messages = [];
const dateDividerRe = /<div class="message service" id="message-?\d+">\s*<div class="body details">\s*([^<]+?)\s*<\/div>/g;
let currentDate = null;
const dateMarks = [];
let m;
while ((m = dateDividerRe.exec(html)) !== null) {
  const text = m[1].trim();
  if (/^\d{1,2}\s+\w+\s+\d{4}$/.test(text)) dateMarks.push({ index: m.index, date: text });
}

const blockRe = /<div class="message default clearfix(?: joined)?" id="message(\d+)">([\s\S]*?)(?=<div class="message (?:service|default))/g;
while ((m = blockRe.exec(html)) !== null) {
  const blockId = m[1];
  const body = m[2];
  let date = null;
  for (const mark of dateMarks) { if (mark.index < m.index) date = mark.date; else break; }
  const timeMatch = body.match(/title="(\d{2}\.\d{2}\.\d{4} \d{2}:\d{2}:\d{2})/);
  const fromMatch = body.match(/<div class="from_name">\s*([^<]+?)\s*</);
  const textMatch = body.match(/<div class="text">([\s\S]*?)<\/div>/);
  const photoMatches = [...body.matchAll(/href="(photos\/[^"]+\.jpg)"/g)].map(x=>x[1]).filter(x=>!x.includes("_thumb"));
  const videoMatches = [...body.matchAll(/href="(video_files\/[^"]+)"/g)].map(x=>x[1]);
  const replyMatch = body.match(/onclick="return GoToMessage\((\d+)\)/);
  const reactions = [...body.matchAll(/<span class="reaction">\s*<span class="emoji">\s*([^<]+?)\s*</g)].map(x=>x[1].trim());
  messages.push({
    id: blockId,
    date,
    ts: timeMatch ? timeMatch[1] : null,
    from: fromMatch ? decodeEntities(fromMatch[1].trim()) : null,
    text: textMatch ? stripTags(textMatch[1]) : "",
    photos: photoMatches,
    videos: videoMatches,
    reply_to: replyMatch ? replyMatch[1] : null,
    reactions
  });
}

// ANALYSIS
const owners = new Set(["Дарья", "Дар'я", "Дар'я Громова", "Дарья Громова"]);
const ownerMsgs = messages.filter(x => owners.has((x.from||"").trim()));
const guestMsgs = messages.filter(x => x.from && !owners.has(x.from.trim()));
const anonMsgs = messages.filter(x => !x.from); // forwarded/joined media without explicit from_name (likely part of owner's album)

const allText = messages.map(x=>x.text).join("\n").toLowerCase();

const cakeKeywords = ["медівник","медовик","наполеон","шоколад","полуниц","малин","манго","мак","сирн","чізкейк","чизкейк","фісташк","фисташк","банан","кокос","карамел","крем","брют","бенто","капкейк","еклер","еклеры","еклері","macaron","макарон","тірамісу","тірамису","торт","десерт","пиріг","пасха","паска","роли","роллы","булоч","круасан","круассан","бісквіт","мус","праліне","фондан","медівнич"];
const cakeMentions = {};
for (const kw of cakeKeywords) {
  const re = new RegExp(kw, "gi");
  const hits = (allText.match(re) || []).length;
  if (hits > 0) cakeMentions[kw] = hits;
}

// prices: "X €", "X EUR", "X грн" etc.
const priceMatches = [...allText.matchAll(/(\d+[\.,]?\d*)\s*(€|eur|euro|грн|uah)/gi)].map(x=>x[0]);
const priceFreq = {};
priceMatches.forEach(p => priceFreq[p] = (priceFreq[p]||0)+1);

// posts per day
const byDate = {};
for (const m of messages) {
  if (!m.ts) continue;
  const day = m.ts.slice(0,10);
  byDate[day] = (byDate[day]||0)+1;
}

// unique posters
const posters = {};
for (const m of messages) { if (m.from) posters[m.from] = (posters[m.from]||0)+1; }

// owner posts with photos (most likely catalog content)
const catalogCandidates = ownerMsgs.filter(x => x.photos.length > 0);

const report = {
  total_messages: messages.length,
  with_photos: messages.filter(x=>x.photos.length>0).length,
  with_videos: messages.filter(x=>x.videos.length>0).length,
  date_first: messages.find(x=>x.ts)?.ts,
  date_last: [...messages].reverse().find(x=>x.ts)?.ts,
  busiest_days: Object.entries(byDate).sort((a,b)=>b[1]-a[1]).slice(0,8),
  posters_top: Object.entries(posters).sort((a,b)=>b[1]-a[1]).slice(0,12),
  owner_messages: ownerMsgs.length,
  guest_messages: guestMsgs.length,
  anon_album_messages: anonMsgs.length,
  cake_mentions: Object.entries(cakeMentions).sort((a,b)=>b[1]-a[1]),
  price_mentions: Object.entries(priceFreq).sort((a,b)=>b[1]-a[1]).slice(0,30),
  owner_posts_with_photos: catalogCandidates.length,
};

const outDir = path.join("C:/Users/Asus/dolcevitta/analysis");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "messages.json"), JSON.stringify(messages, null, 2));
fs.writeFileSync(path.join(outDir, "report.json"), JSON.stringify(report, null, 2));

// HUMAN-READABLE SAMPLE: dump first 30 owner-with-photo posts as catalog candidates
const sample = catalogCandidates.slice(0, 40).map(x => ({
  id: x.id, ts: x.ts, photo: x.photos[0],
  text: x.text.slice(0, 280)
}));
fs.writeFileSync(path.join(outDir, "catalog_candidates_sample.json"), JSON.stringify(sample, null, 2));

// Customer reviews: guest messages that have text and are replies (likely thank-you / review)
const reviews = guestMsgs.filter(x => x.text && (x.reply_to || x.text.length > 30)).slice(0, 60).map(x => ({
  from: x.from, ts: x.ts, text: x.text.slice(0,400), photo: x.photos[0]||null, reply_to: x.reply_to
}));
fs.writeFileSync(path.join(outDir, "reviews_sample.json"), JSON.stringify(reviews, null, 2));

console.log(JSON.stringify(report, null, 2));
console.log(`\nWrote: ${outDir}\n  messages.json (${messages.length} msgs)\n  catalog_candidates_sample.json\n  reviews_sample.json\n  report.json`);
