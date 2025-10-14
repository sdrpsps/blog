import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="relative flex min-h-[60vh] items-center justify-center overflow-hidden px-6 py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-br from-primary/15 via-sky-500/10 to-transparent blur-3xl" aria-hidden />
        <div
          className="absolute bottom-[-8rem] right-[-6rem] h-96 w-96 rounded-full bg-gradient-to-tr from-rose-400/20 via-primary/25 to-transparent blur-3xl dark:from-rose-500/30 dark:via-primary/30"
          aria-hidden
        />
        <div
          className="absolute left-[-10rem] top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-gradient-to-br from-teal-400/20 via-primary/20 to-transparent blur-3xl"
          aria-hidden
        />
      </div>

      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-8 rounded-2xl border border-border/50 bg-card/70 p-10 text-center shadow-lg backdrop-blur">
        <span className="rounded-full border border-border/60 bg-secondary/60 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          404 · 未找到内容
        </span>

        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            这里好像是一片星空，暂时还没有故事
          </h1>
          <p className="text-base text-muted-foreground sm:text-lg">
            也许你输入了一个已经更换的链接，或者我还没有写完这篇文章。
            不如回到主页继续探索吧。
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/">
              回到首页
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/posts">
              查看所有文章
            </Link>
          </Button>
        </div>

        <p className="text-xs text-muted-foreground/80">
          如果你确信这个链接应该存在，欢迎给我留言告诉我。
        </p>
      </div>
    </div>
  );
}

