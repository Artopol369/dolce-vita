import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// LMIV Anhang II — all 14 mandatory allergen classes + legacy descriptive tags
// kept for backward compatibility with existing imported content (honey, cherry, poppy).
const AllergenEnum = z.enum([
  "gluten",       // glutenhaltiges Getreide
  "crustaceans",  // Krebstiere
  "eggs",         // Eier
  "fish",         // Fisch
  "peanuts",      // Erdnüsse
  "soy",          // Soja
  "milk",         // Milch (inkl. Laktose)
  "nuts",         // Schalenfrüchte
  "celery",       // Sellerie
  "mustard",      // Senf
  "sesame",       // Sesam
  "sulphites",    // Schwefeldioxid und Sulfite
  "lupin",        // Lupinen
  "molluscs",     // Weichtiere
  // legacy non-LMIV descriptive tags
  "honey",
  "cherry",
  "poppy"
]);

const tortes = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/tortes" }),
  schema: z.object({
    title_uk: z.string(),
    title_de: z.string(),
    summary_uk: z.string().optional(),
    summary_de: z.string().optional(),
    ingredients_de: z.string().optional(),
    ingredients_uk: z.string().optional(),
    price_per_kg_eur: z.number().nullable().optional(),
    price_per_piece_eur: z.number().nullable().optional(),
    min_weight_kg: z.number().optional(),
    lead_time_days: z.number().default(3),
    hero_image: z.string().optional(),
    gallery: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    allergens: z.array(AllergenEnum).default(["gluten", "eggs", "milk"]),
    featured: z.boolean().default(false),
    order: z.number().default(100),
    source_message_ids: z.array(z.string()).default([]),
    last_seen_ts: z.string().optional()
  })
});

const sweets = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/sweets" }),
  schema: z.object({
    title_uk: z.string(),
    title_de: z.string(),
    summary_uk: z.string().optional(),
    summary_de: z.string().optional(),
    ingredients_de: z.string().optional(),
    ingredients_uk: z.string().optional(),
    price_per_piece_eur: z.number().nullable().optional(),
    price_per_kg_eur: z.number().nullable().optional(),
    pieces_per_kg: z.number().optional(),
    piece_weight_g: z.number().optional(),
    pack_sizes: z.array(z.number()).default([]),
    hero_image: z.string().optional(),
    gallery: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    allergens: z.array(AllergenEnum).default(["gluten", "eggs", "milk"]),
    featured: z.boolean().default(false),
    order: z.number().default(100),
    source_message_ids: z.array(z.string()).default([]),
    last_seen_ts: z.string().optional()
  })
});

const journal = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/journal" }),
  schema: z.object({
    title_uk: z.string(),
    title_de: z.string().nullable().default(null),
    date: z.string(),
    category: z.enum(["in_stock", "showcase", "delivered", "event_teaser", "testimonial", "seasonal"]),
    photos: z.array(z.string()).default([]),
    source_message_id: z.string()
  })
});

export const collections = { tortes, sweets, journal };
