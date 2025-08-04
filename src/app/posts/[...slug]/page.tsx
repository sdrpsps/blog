import { allPosts } from "content-collections";
import "highlight.js/styles/github-dark.min.css";
import { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote-client/rsc";
import { notFound } from "next/navigation";
import count from "word-count";

import { GoTop } from "@/components/go-top";
import { mdxComponents } from "@/components/mdx-components";
import { TableOfContents } from "@/components/table-of-contents";
import { mdxOptions } from "@/lib/mdx-options";
import { formatDate } from "@/lib/utils";
import { getTableOfContents } from "@/lib/toc";
import { config } from "@/lib/config";

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
    openGraph: {
      title: `${post.title} | ${config.metadata.title as string}`,
      description: post.summary,
      type: "article",
      url: `${process.env.NEXT_PUBLIC_APP_URL}/posts/${post.slug}`,
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

  const toc = await getTableOfContents(post.content);

  return (
    <div className="relative py-6 max-w-full md:max-w-6xl mx-auto lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_300px]">
      <div className="max-w-4xl mx-auto w-full px-6">
        <div className="my-8">
          <h1 className="text-3xl font-bold">{post.title}</h1>
        </div>
        <div className="my-4">
          <p className="text-sm text-gray-500">
            {formatDate(post.date)} · {count(post.content)} 字
          </p>
        </div>

        <main>
          <MDXRemote
            source={post.content}
            components={mdxComponents}
            options={mdxOptions}
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
    </div>
  );
};

export default PostsSlugPage;
