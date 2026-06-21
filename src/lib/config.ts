interface Metadata {
  title: string;
  description: string;
  keywords?: string[];
  [key: string]: any;
}

type SiteConfig = {
  metadata: Metadata;
  author: {
    name: string;
    email: string;
    bio: string;
  };
  giscus: {
    repo: string;
    repoId: string;
    categoryId: string;
  };
};

export const config: SiteConfig = {
  metadata: {
    metadataBase: new URL("https://bytespark.me"),
    title: "Sunny's Space",
    description:
      "Sunny Chou 的个人空间。一个静谧的个人树洞与心灵角落，用于记录生活的散页、思绪的涟漪与岁月留痕。",
    keywords: [
      "Sunny Chou",
      "Sunny's Space",
      "个人空间",
      "树洞",
      "随笔",
      "情感回忆",
      "生活记录",
      "散文",
      "手账",
    ],
    openGraph: {
      type: "website",
      locale: "zh-CN",
    },
  },
  author: {
    name: "Sunny Chou",
    email: "sunny@bytespark.me",
    bio: "探寻生活的意义，向阳而生",
  },
  giscus: {
    repo: "sdrpsps/blog",
    repoId: "R_kgDOPX96bw",
    categoryId: "DIC_kwDOPX96b84CuB6x",
  },
};
