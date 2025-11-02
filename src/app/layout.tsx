import Script from "next/script";

import Footer from "@/components/footer";
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
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <Script id="ld-json-website" type="application/ld+json" strategy="afterInteractive">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: config.metadata.title,
            url: process.env.NEXT_PUBLIC_APP_URL,
            potentialAction: {
              "@type": "SearchAction",
              target: `${process.env.NEXT_PUBLIC_APP_URL}/posts?q={search_term_string}`,
              "query-input": "required name=search_term_string",
            },
          })}
        </Script>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
