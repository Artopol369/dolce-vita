import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const tortes = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/tortes" }),
  schema: z.object({
    title_uk: z.string(),
    title_de: z.string(),
    summary_uk: z.string().optional(),
    summary_de: z.string().optional(),
    price_per_kg_eur: z.number().nullable().optional(),
    price_per_piece_eur: z.number().nullable().optional(),
    min_weight_kg: z.number().optional(),
    lead_time_days: z.number().default(3),
    hero_image: z.string().optional(),
    gallery: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    allergens: z.array(z.string()).default(["gluten", "eggs", "milk"]),
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
    price_per_piece_eur: z.number().nullable().optional(),
    price_per_kg_eur: z.number().nullable().optional(),
    pieces_per_kg: z.number().optional(),
    pack_sizes: z.array(z.number()).default([]),
    hero_image: z.string().optional(),
    gallery: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    allergens: z.array(z.string()).default(["gluten", "eggs", "milk"]),
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
