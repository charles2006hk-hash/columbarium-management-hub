// apps/admin/src/app/finance/page.tsx
"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, query } from "firebase/firestore";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext"; // 匯入 AuthContext 判斷權限

const firebaseConfig = {
  apiKey: "AIzaSyAdU0mra6pXm4jvpHc3XVc68RMcE_n1Q2I",
  authDomain: "columbarium-hub-2026.firebaseapp.com",
  projectId: "columbarium-hub-2026",
};
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export default function FinancePage() {
  const { user } = useAuth(); // 取得當前使用者狀態與角色
  const [stats, setStats] = useState({ totalRevenue: 0, orderCount: 0, avgOrder: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 若權限不足，直接不執行資料庫查詢 (節省流量與保障安全)
    if (user?.role !== "admin") {
      setLoading(false);
      return;
    }

    async function fetchStats() {
      try {
        const q = query(collection(db, "orders"));
        const snapshot = await getDocs(q);
        const orders = snapshot.docs.map(doc => doc.data());
        
        const total = orders.reduce((sum, order) => sum + (order.amount || 0), 0);
        setStats({
          totalRevenue: total,
          orderCount: orders.length,
          avgOrder: orders.length > 0 ? total / orders.length : 0
        });
      } catch (err) {
        console.error("讀取財務數據失敗", err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchStats();
  }, [user]);

  // 🔴 RBAC 權限攔截畫面
  if (user?.role !== "admin") {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center gap-4 bg-stone-50 rounded-2xl border border-stone-200">
        <span className="text-7xl">🔒</span>
        <h1 className="text-3xl font-bold text-stone-800 mt-4">權限不足</h1>
        <p className="text-stone-500 max-w-md text-center">
          財務報表涉及公司機密營業數據。您目前的帳號身分無法檢視此頁面。<br/>
          如需存取，請聯繫系統管理員調整權限。
        </p>
      </div>
    );
  }

  // 🟢 管理員顯示的正常畫面
  if (loading) return <div className="p-8 text-center text-stone-500">財務數據計算中...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">財務狀況概覽</h1>
        <p className="text-sm text-stone-500 mt-1">即時統計所有已結清訂單與協議書營收。</p>
      </div>

      {/* 數據卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
          <p className="text-sm font-medium text-stone-500">總累積營收 (HKD)</p>
          <p className="text-3xl font-bold text-amber-900 mt-2">${stats.totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
          <p className="text-sm font-medium text-stone-500">總成交訂單數</p>
          <p className="text-3xl font-bold text-stone-800 mt-2">{stats.orderCount} 筆</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
          <p className="text-sm font-medium text-stone-500">平均客單價</p>
          <p className="text-3xl font-bold text-stone-800 mt-2">${Math.round(stats.avgOrder).toLocaleString()}</p>
        </div>
      </div>

      {/* 營收分析圖 (簡易 Tailwind 版) */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-stone-200">
        <h3 className="text-lg font-bold text-stone-800 mb-6">各區銷售佔比 (示意圖表)</h3>
        <div className="flex items-end gap-4 h-56 px-4 pb-2 border-b border-stone-100">
          {[
            { label: '大堂', val: 40, color: 'bg-amber-700' },
            { label: '天區', val: 90, color: 'bg-amber-600' },
            { label: '地區', val: 65, color: 'bg-amber-500' },
            { label: '玄區', val: 30, color: 'bg-amber-400' },
            { label: '宇區', val: 15, color: 'bg-amber-300' },
            { label: '宙區', val: 10, color: 'bg-amber-200' },
          ].map(item => (
            <div key={item.label} className="flex-1 flex flex-col items-center gap-2 group relative">
              {/* 懸停顯示數值 */}
              <div className="opacity-0 group-hover:opacity-100 absolute -top-8 text-xs font-bold bg-stone-800 text-white px-2 py-1 rounded transition-opacity">
                {item.val}%
              </div>
              <div className={`${item.color} w-full max-w-[60px] rounded-t-sm transition-all duration-500 hover:opacity-80`} style={{ height: `${item.val}%` }}></div>
            </div>
          ))}
        </div>
        <div className="flex justify-between px-4 mt-3">
           {['大堂區', '天區', '地區', '玄區', '宇區', '宙區'].map(l => (
             <span key={l} className="flex-1 text-center text-xs font-bold text-stone-500">{l}</span>
           ))}
        </div>
      </div>
    </div>
  );
}