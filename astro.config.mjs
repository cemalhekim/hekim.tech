import { defineConfig } from "astro/config"
import mdx from "@astrojs/mdx"
import sitemap from "@astrojs/sitemap"
import tailwind from "@astrojs/tailwind"
import solidJs from "@astrojs/solid-js"
import icon from "astro-icon"

// https://astro.build/config
export default defineConfig({
  site: "https://hekim.tech",
  i18n: {
    defaultLocale: "en",
    locales: ["en", "de", "tr"],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [mdx(), sitemap(), solidJs(), tailwind({ applyBaseStyles: false }), icon()],
})