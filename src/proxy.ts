import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { allPosts } from "content-collections";

export function proxy(req: NextRequest) {
  const url = req.nextUrl;
  const { pathname } = url;

  // Only handle legacy blog paths; config.matcher limits this too
  if (!pathname.startsWith("/blog")) {
    return NextResponse.next();
  }

  // If exactly /blog or /blog/ -> redirect to posts index
  const clean = pathname.replace(/\/+$/, "");
  if (clean === "/blog") {
    return NextResponse.redirect(new URL("/posts", req.url), 308);
  }

  // Take the last path segment as slug
  const segments = clean.split("/").filter(Boolean);
  const last = decodeURIComponent(segments[segments.length - 1]!);

  // If a post with this slug exists, redirect to canonical /posts/:slug
  const exists = allPosts.some((p) => p.slug === last);
  if (exists) {
    return NextResponse.redirect(new URL(`/posts/${last}`, req.url), 308);
  }

  // Otherwise, send to posts index
  return NextResponse.redirect(new URL("/posts", req.url), 308);
}

export const config = {
  matcher: ["/blog/:path*"],
};

