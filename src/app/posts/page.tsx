import { allPosts } from "content-collections";
import type { Metadata } from "next";
import Link from "next/link";
import count from "word-count";

import { formatDate } from "@/lib/utils";

const PostsPage = () => {
  const posts = allPosts.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      {posts.map((post) => (
        <article key={post.slug}>
          <Link href={`/posts/${post.slug}`}>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold underline underline-offset-4">
                  {post.title}
                </h2>
                <span className="text-sm text-gray-500">
                  {formatDate(post.date)} · {count(post.content)} 字
                </span>
              </div>
              <p className="text-gray-600 line-clamp-2">{post.summary}</p>
            </div>
          </Link>
        </article>
      ))}
    </div>
  );
};

export default PostsPage;

export const metadata: Metadata = {
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL}/posts`,
  },
};
