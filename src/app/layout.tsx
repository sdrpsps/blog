import Header from "@/components/header";
import Footer from "@/components/footer";
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
      <body className="flex flex-col min-h-screen min-w-md">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
