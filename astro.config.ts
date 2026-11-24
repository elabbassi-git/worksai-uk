import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { unified } from '@astrojs/markdown-remark';
import tailwindcss from '@tailwindcss/vite';
import { remarkPrices } from './integrations/remark-prices.ts';
import { rehypeSections } from './integrations/rehype-sections.ts';
import { seoBuild } from './integrations/seo-build.ts';

export default defineConfig({
  site: 'https://worksai.uk',
  trailingSlash: 'always',
  output: 'static',
  build: { format: 'directory', inlineStylesheets: 'always' },
  compressHTML: true,
  prefetch: false,
  markdown: { processor: unified({ remarkPlugins: [remarkPrices], rehypePlugins: [rehypeSections], smartypants: false }) },
  integrations: [mdx(), seoBuild()],
  vite: {
    plugins: [tailwindcss()],
    build: { assetsInlineLimit: 0 },
  },
});
