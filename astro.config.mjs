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
    host: '0.0.0.0',
    port: 8080
  },
  vite: {
    define: {
      __SITE_NAME__: JSON.stringify('玩机管家')
    }
  }
});
