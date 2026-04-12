import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "\u8ACB\u6C42\u66F8\u30CA\u30D3 | \u30B7\u30F3\u30D7\u30EB\u3067\u7F8E\u3057\u3044\u8ACB\u6C42\u66F8SaaS",
  description: "\u8ACB\u6C42\u66F8\u3092\uFF15\u5206\u3067\u4F5C\u6210\u3002PDF\u81EA\u52D5\u751F\u6210\u3001\u30E1\u30FC\u30EB\u81EA\u52D5\u9001\u4FE1\u3001\u5B9A\u671F\u8ACB\u6C42\u306E\u81EA\u52D5\u5316\u307E\u3067\u3002\u4E2D\u5C0F\u4F01\u696D\u30FB\u30D5\u30EA\u30FC\u30E9\u30F3\u30B9\u306E\u305F\u3081\u306E\u30A4\u30F3\u30DC\u30A4\u30B9\u5236\u5EA6\u5BFE\u5FDC\u8ACB\u6C42\u66F8SaaS\u3002",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
