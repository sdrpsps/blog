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

// 生成标题 ID 的工具函数
export const generateHeadingId = (children: React.ReactNode): string => {
  if (typeof children === "string") {
    return children
      .toLowerCase()
      .replace(/[^\w\s\u4e00-\u9fff-]/g, "") // 只保留：英文数字、空格、中文、连字符
      .replace(/\s+/g, "-") // 空格变连字符
      .replace(/-+/g, "-") // 多个连字符变一个
      .replace(/^-|-$/g, ""); // 去掉首尾连字符
  }
  return "";
};
