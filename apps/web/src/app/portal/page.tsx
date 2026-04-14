// apps/web/src/app/portal/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
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

export default function FamilyPortal() {
  const [loginData, setLoginData] = useState({ tabletId: "", phone: "" });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tabletInfo, setTabletInfo] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const q = query(
        collection(db, "tablets"),
        where("id", "==", loginData.tabletId.toUpperCase()),
        where("ownerPhone", "==", loginData.phone)
      );
      const snap = await getDocs(q);

      if (!snap.empty) {
        const tData = snap.docs[0].data();
        setTabletInfo(tData);
        
        const sQ = query(
          collection(db, "services"),
          where("tabletId", "==", loginData.tabletId.toUpperCase()),
          where("status", "==", "completed"),
          orderBy("completedAt", "desc")
        );
        const sSnap = await getDocs(sQ);
        setServices(sSnap.docs.map(doc => doc.data()));
        setIsLoggedIn(true);
      } else {
        alert("驗證失敗：編號或電話號碼不正確，請核對協議書。");
      }
    } catch (err) {
      console.error(err);
      alert("系統忙碌中，請稍後再試。");
    } finally {
      setLoading(false);
    }
  };

  // 🔴 登入畫面：深色大殿風格
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-stone-950 font-sans selection:bg-amber-700 selection:text-white flex items-center justify-center relative px-6">
        {/* 背景氛圍 */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-30"></div>
        <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-amber-900/10 to-transparent"></div>
        
        {/* 左上角明確的「返回主頁」按鈕 */}
        <div className="absolute top-8 left-8 z-20">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-stone-400 hover:text-amber-500 transition-colors text-sm tracking-widest font-light"
          >
            <span className="text-lg">⟵</span> 返回古廟主頁
          </Link>
        </div>

        <div className="max-w-md w-full relative z-10">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block hover:opacity-80 transition-opacity">
              <div className="w-12 h-12 mx-auto border border-amber-500 rounded-full flex items-center justify-center bg-stone-900 shadow-[0_0_15px_rgba(217,119,6,0.3)] mb-4">
                <span className="text-2xl">🪷</span>
              </div>
              <h1 className="text-2xl font-bold tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-600 font-serif">
                觀塘地藏王古廟
              </h1>
            </Link>
            <p className="text-stone-400 text-sm mt-3 tracking-widest font-light">家屬專屬追思門戶</p>
          </div>

          <div className="bg-stone-900 border-4 border-double border-amber-800/60 shadow-2xl p-8 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[1px] bg-amber-500"></div>
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-stone-400 mb-2 tracking-widest">祿位編號 (如: L1-101)</label>
                <input 
                  required type="text" 
                  className="w-full bg-stone-950 border border-stone-800 text-amber-500 p-3 focus:border-amber-600 focus:outline-none transition-colors text-center font-bold tracking-widest"
                  value={loginData.tabletId}
                  onChange={e => setLoginData({...loginData, tabletId: e.target.value})}
                  placeholder="請輸入編號"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-stone-400 mb-2 tracking-widest">登記聯絡電話</label>
                <input 
                  required type="tel" 
                  className="w-full bg-stone-950 border border-stone-800 text-amber-500 p-3 focus:border-amber-600 focus:outline-none transition-colors text-center font-bold tracking-widest"
                  value={loginData.phone}
                  onChange={e => setLoginData({...loginData, phone: e.target.value})}
                  placeholder="請輸入電話"
                />
              </div>
              <button 
                disabled={loading}
                className="w-full bg-gradient-to-r from-amber-700 to-stone-800 text-amber-50 py-4 font-bold tracking-widest hover:from-amber-600 hover:to-stone-700 transition-all border border-amber-600/50 mt-4 shadow-[0_0_15px_rgba(217,119,6,0.2)] disabled:opacity-50"
              >
                {loading ? "資料核對中..." : "登入查閱"}
              </button>
              <p className="text-center text-xs text-stone-600 font-light mt-4">
                登入即表示您同意本廟之隱私權保護政策
              </p>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // 🟢 登入後畫面：家屬追思大廳
  return (
    <div className="min-h-screen bg-stone-100 pb-24 font-sans">
      
      {/* 導航列：包含返回主頁與登出按鈕 */}
      <nav className="bg-stone-950 border-b border-amber-900/50 relative z-20">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-amber-500 font-serif tracking-widest font-bold flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span>🪷</span> 觀塘地藏王古廟
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/" className="text-xs text-stone-400 hover:text-white transition-colors">
              返回主頁
            </Link>
            
            <button 
              onClick={() => setIsLoggedIn(false)} 
              className="text-xs text-stone-400 hover:text-amber-500 transition-colors border border-stone-800 px-3 py-1 bg-stone-900"
            >
              登出系統
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 pt-12">
        
        {/* 歡迎橫幅 */}
        <div className="text-center mb-12">
          <span className="text-amber-700 font-bold tracking-[0.4em] text-sm mb-4 block">念親恩・永相隨</span>
          <h2 className="text-3xl font-serif font-bold text-stone-900 tracking-widest">數位追思大廳</h2>
          <div className="w-16 h-[1px] bg-amber-600 mx-auto mt-6"></div>
        </div>

        {/* 虛擬牌位與位置資訊 */}
        <div className="bg-white p-2 shadow-2xl border border-stone-200 mb-16 relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
          <div className="bg-stone-50 border-4 border-double border-stone-200 p-8 flex flex-col items-center relative z-10">
            
            <div className="w-32 h-64 bg-stone-900 border-4 border-amber-700 rounded-t-xl shadow-2xl p-2 relative flex flex-col items-center justify-center mb-8">
              <div className="absolute inset-1 border border-amber-500/30 rounded-t-lg"></div>
              <div className="absolute top-0 w-full h-2 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600 rounded-t-sm"></div>
              
              <div className="text-amber-600/80 text-xs mb-6 font-bold tracking-widest">{tabletInfo.id}</div>
              
              <div 
                className="text-3xl font-bold font-serif tracking-widest text-amber-400"
                style={{ writingMode: 'vertical-rl', textOrientation: 'upright' }}
              >
                {tabletInfo.ownerName}
              </div>
              
              <div className="absolute bottom-0 w-full h-6 bg-stone-950 border-t-2 border-amber-800"></div>
            </div>

            <div className="text-center">
              <span className="text-xs text-stone-400 tracking-widest block mb-1">安座位置</span>
              <h3 className="text-xl font-bold text-stone-800 tracking-widest">
                {tabletInfo.zone} <span className="text-amber-700 mx-1">|</span> {tabletInfo.block}
              </h3>
            </div>
          </div>
        </div>

        {/* 📸 法事紀錄 - 支援多圖畫廊 (Smart Gallery) */}
        <div className="flex items-center gap-4 mb-8">
          <span className="w-8 h-[1px] bg-amber-600"></span>
          <h3 className="text-xl font-bold text-stone-800 tracking-widest font-serif">近期法事與供奉紀錄</h3>
        </div>
        
        <div className="space-y-16">
          {services.length > 0 ? services.map((s, i) => (
            <div key={i} className="bg-white p-6 shadow-xl border border-stone-200">
              <div className="flex justify-between items-center mb-6 border-b border-stone-100 pb-4">
                <h4 className="font-bold text-stone-900 text-xl font-serif tracking-wider">{s.type}</h4>
                <span className="font-bold text-amber-700 text-sm">
                  {s.completedAt ? new Date(s.completedAt.toDate()).toLocaleDateString('zh-HK') : ''}
                </span>
              </div>

              {/* 核心多圖展示區：根據圖片數量自動排版 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {s.imageUrls && s.imageUrls.length > 0 ? (
                  s.imageUrls.map((url: string, idx: number) => (
                    <div key={idx} className={`border border-stone-200 p-1 bg-stone-50 relative group overflow-hidden ${s.imageUrls.length === 1 ? 'sm:col-span-2 lg:col-span-3' : ''}`}>
                      <img src={url} alt={`照片 ${idx+1}`} className="w-full h-64 object-cover hover:scale-105 transition-transform duration-700" />
                    </div>
                  ))
                ) : s.imageUrl ? (
                  /* 舊版單圖相容邏輯 */
                  <div className="sm:col-span-2 lg:col-span-3 border border-stone-200 p-1 bg-stone-50 relative group overflow-hidden">
                    <img src={s.imageUrl} alt="法事現場" className="w-full h-80 object-cover hover:scale-105 transition-transform duration-700" />
                  </div>
                ) : (
                  <div className="col-span-full py-10 text-center text-stone-400 italic">尚未上傳現場照片</div>
                )}
              </div>
              
              <div className="mt-6 flex justify-end">
                <p className="text-xs text-stone-400 tracking-widest">單號：{s.taskId}</p>
              </div>
            </div>
          )) : (
            <div className="text-center py-24 bg-stone-50 border border-stone-200 shadow-inner">
              <span className="text-4xl text-stone-300 block mb-4">🪔</span>
              <p className="text-stone-500 tracking-widest">目前尚無上傳的照片紀錄</p>
              <p className="text-xs text-stone-400 mt-2">法事執行完畢後，影像將會同步至此。</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}