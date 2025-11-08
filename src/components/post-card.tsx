import { Post } from "content-collections";
import Image from "next/image";
import Link from "next/link";
import count from "word-count";

import { formatDate } from "@/lib/utils";

interface PostCardProps {
  post: Post;
  className?: string;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="border-b border-border last:border-b-0 pb-4">
      <Link href={`/posts/${post.slug}`} className="block">
        {post.image && (
          <div className="mb-4 overflow-hidden rounded-lg">
            <Image
              src={post.image}
              alt={post.title}
              width={0}
              height={0}
              sizes="100vw"
              priority
              className="object-cover h-40 w-full"
            />
          </div>
        )}
        <div className="space-y-2">
          <div className="text-xl">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1 w-full">
              <div className="min-w-0">
                <div className="line-clamp-2">
                  <span className="underline underline-offset-4 text-foreground">
                    {post.title}
                  </span>
                </div>
              </div>
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                {formatDate(post.date)} · {count(post.content)} 字
              </span>
            </div>
          </div>
          <div className="line-clamp-2 text-muted-foreground">
            {post.summary}
          </div>
        </div>
      </Link>
    </article>
  );
}
