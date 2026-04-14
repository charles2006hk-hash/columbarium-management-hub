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
  
  // 用來控制預覽視窗
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
        tabletId: formData.tabletId.toUpperCase(),
        amount: Number(formData.amount),
        status: "paid",
        createdAt: serverTimestamp(),
      });
      setIsModalOpen(false);
      setFormData({ customer: "", tabletId: "", amount: "" });
      fetchOrders();
    } catch (err) {
      console.error("建立訂單失敗:", err);
      alert("建立失敗，請檢查權限設定");
    }
  };

  return (
    <div className="space-y-6 relative print:m-0 print:p-0">
      
      {/* 列表頁面 - 列印時隱藏 */}
      <div className="print:hidden space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-stone-900">財務與訂單管理</h1>
            <p className="text-sm text-stone-500 mt-1">管理協議書、檢視結帳紀錄與列印實體合約。</p>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="bg-amber-700 text-white px-4 py-2 rounded-md font-bold hover:bg-amber-800 transition shadow-sm">
            + 手動新增協議書
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-stone-500">訂單載入中...</div>
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
                      <td className="px-6 py-4 text-sm text-stone-600 font-bold">{order.tabletId}</td>
                      <td className="px-6 py-4 text-sm font-bold text-stone-700">${order.amount?.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-bold text-green-800">已結清</span>
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium">
                        <button onClick={() => setPreviewOrder(order)} className="text-amber-700 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-md font-bold transition-colors">
                          📄 預覽協議書
                        </button>
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-stone-500">尚無任何訂單紀錄</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* 合約預覽視窗 (Preview Modal) */}
      {previewOrder && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center overflow-y-auto bg-stone-900/80 pt-10 pb-20 print:bg-white print:pt-0 print:pb-0">
          
          {/* 預覽視窗的操作列 (列印時隱藏) */}
          <div className="w-full max-w-[210mm] flex justify-between items-center mb-6 px-4 print:hidden">
            <h3 className="text-white text-lg font-bold tracking-widest">合約預覽 (A4 尺寸)</h3>
            <div className="flex gap-4">
              <button onClick={() => setPreviewOrder(null)} className="px-6 py-2 bg-stone-600 text-white font-bold rounded-md hover:bg-stone-500 transition shadow-lg">
                返回
              </button>
              <button onClick={() => window.print()} className="px-6 py-2 bg-amber-600 text-white font-bold tracking-widest rounded-md hover:bg-amber-500 transition shadow-lg flex items-center gap-2">
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
      
      {/* 🔴 已修復層級與點擊事件的新增訂單 Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center print:hidden">
          {/* 背景遮罩：加入 onClick 事件關閉視窗 */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)}></div>
          
          {/* 彈出視窗主體：加入 relative z-10 確保在遮罩之上 */}
          <div className="bg-white p-8 rounded-xl w-full max-w-md shadow-2xl relative z-10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-stone-800">手動新增協議書</h2>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-600 text-3xl leading-none">&times;</button>
            </div>
            
            <form onSubmit={handleCreateOrder} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-1">客戶姓名</label>
                <input 
                  required 
                  type="text" 
                  value={formData.customer} 
                  onChange={e => setFormData({...formData, customer: e.target.value})} 
                  className="w-full rounded-md border-stone-300 shadow-sm focus:border-amber-600 focus:ring-amber-600 p-2 border" 
                  placeholder="輸入姓名"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-1">祿位編號</label>
                <input 
                  required 
                  type="text" 
                  value={formData.tabletId} 
                  onChange={e => setFormData({...formData, tabletId: e.target.value})} 
                  className="w-full rounded-md border-stone-300 shadow-sm focus:border-amber-600 focus:ring-amber-600 p-2 border" 
                  placeholder="例如: L1-101"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-1">協議金額 (HKD)</label>
                <input 
                  required 
                  type="number" 
                  value={formData.amount} 
                  onChange={e => setFormData({...formData, amount: e.target.value})} 
                  className="w-full rounded-md border-stone-300 shadow-sm focus:border-amber-600 focus:ring-amber-600 p-2 border" 
                  placeholder="例如: 58000"
                />
              </div>
              
              <div className="flex justify-end gap-3 pt-6 border-t border-stone-100 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 text-stone-600 font-bold hover:bg-stone-100 rounded-md transition-colors">
                  取消
                </button>
                <button type="submit" className="bg-amber-700 text-white px-6 py-2 rounded-md font-bold tracking-widest hover:bg-amber-800 shadow-md transition-colors">
                  儲存訂單
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}