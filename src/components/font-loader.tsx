"use client";

import { useEffect } from "react";

export default function FontLoader() {
  useEffect(() => {
    // 添加 DNS 预连接和预连接
    const preconnect = document.createElement("link");
    preconnect.rel = "preconnect";
    preconnect.href = "https://cdn.jsdelivr.net";
    preconnect.crossOrigin = "anonymous";
    document.head.appendChild(preconnect);

    const dnsPrefetch = document.createElement("link");
    dnsPrefetch.rel = "dns-prefetch";
    dnsPrefetch.href = "https://cdn.jsdelivr.net";
    document.head.appendChild(dnsPrefetch);

    // 非阻塞方式加载字体样式表
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdn.jsdelivr.net/npm/lxgw-wenkai-lite-webfont@1.1.0/style.css";
    link.media = "print";
    link.onload = () => {
      if (link.media) {
        link.media = "all";
      }
    };
    document.head.appendChild(link);
  }, []);

  return null;
}
