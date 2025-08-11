"use client";

import Giscus from "@giscus/react";
import { config } from "@/lib/config";

export default function GiscusComments() {
  return (
    <Giscus
      id="comments"
      repo={config.giscus.repo as `${string}/${string}`}
      repoId={config.giscus.repoId}
      category="Announcements"
      categoryId={config.giscus.categoryId}
      mapping="pathname"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="top"
      theme="light"
      lang="en"
      loading="lazy"
    />
  );
}
