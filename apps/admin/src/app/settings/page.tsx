// apps/admin/src/app/settings/page.tsx
"use client";

import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
};
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export default function SettingsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  // 1. 員工權限名單 (模擬數據)
  const [staffList] = useState([
    { id: 1, name: "系統管理員 (Admin)", email: "admin@dev-mode.com", role: "admin", status: "active" },
    { id: 2, name: "前台客服 (Staff)", email: "staff@test.com", role: "staff", status: "active" },
    { id: 3, name: "法事師傅 (Master)", email: "master@test.com", role: "staff", status: "inactive" },
  ]);

  // 2. 6 大區域定價
  const [prices, setPrices] = useState({ 大堂區: 58000, 天區: 88000, 地區: 68000, 玄區: 78000, 宇區: 48000, 宙區: 38000 });
  
  // 3. 動態服務項目列表
  const [serviceTypes, setServiceTypes] = useState<string[]>([]);
  const [newService, setNewService] = useState("");

  useEffect(() => {
    async function loadSettings() {
      if (user?.role !== "admin") return;
      try {
        const snap = await getDoc(doc(db, "settings", "general"));
        if (snap.exists()) {
          const data = snap.data();
          if (data.prices) setPrices(data.prices);
          if (data.serviceTypes) setServiceTypes(data.serviceTypes);
        } else {
          // 預設資料
          setServiceTypes(["初一十五供奉", "週年法事", "百日追思", "清明祭祀", "重陽秋祭"]);
        }
      } catch (err) { console.error("讀取設定失敗"); }
      setLoading(false);
    }
    loadSettings();
  }, [user]);

  const handleSaveSettings = async () => {
    try {
      await setDoc(doc(db, "settings", "general"), { prices, serviceTypes }, { merge: true });
      alert("✅ 系統設定儲存成功！");
    } catch (err) { alert("儲存失敗"); }
  };

  // 排序與刪除服務項目
  const moveService = (index: number, direction: number) => {
    const newTypes = [...serviceTypes];
    if (index + direction < 0 || index + direction >= newTypes.length) return;
    const temp = newTypes[index];
    newTypes[index] = newTypes[index + direction];
    newTypes[index + direction] = temp;
    setServiceTypes(newTypes);
  };
  const removeService = (index: number) => setServiceTypes(serviceTypes.filter((_, i) => i !== index));
  const addService = () => {
    if (newService.trim()) {
      setServiceTypes([...serviceTypes, newService.trim()]);
      setNewService("");
    }
  };

  if (user?.role !== "admin") return <div className="text-center p-20 text-xl font-bold">🔒 權限不足</div>;
  if (loading) return <div className="p-8 text-center text-stone-500">載入設定中...</div>;

  return (
    <div className="space-y-8 max-w-5xl pb-20">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">系統設定與權限</h1>
        <p className="text-sm text-stone-500 mt-1">管理員專屬控制台，可調整系統參數與員工權限。</p>
      </div>

      {/* 區塊 1：員工帳號與權限 (RBAC) */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-stone-200 flex justify-between items-center bg-stone-50">
          <h2 className="text-lg font-bold text-stone-800">員工帳號與權限 (RBAC)</h2>
          <button className="bg-stone-800 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-stone-700">
            + 新增帳號
          </button>
        </div>
        <table className="min-w-full divide-y divide-stone-200">
          <thead className="bg-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-stone-500 uppercase">員工姓名</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-stone-500 uppercase">帳號 (Email)</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-stone-500 uppercase">系統角色</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-stone-500 uppercase">狀態</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-stone-500 uppercase">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200 bg-white">
            {staffList.map((staff) => (
              <tr key={staff.id}>
                <td className="px-6 py-4 text-sm font-bold text-stone-900">{staff.name}</td>
                <td className="px-6 py-4 text-sm text-stone-500">{staff.email}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-bold ${
                    staff.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {staff.role === 'admin' ? '管理員 (Admin)' : '一般職員 (Staff)'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center rounded-full w-2 h-2 mr-2 ${
                    staff.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                  }`}></span>
                  <span className="text-sm text-stone-600">{staff.status === 'active' ? '啟用中' : '已停權'}</span>
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium">
                  <button className="text-amber-700 hover:text-amber-900">編輯權限</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 區塊 2：祿位分區定價 */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
        <h2 className="text-lg font-bold text-stone-800 mb-4">祿位分區定價 (HKD)</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {Object.keys(prices).map((zone) => (
            <div key={zone}>
              <label className="block text-sm font-medium text-stone-700">{zone}</label>
              <input 
                type="number" 
                value={prices[zone as keyof typeof prices]} 
                onChange={(e) => setPrices({...prices, [zone]: Number(e.target.value)})}
                className="mt-1 w-full rounded-md border-stone-300 shadow-sm focus:border-amber-500" 
              />
            </div>
          ))}
        </div>
      </div>

      {/* 區塊 3：法事與服務項目管理 */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
        <h2 className="text-lg font-bold text-stone-800 mb-4">法事項目選單管理</h2>
        <div className="flex gap-2 mb-4">
          <input 
            type="text" value={newService} onChange={e => setNewService(e.target.value)}
            placeholder="輸入新服務項目" className="flex-1 rounded-md border-stone-300 text-sm"
          />
          <button onClick={addService} className="bg-amber-700 text-white px-4 rounded-md font-bold hover:bg-amber-800">新增</button>
        </div>
        <ul className="divide-y divide-stone-100 border border-stone-200 rounded-md">
          {serviceTypes.map((type, i) => (
            <li key={i} className="flex justify-between items-center p-3 bg-stone-50">
              <span className="font-bold text-stone-700">{i + 1}. {type}</span>
              <div className="flex gap-2">
                <button onClick={() => moveService(i, -1)} disabled={i === 0} className="px-2 py-1 bg-white border rounded text-xs disabled:opacity-30">▲</button>
                <button onClick={() => moveService(i, 1)} disabled={i === serviceTypes.length - 1} className="px-2 py-1 bg-white border rounded text-xs disabled:opacity-30">▼</button>
                <button onClick={() => removeService(i)} className="px-2 py-1 bg-red-100 text-red-600 rounded text-xs ml-2">刪除</button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex justify-end">
        <button onClick={handleSaveSettings} className="bg-stone-900 text-white px-8 py-3 rounded-md font-bold tracking-widest hover:bg-stone-800 shadow-lg">
          💾 儲存所有系統設定
        </button>
      </div>
    </div>
  );
}