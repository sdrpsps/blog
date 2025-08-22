import { allPosts } from "content-collections";
import type { Metadata } from "next";

import PostCard from "@/components/post-card";
import { config } from "@/lib/config";

export default function Home() {
  const posts = allPosts.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-16 space-y-4">
        <h1 className="text-4xl font-bold text-foreground">
          {config.metadata.title as string}
        </h1>
        <p className="text-md text-muted-foreground">{config.author.bio}</p>
        <p className="text-md text-muted-foreground">{config.metadata.description}</p>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold mb-8 text-foreground">推荐阅读</h2>
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard post={post} key={post.slug} />
          ))}
        </div>
      </div>
    </main>
  );
}

export const metadata: Metadata = {
  alternates: {
    canonical: process.env.NEXT_PUBLIC_APP_URL,
  },
};
