import Link from "next/link";
import * as React from "react";

import { cn } from "@/lib/utils";

type LinkPreviewMetadata = {
  title: string;
  description?: string;
  image?: string;
  siteName?: string;
  hostname: string;
};

const metadataCache = new Map<string, Promise<LinkPreviewMetadata>>();

const USER_AGENT =
  "Mozilla/5.0 (compatible; BlogLinkPreview/1.0; +https://github.com/)";

async function fetchLinkMetadata(url: string): Promise<LinkPreviewMetadata> {
  const target = new URL(url);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent": USER_AGENT,
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      },
      next: {
        revalidate: 60 * 60 * 6, // cache metadata for 6 hours
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to load metadata for ${url}`);
    }

    const rawHtml = (await response.text()).slice(0, 200_000);

    const title =
      extractMeta(rawHtml, "og:title") ??
      extractMeta(rawHtml, "twitter:title") ??
      extractTitle(rawHtml) ??
      url;
    const description =
      extractMeta(rawHtml, "og:description") ??
      extractMeta(rawHtml, "description") ??
      extractMeta(rawHtml, "twitter:description");

    const image =
      resolveUrl(
        extractMeta(rawHtml, "og:image") ??
          extractMeta(rawHtml, "twitter:image"),
        target
      ) ?? undefined;
    const siteName =
      extractMeta(rawHtml, "og:site_name") ??
      extractMeta(rawHtml, "application-name");

    return {
      title,
      description,
      image,
      siteName,
      hostname: target.hostname,
    };
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[MDXLinkPreview] metadata fetch failed:", error);
    }
    return {
      title: url,
      hostname: target.hostname,
    };
  }
}

function extractTitle(html: string) {
  const match = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  return match?.[1]?.trim() || undefined;
}

function extractMeta(html: string, key: string) {
  const pattern = new RegExp(
    `<meta[^>]+(?:name|property)=["']${escapeRegExp(
      key
    )}["'][^>]+content=["']([^"']+)["'][^>]*>`,
    "i"
  );
  const match = html.match(pattern);
  return match?.[1]?.trim() || undefined;
}

function resolveUrl(value: string | undefined, base: URL) {
  if (!value) return undefined;
  try {
    return new URL(value, base).toString();
  } catch {
    return undefined;
  }
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function getLinkMetadata(url: string) {
  const cached = metadataCache.get(url);
  if (cached) {
    return cached;
  }

  const promise = fetchLinkMetadata(url);
  metadataCache.set(url, promise);
  return promise;
}

export interface MDXLinkPreviewProps
  extends Omit<React.ComponentProps<typeof Link>, "href"> {
  url: string;
  descriptionFallback?: string;
}

export async function MDXLinkPreview({
  url,
  className,
  descriptionFallback,
  ...props
}: MDXLinkPreviewProps) {
  const metadata = await getLinkMetadata(url);

  return (
    <Link
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group flex w-full gap-4 rounded-xl border border-border/50 bg-card p-5",
        "transition-all duration-200 ease-in-out",
        "hover:border-border hover:bg-muted/40 hover:shadow-md",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
      {...props}
    >
      {metadata.image && (
        <div className="relative hidden h-24 w-32 shrink-0 overflow-hidden rounded-lg bg-muted sm:block">
          <img
            src={metadata.image}
            alt={metadata.title}
            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {metadata.siteName || metadata.hostname}
        </div>
        <p className="truncate text-lg font-semibold text-foreground transition-colors duration-200 group-hover:text-primary">
          {metadata.title}
        </p>
        <p className="text-sm text-muted-foreground overflow-hidden text-ellipsis">
          {metadata.description || descriptionFallback || "查看详情"}
        </p>
        <span className="text-xs text-muted-foreground/80">
          {metadata.hostname}
        </span>
      </div>
    </Link>
  );
}
