"use client";

import { ArrowUpIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

export function GoTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 800) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      aria-label="Go to top"
      onClick={scrollToTop}
      className={cn(
        "rounded-full p-3 w-min",
        "bg-gray-100/50 backdrop-blur-sm",
        "hover:bg-white transition-all duration-300 cursor-pointer",
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none",
        "md:right-16"
      )}
    >
      <ArrowUpIcon className="w-4 h-4" />
    </button>
  );
}
