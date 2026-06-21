import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const posts = defineCollection({
  // 使用 Astro v6 推荐的 glob loader 加载 markdown/mdx 文件
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    summary: z.string().optional(),
    keywords: z.array(z.string()).optional(),
    image: z.string().optional(),
  }),
});

export const collections = {
  posts: posts,
};
