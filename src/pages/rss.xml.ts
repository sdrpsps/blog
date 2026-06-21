import type { APIContext } from "astro";
import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { config } from "../lib/config";

export async function GET(context: APIContext) {
  const posts = await getCollection("posts");
  const sortedPosts = posts.sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );

  const siteUrl = "https://bytespark.me";

  return rss({
    title: config.metadata.title as string,
    description: config.metadata.description as string,
    site: siteUrl,
    items: sortedPosts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.summary || "",
      link: `/posts/${post.id}`,
    })),
    customData: `<language>${config.metadata.openGraph?.locale || "zh-CN"}</language>`,
  });
}
