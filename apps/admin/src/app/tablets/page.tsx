// apps/admin/src/app/tablets/page.tsx
"use client";

import { useState, useEffect } from "react";
import { collection, query, where, getDocs, orderBy, updateDoc, doc, addDoc, serverTimestamp } from "firebase/firestore";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
};
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export default function TabletsPage() {
  const [selectedZone, setSelectedZone] = useState("大堂區");
  const [tablets, setTablets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeTablet, setActiveTablet] = useState<any>(null);

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  useEffect(() => {
    async function fetchTablets() {
      setLoading(true);
      try {
        const q = query(collection(db, "tablets"), where("zone", "==", selectedZone), orderBy("id", "asc"));
        const querySnapshot = await getDocs(q);
        setTablets(querySnapshot.docs.map((doc) => ({ dbId: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("讀取失敗:", err);
      } finally { setLoading(false); }
    }
    fetchTablets();
  }, [selectedZone]);

  const handleOpenDrawer = (tablet: any) => {
    setActiveTablet(tablet);
    setIsDrawerOpen(true);
    if (tablet.status === 'sold') {
      setCustomerName(tablet.ownerName || "");
      setCustomerPhone(tablet.ownerPhone || "");
    } else {
      setCustomerName(""); setCustomerPhone("");
    }
  };

  const handlePhoneChange = async (phone: string) => {
    setCustomerPhone(phone);
    if (phone.length >= 8) {
      try {
        const q = query(collection(db, "customers"), where("phone", "==", phone));
        const snap = await getDocs(q);
        if (!snap.empty && snap.docs[0].data().name) setCustomerName(snap.docs[0].data().name);
      } catch (e) {}
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTablet) return;
    try {
      const tabletRef = doc(db, "tablets", activeTablet.dbId);
      if (activeTablet.status === 'available') {
        await updateDoc(tabletRef, { status: "sold", ownerName: customerName, ownerPhone: customerPhone, soldAt: new Date() });
        await addDoc(collection(db, "customers"), { name: customerName, phone: customerPhone, lastPurchase: new Date() });
        await addDoc(collection(db, "orders"), { orderNo: `ORD-${Date.now()}`, customerName, customerPhone, tabletId: activeTablet.id, amount: 58000, status: "paid", createdAt: serverTimestamp() });
        alert(`安座登記成功！`);
      } else {
        await updateDoc(tabletRef, { ownerName: customerName, ownerPhone: customerPhone });
        alert(`牌位資料更新成功！`);
      }
      setTablets(prev => prev.map(t => t.dbId === activeTablet.dbId ? { ...t, status: 'sold', ownerName: customerName, ownerPhone: customerPhone } : t));
      setIsDrawerOpen(false);
    } catch (err) { alert("儲存失敗"); }
  };

  const blocks = Array.from(new Set(tablets.map((t) => t.block)));

  return (
    <div className="relative min-h-screen">
      <div className="space-y-6">
        <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-stone-200">
          <div>
            <h1 className="text-2xl font-bold text-stone-900 font-serif">祿位平面總覽</h1>
            <p className="text-sm text-stone-500">點擊牌位進行安座登記或維護資料</p>
          </div>
          <select 
            value={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value)}
            className="rounded-md border-stone-300 py-2 pl-4 pr-10 text-base font-bold text-stone-800 focus:border-amber-500 bg-stone-50"
          >
            {["大堂區", "天區", "地區", "玄區", "宇區", "宙區"].map(z => <option key={z} value={z}>{z}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="py-20 text-center text-stone-500">載入平面圖中...</div>
        ) : (
          <div className="space-y-12 pb-20">
            {blocks.map((blockId) => (
              <div key={blockId} className="bg-stone-50 p-8 rounded-2xl shadow-inner border border-stone-200">
                <div className="flex items-center justify-center mb-8">
                  <div className="h-[1px] w-12 bg-stone-300"></div>
                  <h2 className="text-xl font-bold text-stone-800 mx-4 font-serif tracking-widest">{blockId} 區段</h2>
                  <div className="h-[1px] w-12 bg-stone-300"></div>
                </div>
                
                {/* 🎨 牌位網格：改成直立長方形 */}
                <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-13 gap-3 justify-items-center">
                  {tablets.filter((t) => t.block === blockId).map((tablet) => (
                    <div
                      key={tablet.id}
                      onClick={() => handleOpenDrawer(tablet)}
                      className={`
                        group relative flex flex-col items-center justify-between w-12 h-20 rounded-t-md border-2 cursor-pointer transition-all duration-300 transform hover:-translate-y-1 overflow-hidden shadow-sm
                        ${tablet.status === 'available' 
                          ? 'bg-stone-100 border-stone-300 text-stone-500 hover:border-amber-400 hover:shadow-md' 
                          : 'bg-stone-800 border-amber-600 text-amber-500 shadow-md hover:shadow-amber-900/50'}
                      `}
                    >
                      {/* 牌位頂部的裝飾線 */}
                      <div className={`w-full h-1.5 ${tablet.status === 'available' ? 'bg-stone-300' : 'bg-amber-500'}`}></div>
                      
                      {/* 牌位編號 */}
                      <span className="font-bold text-[10px] mt-1">{tablet.number}</span>
                      
                      {/* 裝飾性底座 */}
                      <div className={`w-full h-2 mt-auto border-t ${tablet.status === 'available' ? 'border-stone-300 bg-stone-200' : 'border-amber-600 bg-stone-900'}`}></div>

                      {/* 懸停詳細資訊 Tooltip */}
                      <div className="absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 group-hover:block z-10 pointer-events-none">
                        <div className="bg-stone-900 text-amber-50 text-[11px] py-1.5 px-3 rounded shadow-2xl border border-stone-700 whitespace-nowrap">
                          {tablet.id} | {tablet.status === 'available' ? '虛位以待' : '已安座'}
                          {tablet.status === 'sold' && tablet.ownerName && ` | ${tablet.ownerName}`}
                        </div>
                        <div className="w-2 h-2 bg-stone-900 rotate-45 mx-auto -mt-1 border-b border-r border-stone-700"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🎨 右側滑出抽屜 (Drawer) - 虛擬牌位風格 */}
      <div className={`fixed inset-0 z-50 overflow-hidden transition-opacity duration-300 ${isDrawerOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={() => setIsDrawerOpen(false)} />
        <div className={`absolute inset-y-0 right-0 w-full max-w-md bg-stone-50 shadow-2xl transition-transform duration-300 transform border-l-4 border-amber-800 ${isDrawerOpen ? "translate-x-0" : "translate-x-full"}`}>
          <div className="flex h-full flex-col overflow-y-auto">
            
            {/* 關閉按鈕 */}
            <div className="absolute top-4 right-4 z-10">
              <button onClick={() => setIsDrawerOpen(false)} className="w-8 h-8 bg-stone-200 rounded-full flex items-center justify-center text-stone-600 hover:bg-stone-300 transition-colors">✕</button>
            </div>

            {/* 🟢 虛擬牌位展示區 (重點美化) */}
            <div className="bg-stone-900 pt-16 pb-10 px-6 flex flex-col items-center relative shadow-inner">
              <div className="absolute top-0 w-full h-2 bg-amber-600"></div>
              
              {/* 實體牌位設計 */}
              <div className="w-32 h-56 bg-stone-800 border-4 border-amber-600 rounded-t-xl shadow-2xl p-2 relative flex flex-col items-center justify-center">
                <div className="absolute inset-1 border border-amber-500/30 rounded-t-lg"></div>
                <div className="text-amber-500/60 text-xs mb-4 font-bold tracking-widest">{activeTablet?.id}</div>
                
                {/* 垂直排版的文字 */}
                <div 
                  className={`text-2xl font-bold font-serif tracking-widest ${activeTablet?.status === 'sold' ? 'text-amber-400' : 'text-stone-500'}`}
                  style={{ writingMode: 'vertical-rl', textOrientation: 'upright' }}
                >
                  {activeTablet?.status === 'sold' ? (customerName || '未具名') : '虛位以待'}
                </div>
                
                <div className="absolute bottom-0 w-full h-4 bg-stone-900 border-t-2 border-amber-700"></div>
              </div>
            </div>
            
            {/* 表單填寫區 */}
            <div className="p-8 flex-1 bg-stone-50">
              <h2 className="text-lg font-bold text-stone-800 mb-6 border-b border-stone-200 pb-2">
                {activeTablet?.status === 'sold' ? '維護安座資料' : '辦理安座登記'}
              </h2>
              
              <form onSubmit={handleSave} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-stone-700">聯絡電話 <span className="text-xs font-normal text-stone-500">(自動尋找舊客戶)</span></label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    className="mt-1 block w-full rounded-md border-stone-300 shadow-sm focus:border-amber-600 focus:ring-amber-600 bg-white"
                    placeholder="輸入電話號碼"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-stone-700">登記人 / 先人姓名</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="mt-1 block w-full rounded-md border-stone-300 shadow-sm focus:border-amber-600 focus:ring-amber-600 bg-white"
                    placeholder="將顯示於實體牌位上"
                  />
                </div>

                <div className="pt-8">
                  <button
                    type="submit"
                    className={`w-full py-4 rounded-md font-bold transition-all shadow-lg text-white tracking-widest ${
                      activeTablet?.status === 'sold' 
                        ? 'bg-stone-800 hover:bg-stone-900 border border-stone-700' 
                        : 'bg-amber-700 hover:bg-amber-800 border border-amber-600'
                    }`}
                  >
                    {activeTablet?.status === 'sold' ? '💾 儲存修改' : '📜 確認安座 (同步產單)'}
                  </button>
                </div>
              </form>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}