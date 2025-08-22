"use client";

import Giscus from "@giscus/react";
import { useTheme } from "@/hooks/use-theme";
import { config } from "@/lib/config";

export default function GiscusComments() {
  const { theme, mounted } = useTheme();
  
  // 只在客户端渲染时获取主题
  if (!mounted) {
    return <div className="h-32 animate-pulse bg-secondary/50 rounded" />;
  }
  
  // 根据当前主题设置 Giscus 主题
  const getGiscusTheme = () => {
    if (theme === "dark") return "dark";
    if (theme === "light") return "light";
    // system 模式下根据系统偏好设置
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  };

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
      theme={getGiscusTheme()}
      lang="en"
      loading="lazy"
    />
  );
}
