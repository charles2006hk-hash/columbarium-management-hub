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
};
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export default function SettingsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  
  // 6 大區域定價
  const [prices, setPrices] = useState({ 大堂區: 58000, 天區: 88000, 地區: 68000, 玄區: 78000, 宇區: 48000, 宙區: 38000 });
  
  // 動態服務項目列表
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
  if (loading) return <div className="p-8 text-center">載入中...</div>;

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">系統參數設定</h1>
        <p className="text-sm text-stone-500 mt-1">管理祿位定價與法事項目選單。</p>
      </div>

      {/* 區塊 1：祿位定價 (補齊 6 區) */}
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

      {/* 區塊 2：法事與服務項目管理 */}
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