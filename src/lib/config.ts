import type { Metadata } from "next";

type SiteConfig = {
  metadata: Metadata;
  author: {
    name: string;
    email: string;
    bio: string;
  };
  /* giscus: {
    repo: string;
    repoId: string;
    categoryId: string;
  }; */
};

export const config: SiteConfig = {
  metadata: {
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL!),
    title: "Sunny's Blogs",
    description: "一个在往全栈发展的前端仔自留地",
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
    bio: "多思考，多实践，多总结",
  },
  /* giscus: {
    repo: "sdrpsps/blog",
    repoId: "R_kgDOHyVOjg",
    categoryId: "DIC_kwDOHyVOjs4CQsH7",
  }, */
};
