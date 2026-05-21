import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://ladolcegera.de",
  i18n: {
    defaultLocale: "de",
    locales: ["de", "uk"],
    routing: { prefixDefaultLocale: false }
  },
  integrations: [mdx(), sitemap()],
  vite: { plugins: [tailwindcss()] },
  image: { service: { entrypoint: "astro/assets/services/sharp" } }
});
