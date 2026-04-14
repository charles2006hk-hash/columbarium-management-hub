// apps/admin/src/app/customers/page.tsx
"use client";

import { useState, useEffect } from "react";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
// 繼續沿用開發環境的強制連線設定
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAdU0mra6pXm4jvpHc3XVc68RMcE_n1Q2I",
  authDomain: "columbarium-hub-2026.firebaseapp.com",
  projectId: "columbarium-hub-2026",
};
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // 編輯功能的狀態
  const [editingCustomer, setEditingCustomer] = useState<any>(null);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");

  // 抓取資料函式 (獨立出來方便更新後重新呼叫)
  const fetchCustomers = async () => {
    setLoading(true);
    try {
      // 抓取所有狀態為 "sold" (已售出) 的祿位
      const q = query(
        collection(db, "tablets"),
        where("status", "==", "sold")
      );
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({
        dbId: doc.id, // 保留 Firestore 文件的真實 ID 以便後續更新
        ...doc.data(),
      }));
      
      // 根據登記時間排序 (最新的在最上面)
      const sortedData = data.sort((a: any, b: any) => {
        const timeA = a.soldAt?.toMillis?.() || a.soldAt?.getTime?.() || 0;
        const timeB = b.soldAt?.toMillis?.() || b.soldAt?.getTime?.() || 0;
        return timeB - timeA;
      });

      setCustomers(sortedData);
    } catch (err) {
      console.error("讀取客戶資料失敗:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // 點擊「編輯」按鈕，打開 Modal 並載入當前資料
  const handleEdit = (customer: any) => {
    setEditingCustomer(customer);
    setNewName(customer.ownerName || "");
    setNewPhone(customer.ownerPhone || "");
  };

  // 提交修改到 Firebase
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCustomer) return;

    try {
      // 更新 Firestore 中該祿位的客戶資訊
      const tabletRef = doc(db, "tablets", editingCustomer.dbId);
      await updateDoc(tabletRef, {
        ownerName: newName,
        ownerPhone: newPhone
      });

      alert("客戶資料已成功更新！");
      setEditingCustomer(null); // 關閉 Modal
      fetchCustomers(); // 重新抓取資料，讓畫面即時更新
    } catch (err) {
      console.error("更新失敗:", err);
      alert("更新失敗，請檢查網路或權限設定");
    }
  };

  // 搜尋過濾功能
  const filteredCustomers = customers.filter(c => 
    c.ownerName?.includes(searchTerm) || 
    c.ownerPhone?.includes(searchTerm) ||
    c.id?.includes(searchTerm)
  );

  return (
    <div className="space-y-6 relative">
      {/* 標題與搜尋列 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-stone-900">客戶管理 (CRM)</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="搜尋姓名、電話或編號..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-72 rounded-md border-stone-300 py-2 pl-3 pr-10 text-sm focus:border-amber-500 focus:outline-none focus:ring-amber-500 shadow-sm"
          />
          <span className="absolute right-3 top-2.5 text-stone-400">🔍</span>
        </div>
      </div>

      {/* 客戶資料表格 */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-stone-200">
        {loading ? (
          <div className="p-10 text-center text-stone-500">資料載入中...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-stone-200">
              <thead className="bg-stone-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">客戶姓名</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">聯絡電話</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">持有祿位</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">區域/區段</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">登記日期</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-stone-600 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 bg-white">
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer) => (
                    <tr key={customer.dbId} className="hover:bg-stone-50 transition-colors">
                      <td className="whitespace-nowrap px-6 py-4 font-bold text-stone-900">
                        {customer.ownerName || "未填寫"}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-stone-600">
                        {customer.ownerPhone || "無"}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-1 text-xs font-bold text-amber-700 ring-1 ring-inset ring-amber-600/20">
                          {customer.id}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-stone-600 text-sm">
                        {customer.zone} - {customer.block}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-stone-500 text-sm">
                        {customer.soldAt ? new Date(customer.soldAt.toDate ? customer.soldAt.toDate() : customer.soldAt).toLocaleDateString('zh-HK') : '未知'}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                        <button 
                          onClick={() => handleEdit(customer)}
                          className="text-amber-700 hover:text-amber-900 bg-amber-50 px-3 py-1 rounded-md transition-colors"
                        >
                          ✎ 編輯
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-stone-500">
                      目前沒有找到符合的客戶資料
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ===== 編輯客戶資料 Modal ===== */}
      {editingCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-xl w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-stone-800">編輯客戶資料</h2>
              <button onClick={() => setEditingCustomer(null)} className="text-stone-400 hover:text-stone-600 text-2xl">&times;</button>
            </div>
            
            <p className="text-sm text-stone-500 mb-4 pb-4 border-b border-stone-100">
              目前正在編輯祿位編號：<strong className="text-amber-700">{editingCustomer.id}</strong> 的持有人。
            </p>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700">客戶姓名</label>
                <input 
                  type="text" 
                  required
                  value={newName} 
                  onChange={e => setNewName(e.target.value)} 
                  className="mt-1 w-full rounded-md border-stone-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700">聯絡電話</label>
                <input 
                  type="tel" 
                  value={newPhone} 
                  onChange={e => setNewPhone(e.target.value)} 
                  className="mt-1 w-full rounded-md border-stone-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                />
              </div>
              <div className="flex justify-end gap-3 mt-8 pt-4">
                <button 
                  type="button" 
                  onClick={() => setEditingCustomer(null)} 
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-md font-medium"
                >
                  取消
                </button>
                <button 
                  type="submit" 
                  className="bg-amber-700 text-white px-6 py-2 rounded-md font-bold hover:bg-amber-800 shadow-md"
                >
                  儲存修改
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}