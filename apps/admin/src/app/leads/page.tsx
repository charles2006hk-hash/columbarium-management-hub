// apps/admin/src/app/leads/page.tsx
"use client";

import { useState, useEffect } from "react";
import { collection, query, getDocs, updateDoc, doc, orderBy } from "firebase/firestore";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase 初始化設定
const firebaseConfig = {
  apiKey: "AIzaSyAdU0mra6pXm4jvpHc3XVc68RMcE_n1Q2I",
  authDomain: "columbarium-hub-2026.firebaseapp.com",
  projectId: "columbarium-hub-2026",
};
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export default function LeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 讀取預約名單
  const fetchLeads = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "leads"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      setLeads(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error("讀取預約失敗:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // 更新預約狀態
  const handleStatusChange = async (leadId: string, newStatus: string) => {
    try {
      const leadRef = doc(db, "leads", leadId);
      await updateDoc(leadRef, { status: newStatus });
      
      // 更新本地狀態，不需重新整理畫面
      setLeads(prev => prev.map(lead => 
        lead.id === leadId ? { ...lead, status: newStatus } : lead
      ));
    } catch (err) {
      console.error("更新狀態失敗:", err);
      alert("更新失敗，請檢查權限");
    }
  };

  // 狀態對應的標籤顏色與文字
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new': return <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold">新預約 (未處理)</span>;
      case 'contacted': return <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">已聯絡確認</span>;
      case 'visited': return <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-xs font-bold">已來訪參觀</span>;
      case 'closed': return <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">成功轉單 (安座)</span>;
      case 'cancelled': return <span className="bg-stone-100 text-stone-500 px-2 py-1 rounded text-xs font-bold">已取消/無效</span>;
      default: return <span className="bg-stone-100 text-stone-700 px-2 py-1 rounded text-xs font-bold">未知狀態</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">預約參觀管理 (Leads)</h1>
        <p className="text-sm text-stone-500 mt-1">追蹤來自前台網站的訪客預約，並更新聯絡進度。</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-stone-500">載入名單中...</div>
        ) : (
          <table className="min-w-full divide-y divide-stone-200">
            <thead className="bg-stone-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-stone-600 uppercase">提交時間</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-stone-600 uppercase">訪客姓名</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-stone-600 uppercase">聯絡電話</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-stone-600 uppercase">希望參觀日</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-stone-600 uppercase">處理狀態</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-stone-600 uppercase">變更狀態</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-stone-500">
                    {lead.createdAt?.toDate ? new Date(lead.createdAt.toDate()).toLocaleDateString('zh-HK') : '未知'}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-stone-900">{lead.name}</td>
                  <td className="px-6 py-4 text-sm text-stone-600 font-mono">{lead.phone}</td>
                  <td className="px-6 py-4 text-sm font-bold text-amber-700">{lead.date}</td>
                  <td className="px-6 py-4">
                    {getStatusBadge(lead.status)}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <select 
                      value={lead.status || 'new'}
                      onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                      className="border-stone-300 rounded-md text-sm shadow-sm focus:border-amber-500 py-1 pl-2 pr-8"
                    >
                      <option value="new">標記為：新預約</option>
                      <option value="contacted">標記為：已聯絡</option>
                      <option value="visited">標記為：已參觀</option>
                      <option value="closed">標記為：成功轉單</option>
                      <option value="cancelled">標記為：已取消</option>
                    </select>
                  </td>
                </tr>
              ))}
              {leads.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-stone-500">
                    目前尚無預約參觀紀錄。
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}