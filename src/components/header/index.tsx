"use client";

import { GithubIcon } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const Header = () => {
  const pathname = usePathname();
  const isPostsPage = pathname.includes("/posts/");

  return (
    <header className="pt-4">
      <div className="container mx-auto">
        <motion.div
          initial={{ maxWidth: "48rem" }}
          animate={{ maxWidth: isPostsPage ? "72rem" : "48rem" }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className={cn(
            "container mx-auto flex h-16 items-center justify-between md:px-4",
            isPostsPage ? "max-w-4xl xl:max-w-6xl" : "max-w-3xl"
          )}
        >
          <Link href="/" title="Home">
            <Image
              src="/avatar.png"
              alt="logo"
              width={40}
              height={40}
              className="rounded-full"
              priority
            />
          </Link>
          <Link
            href="https://github.com/sdrpsps"
            title="Github"
            target="_blank"
          >
            <GithubIcon />
          </Link>
        </motion.div>
      </div>
    </header>
  );
};

export default Header;
