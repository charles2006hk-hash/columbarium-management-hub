// apps/admin/src/app/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";

const firebaseConfig = {
  apiKey: "AIzaSyAdU0mra6pXm4jvpHc3XVc68RMcE_n1Q2I",
  authDomain: "columbarium-hub-2026.firebaseapp.com",
  projectId: "columbarium-hub-2026",
};
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ sold: 0, available: 0, pendingServices: 0 });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        // 1. 抓取近期訂單
        const orderQ = query(collection(db, "orders"), orderBy("createdAt", "desc"), limit(5));
        const orderSnap = await getDocs(orderQ);
        setRecentOrders(orderSnap.docs.map(doc => doc.data()));

        // 2. 抓取待處理法事
        const serviceQ = query(collection(db, "services"), where("status", "==", "pending"));
        const serviceSnap = await getDocs(serviceQ);

        // 3. 簡單模擬整體數量 (真實場景會用 aggregation API 或維持在 metadata)
        setStats({
          sold: 1420, // 示意數據
          available: 8180, // 示意數據
          pendingServices: serviceSnap.size,
        });
      } catch (err) {
        console.error("載入儀表板失敗:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* 歡迎橫幅 (帶有東方莊嚴質感的背景) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-stone-900 to-stone-800 p-8 shadow-xl">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 text-stone-700 opacity-20 text-9xl">🪷</div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-amber-50 font-serif">
            歡迎回來，{user?.role === 'admin' ? '管理員' : '工作人員'}
          </h1>
          <p className="mt-2 text-stone-400 max-w-xl">
            觀塘地藏王古廟祿位管理系統。今天是 {new Intl.DateTimeFormat('zh-HK', { dateStyle: 'full' }).format(new Date())}。
          </p>
        </div>
      </div>

      {/* 核心數據卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 flex items-center justify-between group hover:border-amber-400 transition-colors">
          <div>
            <p className="text-sm font-medium text-stone-500">已售出祿位 (安座)</p>
            <p className="text-3xl font-bold text-stone-800 mt-1">{stats.sold}</p>
          </div>
          <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-700 text-xl group-hover:bg-amber-100 transition-colors">🏛️</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 flex items-center justify-between group hover:border-amber-400 transition-colors">
          <div>
            <p className="text-sm font-medium text-stone-500">可選空位 (虛位以待)</p>
            <p className="text-3xl font-bold text-stone-800 mt-1">{stats.available}</p>
          </div>
          <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-700 text-xl group-hover:bg-green-100 transition-colors">🌿</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 flex items-center justify-between group hover:border-amber-400 transition-colors">
          <div>
            <p className="text-sm font-medium text-stone-500">今日待辦服務/法事</p>
            <p className="text-3xl font-bold text-red-600 mt-1">{loading ? '-' : stats.pendingServices}</p>
          </div>
          <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-600 text-xl group-hover:bg-red-100 transition-colors">🪔</div>
        </div>
      </div>

      {/* 快捷操作與近期動態 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 左側：快速操作入口 */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-lg font-bold text-stone-800 mb-4">系統捷徑</h2>
          <Link href="/tablets" className="flex items-center p-4 bg-white border border-stone-200 rounded-xl hover:shadow-md hover:border-amber-400 transition-all group">
            <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center text-amber-700 mr-4 group-hover:scale-110 transition-transform">🗺️</div>
            <div>
              <h3 className="font-bold text-stone-800">祿位平面總覽</h3>
              <p className="text-xs text-stone-500">查看位置圖與快速登記</p>
            </div>
          </Link>
          <Link href="/services" className="flex items-center p-4 bg-white border border-stone-200 rounded-xl hover:shadow-md hover:border-amber-400 transition-all group">
            <div className="w-10 h-10 bg-stone-100 rounded-lg flex items-center justify-center text-stone-700 mr-4 group-hover:scale-110 transition-transform">📸</div>
            <div>
              <h3 className="font-bold text-stone-800">法事服務執行</h3>
              <p className="text-xs text-stone-500">上傳照片與結案</p>
            </div>
          </Link>
          <Link href="/finance" className="flex items-center p-4 bg-white border border-stone-200 rounded-xl hover:shadow-md hover:border-amber-400 transition-all group">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-green-700 mr-4 group-hover:scale-110 transition-transform">📊</div>
            <div>
              <h3 className="font-bold text-stone-800">財務與報表</h3>
              <p className="text-xs text-stone-500">查閱協議書與總結</p>
            </div>
          </Link>
        </div>

        {/* 右側：近期訂單列表 */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-stone-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-stone-800">近期登記 (安座) 紀錄</h2>
            <Link href="/orders" className="text-sm font-medium text-amber-700 hover:text-amber-800">查看全部 &rarr;</Link>
          </div>
          
          {loading ? (
            <div className="text-center py-10 text-stone-400">載入中...</div>
          ) : (
            <div className="space-y-4">
              {recentOrders.length > 0 ? recentOrders.map((order, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-stone-50 rounded-xl border border-stone-100">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-12 bg-stone-800 rounded flex flex-col items-center justify-center border-2 border-amber-600 shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 w-full h-1 bg-amber-500"></div>
                      <span className="text-amber-500 text-[10px] font-bold mt-1">{order.tabletId}</span>
                    </div>
                    <div>
                      <p className="font-bold text-stone-900">{order.customerName}</p>
                      <p className="text-xs text-stone-500">單號: {order.orderNo}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs font-bold rounded">已結清</span>
                  </div>
                </div>
              )) : (
                <div className="text-center py-10 text-stone-400">尚無近期紀錄</div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}