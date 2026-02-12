import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";

export default defineConfig({
  site: "https://admt.lacs.cc",
  output: "server",
  adapter: vercel({
    webAnalytics: { enabled: true },
  }),
  integrations: [tailwind(), sitemap(), react()],
  server: {
    host: "0.0.0.0",
    port: 3000,
  },
  vite: {
    define: {
      __SITE_NAME__: JSON.stringify("玩机管家"),
    },
  },
});
