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
          <Image
            src={post.image}
            alt={post.title}
            width={0}
            height={0}
            sizes="100vw"
            className="object-cover rounded h-40 w-full mb-4"
          />
        )}
        <div className="space-y-2">
          <div className="line-clamp-2 text-xl">
            <div className="flex justify-between w-full">
              <span className="underline underline-offset-4 text-foreground">{post.title}</span>
              <span className="text-sm text-muted-foreground">
                {formatDate(post.date)} · {count(post.content)} 字
              </span>
            </div>
          </div>
          <div className="line-clamp-2 text-muted-foreground">{post.summary}</div>
        </div>
      </Link>
    </article>
  );
}
