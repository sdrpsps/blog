import type { Metadata } from "next";

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
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL!),
    title: "Sunny's Blog",
    description: "一个树洞",
    keywords: [
      "Blog",
      "Next.js",
      "React",
      "Vue",
      "TypeScript",
      "JavaScript",
      "Frontend",
      "Backend",
      "Fullstack",
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
