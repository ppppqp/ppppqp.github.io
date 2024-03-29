import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import rehypeToc from "rehype-toc";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import remarkMath from "remark-math";
import rehypeFormat from "rehype-format";
import react from "@astrojs/react";
import callouts from 'remark-callouts'

// https://astro.build/config
export default defineConfig({
  site: "https://ppppqp.github.io",
  integrations: [mdx(), sitemap(), react()],
  redirects: {
    "/": "/tech",
  },
  markdown: {
    remarkPlugins: [remarkMath, callouts],
    rehypePlugins: [rehypeRaw, rehypeSlug, rehypeAutolinkHeadings, rehypeToc, rehypeFormat],
  },
  i18n: {
    defaultLocale: "zh",
    locales: ["en", "zh"],
    routing: {
      prefixDefaultLocale: false
    }
  }

});
