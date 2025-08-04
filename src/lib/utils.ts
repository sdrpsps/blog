import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function formatDate(date: string) {
  const [year, month, day] = new Date(date)
    .toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    })
    .split("/");

  return `${year}年${month}月${day}日`;
}
