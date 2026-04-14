// apps/admin/src/components/layout/Sidebar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// 💡 加上 icon，讓縮小狀態時只顯示圖示
const navigation = [
  { name: "總覽儀表板", href: "/", icon: "📊" },
  { name: "預約參觀", href: "/leads", icon: "📞" },
  { name: "祿位總覽", href: "/tablets", icon: "🗺️" },
  { name: "訂單與協議", href: "/orders", icon: "📄" },
  { name: "法事與服務", href: "/services", icon: "🪔" },
  { name: "系統設定", href: "/settings", icon: "⚙️" },
];

export default function Sidebar() {
  const pathname = usePathname();
  // 💡 側邊欄縮放狀態控制
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div 
      className={`${
        isCollapsed ? "w-20" : "w-64"
      } bg-stone-950 min-h-screen flex flex-col text-stone-300 print:hidden z-50 transition-all duration-300 ease-in-out relative shrink-0`}
    >
      {/* 🌟 縮放控制按鈕 (懸浮在右側邊緣) */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 bg-stone-800 text-stone-300 hover:text-amber-500 rounded-full w-6 h-6 flex items-center justify-center border border-stone-600 shadow-md z-50 transition-colors"
        title={isCollapsed ? "展開選單" : "收起選單"}
      >
        {isCollapsed ? "❯" : "❮"}
      </button>

      {/* 頂部 Logo 區塊 */}
      <div className={`h-16 flex items-center border-b border-stone-800 transition-all duration-300 ${isCollapsed ? "justify-center px-0" : "px-6"}`}>
        <h1 className="text-amber-500 font-serif font-bold tracking-widest flex items-center gap-2 overflow-hidden whitespace-nowrap">
          <span className="text-xl">🪷</span> 
          {!isCollapsed && <span>觀塘地藏王古廟</span>}
        </h1>
      </div>
      
      {/* 導航選單 */}
      <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto overflow-x-hidden">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              title={isCollapsed ? item.name : ""} // 縮小時提供 Hover 提示文字
              className={`flex items-center rounded-lg text-sm font-medium transition-all duration-200 ${
                isCollapsed ? "justify-center py-3" : "px-3 py-3 gap-3"
              } ${
                isActive 
                  ? "bg-amber-900/40 text-amber-500 border border-amber-900/50 shadow-inner" 
                  : "hover:bg-stone-900 hover:text-white border border-transparent"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {/* 確保文字在縮放過程中不會折行跑版 */}
              <span className={`whitespace-nowrap transition-opacity duration-200 ${isCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100'}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* 底部版權與彩蛋 */}
      <div className={`p-4 border-t border-stone-800 text-xs text-stone-600 flex ${isCollapsed ? "justify-center" : "justify-between items-center"} overflow-hidden whitespace-nowrap`}>
        {!isCollapsed && <span>© 2026 數位系統</span>}
        
        {/* 🌟 隱藏彩蛋：點擊進入推演室 */}
        <Link href="/boss-only" className="hover:text-amber-700 transition-colors cursor-default" title="進入推演室">
          v1.0
        </Link>
      </div>
    </div>
  );
}