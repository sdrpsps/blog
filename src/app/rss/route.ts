import { allPosts } from "content-collections";

import { config } from "@/lib/config";

const siteTitle =
  typeof config.metadata.title === "string"
    ? config.metadata.title
    : "Sunny's Blog";
const siteDescription = config.metadata.description ?? "";
const siteLanguage = config.metadata.openGraph?.locale ?? "zh-CN";

const xmlEscape = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

export function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!baseUrl) {
    return new Response("Missing NEXT_PUBLIC_APP_URL environment variable.", {
      status: 500,
    });
  }

  const posts = [...allPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const lastUpdated = posts[0]
    ? new Date(posts[0].updated ?? posts[0].date)
    : new Date();

  const itemsXml = posts
    .map((post) => {
      const postUrl = `${baseUrl}/posts/${post.slug}`;
      const updatedDate = new Date(post.updated ?? post.date);

      return `
        <item>
          <title>${xmlEscape(post.title)}</title>
          <link>${xmlEscape(postUrl)}</link>
          <guid>${xmlEscape(postUrl)}</guid>
          <pubDate>${updatedDate.toUTCString()}</pubDate>
          ${
            post.summary
              ? `<description>${xmlEscape(post.summary)}</description>`
              : ""
          }
        </item>
      `;
    })
    .join("");

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${xmlEscape(siteTitle)}</title>
    <link>${xmlEscape(baseUrl)}</link>
    <description>${xmlEscape(siteDescription)}</description>
    <language>${xmlEscape(siteLanguage)}</language>
    <lastBuildDate>${lastUpdated.toUTCString()}</lastBuildDate>
    ${itemsXml}
  </channel>
</rss>
`;

  return new Response(rssXml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
