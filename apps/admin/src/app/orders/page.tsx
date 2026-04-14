// apps/admin/src/app/orders/page.tsx
"use client";

import { useState, useEffect } from "react";
import { collection, addDoc, getDocs, serverTimestamp, orderBy, query } from "firebase/firestore";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import ContractPrintView from "./ContractPrintView";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
};
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // 改名為 previewOrder，用來控制預覽視窗
  const [previewOrder, setPreviewOrder] = useState<any>(null);

  const [formData, setFormData] = useState({ customer: "", tabletId: "", amount: "" });

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error("讀取失敗:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "orders"), {
        orderNo: `ORD-${Date.now()}`,
        customerName: formData.customer,
        tabletId: formData.tabletId,
        amount: Number(formData.amount),
        status: "paid",
        createdAt: serverTimestamp(),
      });
      setIsModalOpen(false);
      setFormData({ customer: "", tabletId: "", amount: "" });
      fetchOrders();
    } catch (err) {
      console.error("建立訂單失敗:", err);
    }
  };

  return (
    <div className="space-y-6 relative print:m-0 print:p-0">
      
      {/* 列表頁面 - 列印時隱藏 */}
      <div className="print:hidden space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-stone-900">財務與訂單管理</h1>
          <button onClick={() => setIsModalOpen(true)} className="bg-amber-700 text-white px-4 py-2 rounded-md font-medium hover:bg-amber-800 transition shadow-sm">
            + 手動新增協議書
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-stone-500">訂單載入中...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-stone-200">
                <thead className="bg-stone-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-stone-600">訂單編號</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-stone-600">客戶姓名</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-stone-600">祿位編號</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-stone-600">金額 (HKD)</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-stone-600">狀態</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-stone-600">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-stone-50">
                      <td className="px-6 py-4 text-sm font-medium text-stone-500">{order.orderNo || order.id}</td>
                      <td className="px-6 py-4 text-sm font-bold text-stone-900">{order.customerName}</td>
                      <td className="px-6 py-4 text-sm text-stone-600">{order.tabletId}</td>
                      <td className="px-6 py-4 text-sm font-bold text-stone-700">${order.amount?.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">已結清</span>
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium">
                        {/* 改為設定 previewOrder，開啟預覽視窗 */}
                        <button onClick={() => setPreviewOrder(order)} className="text-amber-700 hover:text-amber-900 bg-amber-50 px-3 py-1 rounded-md">
                          📄 預覽協議書
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* 合約預覽視窗 (Preview Modal) */}
      {previewOrder && (
        <div className="fixed inset-0 z-50 flex flex-col items-center overflow-y-auto bg-stone-900/80 pt-10 pb-20 print:bg-white print:pt-0 print:pb-0">
          
          {/* 預覽視窗的操作列 (列印時隱藏) */}
          <div className="w-full max-w-[210mm] flex justify-between items-center mb-6 px-4 print:hidden">
            <h3 className="text-white text-lg font-bold">合約預覽 (A4 尺寸)</h3>
            <div className="flex gap-4">
              <button onClick={() => setPreviewOrder(null)} className="px-6 py-2 bg-stone-600 text-white rounded-md hover:bg-stone-500 transition shadow-lg">
                返回
              </button>
              <button onClick={() => window.print()} className="px-6 py-2 bg-amber-600 text-white font-bold rounded-md hover:bg-amber-500 transition shadow-lg flex items-center gap-2">
                🖨️ 輸出為 PDF / 列印
              </button>
            </div>
          </div>

          {/* 實際的合約紙張 */}
          <div className="px-4 print:px-0 w-full max-w-[210mm]">
            <ContractPrintView order={previewOrder} />
          </div>

        </div>
      )}
      
      {/* 新增訂單 Modal ... (保持不變，為了縮減版面這裡省略) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm print:hidden">
          {/* ... (原本的新增訂單表單) ... */}
        </div>
      )}

    </div>
  );
}