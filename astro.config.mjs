import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://admt.lacs.cc',
  output: 'static',
  adapter: vercel({
    webAnalytics: { enabled: true }
  }),
  integrations: [
    tailwind(),
    sitemap()
  ],
  server: {
    port: 3000
  },
  vite: {
    define: {
      __SITE_NAME__: JSON.stringify('玩机管家')
    }
  }
});
