"use client";

import { GithubIcon } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import ThemeToggle from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Header = () => {
  const pathname = usePathname();
  const isPostsPage = pathname.includes("/posts/");

  return (
    <header className="px-4 pt-4">
      <motion.div
        initial={{ maxWidth: "48rem" }}
        animate={{ maxWidth: isPostsPage ? "72rem" : "48rem" }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className={cn(
          "mx-auto flex h-16 items-center justify-between md:px-4",
          isPostsPage ? "max-w-4xl xl:max-w-6xl" : "max-w-3xl"
        )}
      >
          <Link href="/" title="Home">
            <Image
              src="/avatar.png"
              alt="logo"
              width={40}
              height={40}
              priority
              className="rounded-full"
            />
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon" asChild>
              <Link
                href="https://github.com/sdrpsps"
                title="Github"
                target="_blank"
              >
                <GithubIcon className="w-5 h-5" />
              </Link>
            </Button>
          </div>
      </motion.div>
    </header>
  );
};

export default Header;
