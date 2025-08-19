import hljs from "highlight.js";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";

import { cn, generateHeadingId } from "@/lib/utils";

export const mdxComponents = {
  h1: ({
    className,
    children,
    ...props
  }: React.HTMLAttributes<HTMLHeadingElement>) => {
    return (
      <h1
        id={generateHeadingId(children)}
        className={cn(
          "font-heading mt-12 mb-8 scroll-m-20 text-4xl/tight font-bold tracking-tight",
          "text-foreground",
          className
        )}
        {...props}
      >
        {children}
      </h1>
    );
  },
  h2: ({
    className,
    children,
    ...props
  }: React.HTMLAttributes<HTMLHeadingElement>) => {
    return (
      <h2
        id={generateHeadingId(children)}
        className={cn(
          "font-heading mt-10 mb-6 scroll-m-20 text-2xl/tight font-semibold tracking-tight",
          "text-foreground",
          className
        )}
        {...props}
      >
        {children}
      </h2>
    );
  },
  h3: ({
    className,
    children,
    ...props
  }: React.HTMLAttributes<HTMLHeadingElement>) => {
    return (
      <h3
        id={generateHeadingId(children)}
        className={cn(
          "font-heading mt-8 mb-4 scroll-m-20 text-xl/tight font-semibold tracking-tight",
          "text-foreground",
          className
        )}
        {...props}
      >
        {children}
      </h3>
    );
  },
  h4: ({
    className,
    children,
    ...props
  }: React.HTMLAttributes<HTMLHeadingElement>) => {
    return (
      <h4
        id={generateHeadingId(children)}
        className={cn(
          "font-heading mt-6 mb-3 scroll-m-20 text-lg/tight font-medium tracking-tight",
          "text-foreground",
          className
        )}
        {...props}
      >
        {children}
      </h4>
    );
  },
  h5: ({
    className,
    children,
    ...props
  }: React.HTMLAttributes<HTMLHeadingElement>) => {
    return (
      <h5
        id={generateHeadingId(children)}
        className={cn(
          "font-heading mt-4 mb-2 scroll-m-20 text-lg/tight font-medium tracking-tight",
          "text-foreground",
          className
        )}
        {...props}
      >
        {children}
      </h5>
    );
  },
  h6: ({
    className,
    children,
    ...props
  }: React.HTMLAttributes<HTMLHeadingElement>) => {
    return (
      <h6
        id={generateHeadingId(children)}
        className={cn(
          "font-heading mt-3 mb-2 scroll-m-20 text-sm/tight font-medium tracking-tight",
          "text-muted-foreground",
          className
        )}
        {...props}
      >
        {children}
      </h6>
    );
  },
  a: ({ className, ...props }: React.HTMLAttributes<HTMLAnchorElement>) => (
    <a
      target="_blank"
      className={cn(
        "font-medium text-primary underline decoration-primary/30 underline-offset-4",
        "transition-all duration-200 ease-in-out",
        "hover:text-primary/80 hover:decoration-primary/60",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
      {...props}
    />
  ),
  p: ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p
      className={cn(
        "my-4 text-base/7 text-foreground",
        "leading-relaxed",
        className
      )}
      {...props}
    />
  ),
  strong: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <strong
      className={cn("font-semibold text-foreground", className)}
      {...props}
    />
  ),
  ul: ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul
      className={cn(
        "my-6 ml-6 list-disc space-y-2",
        "marker:text-muted-foreground/60",
        className
      )}
      {...props}
    />
  ),
  ol: ({ className, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol
      className={cn(
        "my-6 ml-6 list-decimal space-y-2",
        "marker:text-muted-foreground/60",
        className
      )}
      {...props}
    />
  ),
  li: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <li
      className={cn("text-base/6 text-foreground", "pl-2", className)}
      {...props}
    />
  ),
  blockquote: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <blockquote
      className={cn(
        "my-6 border-l-4 border-primary/20 pl-6",
        "bg-muted/30 rounded-r-lg py-4",
        "text-muted-foreground italic",
        className
      )}
      {...props}
    />
  ),
  img: ({
    src,
    className,
    alt,
    title,
  }: React.ImgHTMLAttributes<HTMLImageElement>) => {
    // 如果 title 属性存在，将其作为底部描述
    const hasCaption = title && title.trim() !== "";

    if (hasCaption) {
      return (
        <>
          <Image
            src={src as string}
            className={cn(
              "max-w-[80%] mx-auto rounded-lg",
              "shadow-sm w-full mt-8",
              className
            )}
            alt={alt || ""}
            width={0}
            height={0}
            sizes="100vw"
          />
          <span className="block mt-3 text-center text-sm text-muted-foreground">
            {title}
          </span>
        </>
      );
    }

    // 如果没有 title，返回普通图片
    return (
      <Image
        src={src as string}
        className={cn(
          "max-w-[80%] mx-auto rounded-lg",
          "shadow-sm my-8",
          className
        )}
        alt={alt || ""}
        width={0}
        height={0}
        sizes="100vw"
      />
    );
  },
  hr: ({ ...props }: React.HTMLAttributes<HTMLHRElement>) => (
    <hr className="my-8 border-border/50" {...props} />
  ),
  table: ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-6 w-full overflow-x-auto rounded-lg border border-border/50">
      <table
        className={cn("w-full border-collapse text-sm", "bg-card", className)}
        {...props}
      />
    </div>
  ),
  tr: ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr
      className={cn(
        "border-b border-border/30 last:border-b-0",
        "hover:bg-muted/30 transition-colors",
        className
      )}
      {...props}
    />
  ),
  th: ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th
      className={cn(
        "border-b border-border/50 p-4 text-left font-semibold",
        "bg-muted/50 text-foreground",
        className
      )}
      {...props}
    />
  ),
  td: ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td
      className={cn(
        "p-4 text-left text-foreground",
        "leading-relaxed",
        className
      )}
      {...props}
    />
  ),
  pre: ({ className, ...props }: React.HTMLAttributes<HTMLPreElement>) => (
    <pre
      className={cn(
        "mt-6 mb-4 overflow-x-auto rounded-lg border border-border/50",
        className
      )}
      {...props}
    />
  ),
  code: ({
    className,
    children,
    ...props
  }: React.HTMLAttributes<HTMLElement>) => {
    const lang = className?.replace("language-", "");
    if (lang && hljs.getLanguage(lang)) {
      const { value } = hljs.highlight(String(children), { language: lang });

      return (
        <code
          className={cn(
            "p-4 text-sm",
            "font-mono leading-relaxed",
            "hljs",
            className
          )}
          dangerouslySetInnerHTML={{ __html: value }}
          {...props}
        />
      );
    }

    return (
      <code
        className={cn(
          "rounded-md bg-muted/50 px-1.5 py-0.5",
          "font-mono text-sm font-medium",
          "text-foreground border border-border/30",
          className
        )}
        {...props}
      >
        {children}
      </code>
    );
  },
  small: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <small
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  ),
  Image,
  Link: ({ className, ...props }: React.ComponentProps<typeof Link>) => (
    <Link
      className={cn(
        "font-medium text-primary no-underline",
        "transition-all duration-200 ease-in-out",
        "hover:text-primary/80 hover:underline hover:underline-offset-4",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
      {...props}
    />
  ),
  LinkedCard: ({ className, ...props }: React.ComponentProps<typeof Link>) => (
    <Link
      className={cn(
        "flex w-full flex-col items-center rounded-xl border border-border/50",
        "bg-card p-6 text-card-foreground shadow-sm",
        "transition-all duration-200 ease-in-out",
        "hover:bg-muted/30 hover:shadow-md hover:border-border",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "sm:p-10",
        className
      )}
      {...props}
    />
  ),
  MDXVideo: ({
    src,
    caption,
    className,
    ...props
  }: React.VideoHTMLAttributes<HTMLVideoElement> & {
    caption?: string;
    src?: string;
  }) => (
    <>
      <video
        className={cn(
          "max-w-[70%] mx-auto rounded-lg border border-border/50",
          "shadow-sm w-full mt-8",
          className
        )}
        loop
        controls
        preload="metadata"
        {...props}
      >
        {src && <source src={src} />}
        您的浏览器不支持视频播放。
      </video>
      {caption && (
        <span className="block mt-3 text-center text-sm text-muted-foreground">
          {caption}
        </span>
      )}
    </>
  ),
};
