import { allPosts } from "content-collections";
import { Metadata } from "next";
import { notFound } from "next/navigation";

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
    title: post.title,
    description: post.summary,
    keywords: post.keywords,
    openGraph: {
      title: post.title,
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

  return <p>{post.title}</p>;
};

export default PostsSlugPage;
