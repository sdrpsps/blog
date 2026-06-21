import type { MiddlewareHandler } from "astro";
import { getCollection } from "astro:content";

export const onRequest: MiddlewareHandler = async (context, next) => {
  const url = new URL(context.request.url);
  const { pathname } = url;

  // 仅处理旧的 /blog 开头的路径
  if (pathname.startsWith("/blog")) {
    const clean = pathname.replace(/\/+$/, "");
    if (clean === "/blog") {
      return context.redirect("/posts", 308);
    }

    // 提取最后一部分作为 slug
    const segments = clean.split("/").filter(Boolean);
    const last = decodeURIComponent(segments[segments.length - 1]!);

    try {
      // 检查是否存在此 slug 的博客文章
      const posts = await getCollection("posts");
      const exists = posts.some((p) => p.id === last);
      
      if (exists) {
        return context.redirect(`/posts/${last}`, 308);
      }
    } catch (e) {
      console.error("Error reading collection in middleware:", e);
    }

    // 默认重定向到文章列表页
    return context.redirect("/posts", 308);
  }

  return next();
};

