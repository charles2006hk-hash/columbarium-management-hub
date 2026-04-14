// apps/admin/src/components/layout/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@repo/config/firebase";
import { signOut } from "firebase/auth";

const navigation = [
  { name: "儀表板", href: "/" },
  { name: "預約參觀 (Leads)", href: "/leads" },
  { name: "客戶管理 (CRM)", href: "/customers" },
  { name: "祿位總覽 (平面圖)", href: "/tablets" },
  { name: "訂單與協議書", href: "/orders" },
  { name: "法事與服務", href: "/services" },
  { name: "財務報表", href: "/finance" },
  { name: "系統設定", href: "/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <div className="flex h-screen w-64 flex-col border-r border-stone-200 bg-white print:hidden">
      {/* Logo 區域 */}
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-stone-100">
        <h1 className="text-xl font-bold text-amber-800">觀塘地藏王古廟</h1>
      </div>

      {/* 導航選單 */}
      <nav className="flex-1 space-y-1 px-4 py-4 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                isActive
                  ? "bg-amber-50 text-amber-700"
                  : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* 底部使用者資訊與登出 */}
      <div className="border-t border-stone-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 font-bold">
              {user?.email?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="ml-3 truncate">
              <p className="truncate text-sm font-medium text-stone-700">
                {user?.email}
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="mt-4 w-full rounded-md border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 shadow-sm hover:bg-stone-50"
        >
          登出
        </button>
      </div>
    </div>
  );
}