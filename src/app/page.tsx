import { allPosts } from "content-collections";
import Link from "next/link";
import count from "word-count";

import { config } from "@/lib/config";
import { formatDate } from "@/lib/utils";

export default function Home() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-16 space-y-4">
        <h1 className="text-4xl font-bold">
          {config.metadata.title as string}
        </h1>
        <p className="text-md text-gray-600">{config.author.bio}</p>
        <p className="text-md text-gray-600">{config.metadata.description}</p>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold mb-8">推荐阅读</h2>
        <div className="space-y-4">
          {allPosts.map((post) => (
            <article key={post.slug} className="border-b border-gray-200 last:border-b-0 pb-4">
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
      </div>
    </main>
  );
}
