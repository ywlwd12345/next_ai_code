import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SKU/SPU 管理平台",
  description: "基于 Next.js 的高质量 SKU/SPU 示例项目"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
