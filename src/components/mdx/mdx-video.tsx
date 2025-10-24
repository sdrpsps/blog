import * as React from "react";

import { cn } from "@/lib/utils";

export interface MDXVideoProps
  extends React.VideoHTMLAttributes<HTMLVideoElement> {
  caption?: string;
}

export function MDXVideo({
  src,
  caption,
  className,
  children,
  ...props
}: MDXVideoProps) {
  const resolvedSrc = typeof src === "string" ? src : undefined;
  const shouldRenderSource =
    Boolean(resolvedSrc) && React.Children.count(children) === 0;

  return (
    <>
      <video
        className={cn(
          "max-w-[70%] mx-auto rounded-lg border border-border/50",
          "shadow-sm w-full mt-8",
          className
        )}
        src={resolvedSrc}
        loop
        controls
        preload="metadata"
        {...props}
      >
        {shouldRenderSource ? <source src={resolvedSrc!} /> : null}
        {children ?? "Your browser does not support video playback."}
      </video>
      {caption && (
        <span className="block mt-3 text-center text-sm text-muted-foreground">
          {caption}
        </span>
      )}
    </>
  );
}
