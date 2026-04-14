// apps/admin/src/app/layout.tsx
"use client"; // 改為 Client Component 以使用 usePathname

import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Sidebar from "@/components/layout/Sidebar";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

// 注意：Client Component 不能匯出 metadata。
// 若需要 metadata，通常會拆分成 Client/Server 組件結構，但初期開發這樣最簡單。

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <html lang="zh-HK">
      <body className={inter.className}>
        <AuthProvider>
          {isLoginPage ? (
            // 登入頁面不顯示 Sidebar
            children
          ) : (
            // 內部系統的版面配置
            <div className="flex h-screen overflow-hidden bg-stone-50">
              <Sidebar />
              {/* 主內容區塊 */}
              <main className="flex-1 overflow-y-auto p-8">
                {children}
              </main>
            </div>
          )}
        </AuthProvider>
      </body>
    </html>
  );
}