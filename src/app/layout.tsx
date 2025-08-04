import Header from "@/components/header";
import { config } from "@/lib/config";

import "./globals.css";

export const metadata = config.metadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="min-w-md">
        <Header />
        {children}
      </body>
    </html>
  );
}
