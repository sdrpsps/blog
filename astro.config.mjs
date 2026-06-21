import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';
import tailwind from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://bytespark.me',
  adapter: cloudflare({
    imageService: 'passthrough' // 禁用内置图像服务，直接在 Cloudflare 上输出，以确保高性能和避免编译错误
  }),
  integrations: [
    react(),
    mdx(),
    sitemap()
  ],
  vite: {
    plugins: [tailwind()],
    ssr: {
      external: ['node:async_hooks']
    }
  }
});
