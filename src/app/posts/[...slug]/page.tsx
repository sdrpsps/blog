import { allPosts } from "content-collections";
import "highlight.js/styles/github-dark.min.css";
import { Root } from "mdast";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Script from "next/script";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkMdx from "remark-mdx";
import { SafeMdxRenderer } from "safe-mdx";
import count from "word-count";

import GiscusComments from "@/components/giscus-comments";
import { GoTop } from "@/components/go-top";
import { mdxComponents } from "@/components/mdx/mdx-components";
import { TableOfContents } from "@/components/table-of-contents";
import { config } from "@/lib/config";
import { getTableOfContents } from "@/lib/toc";
import { formatDate } from "@/lib/utils";

interface PostsSlugPageProps {
  params: Promise<{ slug: string[] }>;
}

const getPostBySlug = async (slug: string) => {
  const post = allPosts.find((post) => post.slug === slug);

  if (!post) {
    notFound();
  }

  return post;
};

export async function generateMetadata({
  params,
}: PostsSlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug.join("/"));

  return {
    title: `${post.title} | ${config.metadata.title as string}`,
    description: post.summary,
    keywords: post.keywords,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_APP_URL}/posts/${post.slug}`,
    },
    openGraph: {
      title: `${post.title} | ${config.metadata.title as string}`,
      description: post.summary,
      type: "article",
      url: `${process.env.NEXT_PUBLIC_APP_URL}/posts/${post.slug}`,
      images: [post.image || ""],
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} | ${config.metadata.title as string}`,
      description: post.summary,
      images: [post.image || ""],
    },
  };
}

export async function generateStaticParams() {
  return allPosts.map((post) => ({
    slug: post.slug.split("/"),
  }));
}

const PostsSlugPage = async ({ params }: PostsSlugPageProps) => {
  const { slug } = await params;
  const post = await getPostBySlug(slug.join("/"));

  const parser = remark()
    .use(remarkMdx)
    .use(remarkGfm)
    .use(remarkMath)
    .use(() => {
      return (tree, file) => {
        file.data.ast = tree;
      };
    });

  const file = parser.processSync(post.content);
  const mdast = file.data.ast as Root;

  const toc = await getTableOfContents(post.content);

  return (
    <div className="relative py-6 max-w-full md:max-w-6xl mx-auto lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_300px]">
      <div className="max-w-4xl mx-auto w-full px-6">
        <div className="my-8">
          <h1 className="text-3xl font-bold">{post.title}</h1>
        </div>
        <div className="sr-only">
          <Link href={`/posts/${post.slug}`}>Canonical</Link>
        </div>
        <Script id="ld-json-article" type="application/ld+json" strategy="afterInteractive">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: post.summary,
            image: post.image ? [post.image] : undefined,
            author: {
              "@type": "Person",
              name: config.author.name,
              email: config.author.email,
            },
            datePublished: post.date,
            dateModified: post.updated || post.date,
            mainEntityOfPage: `${process.env.NEXT_PUBLIC_APP_URL}/posts/${post.slug}`,
          })}
        </Script>
        <Script id="ld-json-breadcrumb" type="application/ld+json" strategy="afterInteractive">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "首页",
                item: process.env.NEXT_PUBLIC_APP_URL,
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "文章",
                item: `${process.env.NEXT_PUBLIC_APP_URL}/posts`,
              },
              {
                "@type": "ListItem",
                position: 3,
                name: post.title,
                item: `${process.env.NEXT_PUBLIC_APP_URL}/posts/${post.slug}`,
              },
            ],
          })}
        </Script>
        <div className="my-4">
          <p className="text-sm text-gray-500">
            {formatDate(post.date)} · {count(post.content)} 字
          </p>
        </div>

        <main>
          <SafeMdxRenderer
            markdown={post.content}
            mdast={mdast}
            components={mdxComponents}
          />
        </main>
      </div>
      <div className="hidden text-sm xl:block">
        <div className="sticky top-16 -mt-6 h-[calc(100vh-3.5rem)]">
          <div className="h-full overflow-auto pb-10 flex flex-col justify-between mt-16 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
            <TableOfContents toc={toc} />
            <GoTop />
          </div>
        </div>
      </div>
      <GiscusComments />
    </div>
  );
};

export default PostsSlugPage;
