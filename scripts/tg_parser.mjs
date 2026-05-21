// Shared Telegram Desktop messages.html parser.
// Used by both analyze_tg_export.mjs and import_tg_to_content.mjs.

import fs from "node:fs";
import path from "node:path";

export function readAllMessagesHtml(exportRoot) {
  const files = fs.readdirSync(exportRoot)
    .filter(f => /^messages\d*\.html$/.test(f))
    .sort((a, b) => {
      const na = a === "messages.html" ? 0 : parseInt(a.match(/\d+/)[0]);
      const nb = b === "messages.html" ? 0 : parseInt(b.match(/\d+/)[0]);
      return na - nb;
    });
  if (!files.length) throw new Error(`no messages*.html in ${exportRoot}`);
  return files.map(f => fs.readFileSync(path.join(exportRoot, f), "utf8")).join("\n");
}

const decodeEntities = (s) => s
  .replaceAll("&amp;", "&").replaceAll("&laquo;", "«").replaceAll("&raquo;", "»")
  .replaceAll("&quot;", '"').replaceAll("&apos;", "'").replaceAll("&lt;", "<").replaceAll("&gt;", ">")
  .replaceAll("&nbsp;", " ");

const stripTags = (s) =>
  decodeEntities(s.replaceAll(/<br\s*\/?>/g, "\n").replaceAll(/<[^>]+>/g, "")).trim();

export function parseMessages(html) {
  // Date dividers
  const dateMarks = [];
  const dateRe = /<div class="message service" id="message-?\d+">\s*<div class="body details">\s*([^<]+?)\s*<\/div>/g;
  let m;
  while ((m = dateRe.exec(html)) !== null) {
    const text = m[1].trim();
    if (/^\d{1,2}\s+\w+\s+\d{4}$/.test(text)) dateMarks.push({ index: m.index, date: text });
  }

  const messages = [];
  // Match all `message default` blocks including `joined` variants.
  // We bound by the next `<div class="message …"` opening to know where the body ends.
  const blockRe = /<div class="message default clearfix(?: joined)?" id="message(\d+)">([\s\S]*?)(?=<div class="message (?:service|default))/g;
  while ((m = blockRe.exec(html)) !== null) {
    const blockId = m[1];
    const body = m[2];
    let date = null;
    for (const mark of dateMarks) { if (mark.index < m.index) date = mark.date; else break; }
    const timeMatch = body.match(/title="(\d{2}\.\d{2}\.\d{4} \d{2}:\d{2}:\d{2})/);
    const fromMatch = body.match(/<div class="from_name">\s*([^<]+?)\s*</);
    const textMatch = body.match(/<div class="text">([\s\S]*?)<\/div>/);
    const photoRe = /href="(photos\/[^"]+\.jpg)"/g;
    const photos = [...body.matchAll(photoRe)].map(x => x[1]).filter(x => !x.includes("_thumb"));
    const videos = [...body.matchAll(/href="(video_files\/[^"]+)"/g)].map(x => x[1]);
    const replyMatch = body.match(/onclick="return GoToMessage\((\d+)\)/);
    const reactions = [...body.matchAll(/<span class="reaction">\s*<span class="emoji">\s*([^<]+?)\s*</g)].map(x => x[1].trim());
    messages.push({
      id: blockId,
      date,
      ts: timeMatch ? timeMatch[1] : null,
      from: fromMatch ? decodeEntities(fromMatch[1].trim()) : null,
      text: textMatch ? stripTags(textMatch[1]) : "",
      photos,
      videos,
      reply_to: replyMatch ? replyMatch[1] : null,
      reactions
    });
  }
  return messages;
}

export function parseTimestamp(ts) {
  // "12.07.2024 23:01:33" → Date
  if (!ts) return null;
  const m = ts.match(/^(\d{2})\.(\d{2})\.(\d{4})\s+(\d{2}):(\d{2}):(\d{2})$/);
  if (!m) return null;
  return new Date(`${m[3]}-${m[2]}-${m[1]}T${m[4]}:${m[5]}:${m[6]}`);
}

export function isoDate(ts) {
  const d = parseTimestamp(ts);
  return d ? d.toISOString().slice(0, 10) : null;
}

export function isoTimestamp(ts) {
  const d = parseTimestamp(ts);
  return d ? d.toISOString() : null;
}

// Stable hash for photo content (use file path as proxy if reading files is expensive).
// For our purposes file basename is a stable Telegram-side identifier.
export function photoKey(photoHref) {
  return path.basename(photoHref);
}

const OWNERS = new Set(["Дарья", "Дар'я", "Дар'я Громова", "Дарья Громова", "Daria"]);
export function isOwner(msg) {
  // Owner messages: explicit from_name in OWNERS, OR continuation of owner album (no from_name but came right after one).
  return msg.from ? OWNERS.has(msg.from.trim()) : msg.__owner_continuation;
}

export function annotateOwnerContinuation(messages) {
  // For "joined" album posts that have no from_name, attach owner status from the preceding non-joined post.
  let lastOwner = false;
  for (const m of messages) {
    if (m.from) {
      lastOwner = OWNERS.has(m.from.trim());
    } else {
      m.__owner_continuation = lastOwner;
    }
  }
  return messages;
}
