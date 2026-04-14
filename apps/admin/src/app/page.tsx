// apps/admin/src/app/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase 初始化
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
};
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    soldTablets: 0,
    availableTablets: 9600, // 假設全廟總容量為 9600
    totalRevenue: 0,
    newLeadsCount: 0
  });
  
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [recentLeads, setRecentLeads] = useState<any[]>([]);

  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true);
      try {
        // 1. 抓取已售出祿位數量
        const tabletsQ = query(collection(db, "tablets"), where("status", "==", "sold"));
        const tabletsSnap = await getDocs(tabletsQ);
        const soldCount = tabletsSnap.size;

        // 2. 抓取總營業額
        const ordersQ = query(collection(db, "orders"));
        const ordersSnap = await getDocs(ordersQ);
        let revenue = 0;
        const ordersData: any[] = [];
        ordersSnap.forEach(doc => {
          const data = doc.data();
          revenue += Number(data.amount || 0);
          ordersData.push({ id: doc.id, ...data });
        });
        
        // 排序最新訂單 (取前 5 筆)
        const sortedOrders = ordersData.sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis()).slice(0, 5);

        // 3. 抓取未處理的預約參觀 (Leads)
        const leadsQ = query(collection(db, "leads"), where("status", "==", "new"));
        const leadsSnap = await getDocs(leadsQ);
        const newLeadsCount = leadsSnap.size;
        
        // 抓取最新預約名單
        const recentLeadsQ = query(collection(db, "leads"), orderBy("createdAt", "desc"), limit(5));
        const recentLeadsSnap = await getDocs(recentLeadsQ);
        const leadsData = recentLeadsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // 更新狀態
        setStats({
          soldTablets: soldCount,
          availableTablets: 9600 - soldCount,
          totalRevenue: revenue,
          newLeadsCount: newLeadsCount
        });
        setRecentOrders(sortedOrders);
        setRecentLeads(leadsData);

      } catch (err) {
        console.error("載入儀表板數據失敗:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="p-20 text-center text-stone-500 font-medium animate-pulse">數據即時運算中...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">總覽儀表板</h1>
          <p className="text-sm text-stone-500 mt-1">歡迎回來，這裡是觀塘地藏王古廟的營運數據中心。</p>
        </div>
      </div>

      {/* 數據卡片區 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200 border-l-4 border-l-amber-600">
          <p className="text-sm font-medium text-stone-500">已售出祿位 (安座)</p>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-3xl font-bold text-stone-900">{stats.soldTablets}</p>
            <p className="text-sm text-stone-500">座</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
          <p className="text-sm font-medium text-stone-500">可選空位 (虛位以待)</p>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-3xl font-bold text-stone-900">{stats.availableTablets}</p>
            <p className="text-sm text-stone-500">座</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
          <p className="text-sm font-medium text-stone-500">新預約參觀 (未處理)</p>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-3xl font-bold text-red-600">{stats.newLeadsCount}</p>
            <p className="text-sm text-stone-500">組</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
          <p className="text-sm font-medium text-stone-500">累計協議總額 (HKD)</p>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-3xl font-bold text-stone-900">${stats.totalRevenue.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* 系統捷徑與近期動態 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
        
        {/* 左側：捷徑與近期預約 */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
            <h3 className="text-lg font-bold text-stone-800 mb-4">系統捷徑</h3>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/tablets" className="flex items-center justify-center p-3 bg-stone-50 hover:bg-amber-50 text-stone-700 hover:text-amber-800 rounded-lg border border-stone-200 transition-colors text-sm font-bold">
                🗺️ 平面圖選位
              </Link>
              <Link href="/orders" className="flex items-center justify-center p-3 bg-stone-50 hover:bg-amber-50 text-stone-700 hover:text-amber-800 rounded-lg border border-stone-200 transition-colors text-sm font-bold">
                📄 新增協議書
              </Link>
              <Link href="/services" className="flex items-center justify-center p-3 bg-stone-50 hover:bg-amber-50 text-stone-700 hover:text-amber-800 rounded-lg border border-stone-200 transition-colors text-sm font-bold">
                🪔 派發法事
              </Link>
              <Link href="/leads" className="flex items-center justify-center p-3 bg-stone-50 hover:bg-amber-50 text-stone-700 hover:text-amber-800 rounded-lg border border-stone-200 transition-colors text-sm font-bold">
                📞 聯絡名單
              </Link>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-stone-800">最新預約名單</h3>
              <Link href="/leads" className="text-xs text-amber-600 font-bold hover:underline">查看全部</Link>
            </div>
            <div className="space-y-4">
              {recentLeads.length > 0 ? recentLeads.map((lead) => (
                <div key={lead.id} className="flex justify-between items-center border-b border-stone-100 pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="text-sm font-bold text-stone-800">{lead.name}</p>
                    <p className="text-xs text-stone-500">{lead.phone}</p>
                  </div>
                  <span className={`text-[10px] px-2 py-1 rounded font-bold ${lead.status === 'new' ? 'bg-red-100 text-red-700' : 'bg-stone-100 text-stone-600'}`}>
                    {lead.status === 'new' ? '未聯絡' : '已處理'}
                  </span>
                </div>
              )) : <p className="text-sm text-stone-400 text-center py-4">尚無近期預約</p>}
            </div>
          </div>
        </div>

        {/* 右側：近期登記紀錄 */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-stone-200 flex flex-col">
          <div className="px-6 py-5 border-b border-stone-200 flex justify-between items-center bg-stone-50 rounded-t-xl">
            <h3 className="text-lg font-bold text-stone-800">近期登記 (協議書) 紀錄</h3>
            <Link href="/orders" className="text-sm text-amber-700 hover:text-amber-800 font-bold">完整財務報表 ➝</Link>
          </div>
          <div className="p-0 overflow-x-auto">
            <table className="min-w-full divide-y divide-stone-200">
              <thead className="bg-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-stone-500 uppercase">單號</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-stone-500 uppercase">祿位</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-stone-500 uppercase">客戶</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-stone-500 uppercase">金額</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 bg-white">
                {recentOrders.length > 0 ? recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-stone-50">
                    <td className="px-6 py-4 text-sm text-stone-500 font-mono">{order.orderNo || order.id}</td>
                    <td className="px-6 py-4 text-sm font-bold text-amber-900">{order.tabletId}</td>
                    <td className="px-6 py-4 text-sm font-bold text-stone-800">{order.customerName}</td>
                    <td className="px-6 py-4 text-sm font-bold text-stone-700 text-right">${order.amount?.toLocaleString()}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-stone-500">尚無訂單紀錄</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}