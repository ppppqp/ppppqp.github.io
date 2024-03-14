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

// https://astro.build/config
export default defineConfig({
  site: "https://example.com",
  integrations: [mdx(), sitemap(), react()],
  redirects: {
    "/": "/tech",
  },
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeRaw, rehypeSlug, rehypeAutolinkHeadings, rehypeToc, rehypeFormat],
  }

});
