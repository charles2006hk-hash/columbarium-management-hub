// apps/web/src/app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// 🌟 更新社群分享與 SEO 資訊
export const metadata: Metadata = {
  title: "觀塘地藏王古廟 | 永久祿位安奉與數位追思",
  description: "傳承家族血脈，庇蔭子孫。提供專屬祿位安座、各項法事代辦，首創家屬數位追思門戶，讓思念隨時隨地。立即線上預約參觀。",
  openGraph: {
    title: "觀塘地藏王古廟 | 永久祿位安奉",
    description: "傳承家族血脈，庇蔭子孫。提供專屬祿位安座、各項法事代辦與數位追思門戶。",
    url: "https://你的正式網址.com",
    siteName: "觀塘地藏王古廟",
    images: [
      {
        url: "https://www.transparenttextures.com/patterns/black-scales.png", // 未來可以換成古廟的真實大門照片
        width: 1200,
        height: 630,
        alt: "觀塘地藏王古廟",
      },
    ],
    locale: "zh_HK",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-HK">
      <body className={inter.className}>{children}</body>
    </html>
  );
}