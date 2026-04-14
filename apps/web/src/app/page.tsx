// apps/web/src/app/page.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
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

export default function Home() {
  const [booking, setBooking] = useState({ name: "", phone: "", date: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "leads"), {
        ...booking,
        status: "new",
        createdAt: new Date()
      });
      setSubmitted(true);
    } catch (err) { alert("提交失敗，請聯絡廟方。"); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-stone-100 font-sans selection:bg-amber-700 selection:text-white scroll-smooth overflow-x-hidden">
      
      {/* 導航列 */}
      <nav className="fixed w-full z-50 bg-stone-950/90 backdrop-blur-md border-b-2 border-amber-800/50 shadow-lg shadow-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 border border-amber-500 rounded-full flex items-center justify-center bg-stone-900 shadow-[0_0_15px_rgba(217,119,6,0.3)]">
              <span className="text-base sm:text-xl">🪷</span>
            </div>
            <h1 className="text-lg sm:text-2xl font-bold tracking-[0.1em] sm:tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-600 font-serif">
              觀塘地藏王古廟
            </h1>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium text-stone-300">
            <Link href="#history" className="hover:text-amber-500 transition-colors tracking-widest">古廟源起</Link>
            <Link href="#zones" className="hover:text-amber-500 transition-colors tracking-widest">祿位園區</Link>
            <Link href="#services" className="hover:text-amber-500 transition-colors tracking-widest">法事服務</Link>
          </div>
          <div className="flex gap-4">
            <Link 
              href="/portal" 
              className="px-4 py-1.5 sm:px-6 sm:py-2 text-xs sm:text-sm font-bold text-stone-950 bg-gradient-to-r from-amber-400 to-amber-600 rounded-sm hover:from-amber-300 hover:to-amber-500 transition-all shadow-[0_0_15px_rgba(217,119,6,0.4)]"
            >
              家屬查詢
            </Link>
          </div>
        </div>
      </nav>

      {/* 首頁主視覺 */}
      <section className="relative min-h-[90vh] flex flex-col justify-center items-center text-center px-4 sm:px-6 overflow-hidden">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1548625361-ecbf83a54a7f?q=80&w=2670&auto=format&fit=crop')" }}
        ></div>
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-stone-950/80 via-stone-900/80 to-stone-950"></div>
        <div className="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>

        <div className="relative z-10 flex flex-col items-center mt-20 w-full max-w-4xl">
          <div className="w-[2px] h-16 sm:h-24 bg-gradient-to-b from-transparent to-amber-500 mb-6 sm:mb-8"></div>
          
          <h2 className="text-amber-500 font-bold tracking-[0.3em] sm:tracking-[0.5em] text-xs sm:text-sm md:text-base mb-6 sm:mb-8 border-y border-amber-800/50 py-2 sm:py-3 px-4 sm:px-8 backdrop-blur-sm bg-stone-900/30">
            地獄不空・誓不成佛
          </h2>
          
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-stone-100 font-serif leading-tight mb-6 sm:mb-8 tracking-widest drop-shadow-2xl">
            慈悲渡化 <br />
            <span className="text-amber-600/90 italic font-light text-2xl sm:text-4xl md:text-6xl mt-2 sm:mt-4 block">庇佑十方先靈</span>
          </h1>
          
          <p className="text-sm sm:text-base md:text-xl text-stone-400 max-w-2xl mb-10 sm:mb-12 leading-relaxed font-light tracking-wider px-2">
            源於半世紀前的奇蹟守護，座落於觀塘半山。<br className="hidden sm:block" />
            我們以至誠之心，為您的摯愛尋得永恆寧靜的香火歸處。
          </p>
          
          <Link 
            href="#zones" 
            className="px-8 py-3 sm:px-10 sm:py-4 bg-stone-800/80 text-amber-500 border border-amber-600/50 rounded-sm text-sm sm:text-base font-bold tracking-[0.2em] hover:bg-amber-600 hover:text-stone-900 transition-all backdrop-blur-md"
          >
            一覽祿位園區
          </Link>
        </div>
      </section>

      {/* 歷史源起：徹底修復手機端排版與對齊 */}
      <section id="history" className="py-16 md:py-32 bg-stone-200 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-1/3 h-full bg-stone-300/50 transform -skew-x-12 translate-x-20 z-0"></div>
        
        <div className="max-w-6xl mx-auto px-6 md:px-12 relative z-10 flex flex-col md:flex-row items-center gap-10 md:gap-16">
          <div className="w-full md:w-5/12 flex justify-center">
            <div className="p-6 md:p-12 bg-stone-900 border-4 border-double border-amber-700 shadow-2xl relative">
              <div className="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-amber-500"></div>
              <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 border-amber-500"></div>
              <div 
                className="text-amber-500 font-serif font-bold text-2xl md:text-3xl tracking-[0.3em] leading-loose h-48 md:h-72"
                style={{ writingMode: 'vertical-rl' }}
              >
                眾生度盡方證菩提
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-7/12">
            <div className="flex items-center justify-center md:justify-start gap-4 mb-4 md:mb-6">
              <span className="w-8 md:w-12 h-[2px] bg-amber-600"></span>
              <h3 className="text-amber-800 font-bold tracking-[0.2em] text-xs md:text-sm">歷史沿革</h3>
            </div>
            {/* 取消換行標籤，讓文字自然流動，並置中或靠左 */}
            <h2 className="text-2xl md:text-4xl font-serif font-bold text-stone-900 mb-6 md:mb-8 tracking-widest leading-snug text-center md:text-left">
              「六一八」劫後祥瑞<br className="hidden md:block" />觀塘街坊的永恆守護
            </h2>
            {/* 放棄 text-justify，改用 text-left 保證多端相容 */}
            <div className="space-y-4 md:space-y-6 text-stone-600 leading-relaxed text-left text-sm md:text-lg font-light">
              <p>1972年6月18日，暴雨引發嚴重山泥傾瀉，昔日俗稱「雞寮」的觀塘翠屏寮屋區遭受重創。在泥石洪流的無情席捲下，無數家園毀於一旦。</p>
              <p>然而，令人稱奇的是，當時供奉於山坡洞穴內的地藏王神像竟奇蹟般避過災劫，絲毫無損。這份祥瑞，給予了當時痛失親友的街坊極大的心靈慰藉。</p>
              <p>災後，政府撥地重建，古廟自此擴展。半世紀以來，地藏王古廟不僅是觀塘區的信仰核心，更是以佛法大願——<strong className="text-stone-900 font-medium">「地獄不空，誓不成佛」</strong>，超渡救濟無數先靈。我們延續這份慈悲，為家屬提供莊嚴的祖先祿位與法事服務。</p>
            </div>
          </div>
        </div>
      </section>

      {/* 祿位園區 */}
      <section id="zones" className="py-20 md:py-32 bg-stone-950 text-stone-50 relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-30"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-12 md:mb-20">
            <span className="text-amber-500 tracking-[0.3em] text-xs md:text-sm font-bold border-b border-amber-800 pb-2">永恆歸處</span>
            <h3 className="text-2xl md:text-4xl font-serif font-bold mt-4 md:mt-6 mb-4 text-stone-100 tracking-widest">六大專屬祿位區段</h3>
            <p className="text-stone-400 max-w-2xl mx-auto font-light text-sm md:text-base px-2">
              融合風水理氣與現代莊嚴設計，提供多樣化格局。<br className="hidden sm:block"/>為不同家族的先人，尋得最相稱的清幽淨土。
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 md:gap-10">
            {[
              { title: "天區", desc: "至高無上，視野開闊，象徵功德圓滿。", price: "HKD 88,000 起", color: "from-amber-600 to-amber-900" },
              { title: "地區", desc: "厚德載物，沉穩寧靜，庇佑子孫綿延。", price: "HKD 68,000 起", color: "from-stone-600 to-stone-800" },
              { title: "大堂", desc: "莊嚴宏偉，香火鼎盛，日夜梵音繚繞。", price: "HKD 58,000 起", color: "from-red-800 to-stone-900" },
              { title: "玄區", desc: "玄妙深邃，氣場凝聚，藏風聚氣之選。", price: "HKD 78,000 起", color: "from-emerald-900 to-stone-900" },
              { title: "宇區", desc: "宇宙浩瀚，福澤廣被，接納十方善緣。", price: "HKD 48,000 起", color: "from-blue-900 to-stone-900" },
              { title: "宙區", desc: "時光永恆，平易近人，傳承世代孝心。", price: "HKD 38,000 起", color: "from-stone-700 to-stone-900" },
            ].map((zone, i) => (
              <div key={i} className="group relative bg-stone-900 p-1 rounded-sm overflow-hidden hover:-translate-y-1 md:hover:-translate-y-2 transition-transform duration-500 shadow-2xl">
                <div className={`absolute inset-0 bg-gradient-to-b ${zone.color} opacity-50 group-hover:opacity-100 transition-opacity`}></div>
                
                <div className="relative h-full bg-stone-950 p-4 sm:p-6 md:p-10 border border-stone-800 flex flex-col items-center text-center z-10">
                  <div className="w-8 h-12 md:w-12 md:h-20 border border-amber-600/50 mb-4 md:mb-8 flex items-center justify-center bg-stone-900 relative">
                    <div className="absolute top-0 w-full h-1 bg-amber-600"></div>
                    <span className="text-lg md:text-2xl text-amber-500 font-serif">{zone.title[0]}</span>
                  </div>
                  <h4 className="text-base sm:text-xl md:text-2xl font-bold font-serif mb-2 md:mb-4 text-stone-100 tracking-widest">{zone.title}</h4>
                  <div className="w-6 md:w-10 h-[1px] bg-stone-700 mb-3 md:mb-6"></div>
                  <p className="text-stone-400 text-[10px] sm:text-xs md:text-sm mb-4 md:mb-10 leading-relaxed font-light flex-1">{zone.desc}</p>
                  <div className="mt-auto pt-3 md:pt-6 border-t border-stone-800 w-full">
                    <p className="text-amber-500 font-serif tracking-widest text-[10px] sm:text-sm md:text-base">{zone.price}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 數位服務與法事查詢 */}
      <section id="services" className="py-16 md:py-32 bg-stone-100 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 md:px-12 flex flex-col-reverse lg:flex-row items-center gap-12 md:gap-16">
          <div className="w-full lg:w-1/2 relative mt-8 lg:mt-0">
            <div className="aspect-square bg-stone-300 rounded-full absolute -top-10 -left-10 w-full blur-3xl opacity-30"></div>
            <div className="relative bg-white p-3 md:p-4 shadow-2xl border border-stone-200">
              <div className="border border-amber-200 bg-stone-50 p-6 md:p-8 flex flex-col h-[380px] md:h-[450px] relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-amber-400 to-amber-600"></div>
                <div className="flex justify-between items-center mb-6 md:mb-10 border-b border-stone-200 pb-4">
                   <h4 className="font-serif font-bold text-stone-800 text-sm md:text-base">家屬追思查詢系統</h4>
                   <span className="text-[10px] md:text-xs text-amber-700 font-bold px-2 py-1 bg-amber-100 rounded">SSL 加密</span>
                </div>
                <div className="space-y-4 md:space-y-6 flex-1">
                   <div className="w-full h-10 md:h-12 bg-white border border-stone-200 rounded flex items-center px-4 text-stone-400 text-xs md:text-sm">輸入祿位編號 (如: L1-101)</div>
                   <div className="w-full h-10 md:h-12 bg-white border border-stone-200 rounded flex items-center px-4 text-stone-400 text-xs md:text-sm">輸入登記電話</div>
                   <div className="w-full h-10 md:h-12 bg-stone-900 rounded flex items-center justify-center text-amber-500 font-bold tracking-widest text-sm">登入查閱</div>
                </div>
                <div className="mt-auto bg-white p-3 md:p-4 border border-stone-200 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-stone-200 rounded flex items-center justify-center text-xl md:text-2xl">📸</div>
                  <div>
                    <div className="h-2 md:h-3 w-16 md:w-20 bg-stone-300 rounded mb-2"></div>
                    <div className="h-1.5 md:h-2 w-24 md:w-32 bg-stone-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2">
            <div className="flex items-center justify-center md:justify-start gap-4 mb-4 md:mb-6">
              <span className="w-8 md:w-12 h-[2px] bg-amber-600"></span>
              <h3 className="text-amber-800 font-bold tracking-[0.2em] text-xs md:text-sm">科技與傳統的結合</h3>
            </div>
            <h2 className="text-2xl md:text-4xl font-serif font-bold text-stone-900 mb-6 md:mb-8 leading-snug tracking-widest text-center md:text-left">
              遠距追思<br/>法事圓滿隨時掌握
            </h2>
            {/* 同樣改為 text-left */}
            <p className="text-stone-600 mb-8 md:mb-10 leading-relaxed font-light text-sm md:text-lg text-left">
              我們深知思念沒有距離，亦明白現代家屬未必能時常親臨古廟。
              透過本廟專屬開發的「家屬查詢系統」，您只需輸入祿位編號與登記電話，即可隨時查閱近期的法事執行紀錄與現場照片。<br/><br/>
              無論身在何處，皆能親眼見證先人安好，讓心靈得到真正的平靜與撫慰。
            </p>
            <div className="text-center md:text-left">
              <Link 
                href="/portal" 
                className="inline-flex items-center justify-center gap-4 px-6 py-3 md:px-8 md:py-4 bg-stone-900 text-amber-500 border border-stone-900 hover:bg-transparent hover:text-stone-900 transition-colors font-bold tracking-widest text-sm md:text-base w-full md:w-auto"
              >
                進入家屬門戶系統 <span>&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 預約參觀表單 */}
      <section id="contact" className="py-16 md:py-32 bg-stone-900 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="bg-stone-950 border border-stone-800 shadow-2xl flex flex-col md:flex-row">
            
            <div className="w-full md:w-5/12 p-8 md:p-12 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] relative">
              <div className="absolute inset-0 bg-gradient-to-b from-amber-900/20 to-transparent"></div>
              <div className="relative z-10">
                <h3 className="text-2xl md:text-3xl font-serif font-bold text-amber-500 mb-6 md:mb-8 tracking-widest">親臨參觀</h3>
                <p className="text-stone-400 leading-relaxed mb-8 md:mb-12 font-light text-left text-sm md:text-base">
                  感受古廟百年香火的寧靜氛圍。我們的專業顧問將帶領您一覽各大區段，為先人挑選最合適的祖先祿位。
                </p>
                <div className="space-y-4 md:space-y-6 text-xs md:text-sm text-stone-300 font-light tracking-wider">
                  <p className="flex items-start gap-3 md:gap-4"><span className="text-amber-600">📍</span> 香港觀塘區半山 (地藏王古廟)</p>
                  <p className="flex items-center gap-3 md:gap-4"><span className="text-amber-600">📞</span> +852 2345 6789</p>
                  <p className="flex items-center gap-3 md:gap-4"><span className="text-amber-600">⏰</span> 每日 09:00 - 18:00</p>
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-7/12 p-8 md:p-12 bg-white">
              {submitted ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12 md:py-20">
                  <div className="w-16 h-16 md:w-20 md:h-20 border-2 border-green-500 rounded-full flex items-center justify-center mb-6">
                    <span className="text-3xl md:text-4xl text-green-500">✓</span>
                  </div>
                  <h4 className="text-xl md:text-2xl font-bold text-stone-800 tracking-widest mb-2">預約已收到</h4>
                  <p className="text-sm md:text-base text-stone-500">我們將於 24 小時內致電與您確認時間，感恩您的結緣。</p>
                </div>
              ) : (
                <form onSubmit={handleBooking} className="space-y-5 md:space-y-6">
                  <h4 className="text-lg md:text-xl font-bold text-stone-900 mb-6 md:mb-8 border-b border-stone-200 pb-4 tracking-widest">填寫預約資料</h4>
                  <div>
                    <label className="block text-xs md:text-sm font-bold text-stone-700 mb-2">您的姓名</label>
                    <input required type="text" value={booking.name} onChange={e => setBooking({...booking, name: e.target.value})} className="w-full bg-stone-50 border border-stone-300 p-3 focus:border-amber-600 focus:outline-none transition-colors text-stone-900" placeholder="請輸入全名" />
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm font-bold text-stone-700 mb-2">聯絡電話</label>
                    <input required type="tel" value={booking.phone} onChange={e => setBooking({...booking, phone: e.target.value})} className="w-full bg-stone-50 border border-stone-300 p-3 focus:border-amber-600 focus:outline-none transition-colors text-stone-900" placeholder="請輸入聯絡電話" />
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm font-bold text-stone-700 mb-2">預定參觀日期</label>
                    <input required type="date" value={booking.date} onChange={e => setBooking({...booking, date: e.target.value})} className="w-full bg-stone-50 border border-stone-300 p-3 focus:border-amber-600 focus:outline-none transition-colors text-stone-900" />
                  </div>
                  <button disabled={loading} className="w-full bg-stone-900 text-amber-500 py-3.5 md:py-4 font-bold hover:bg-amber-700 hover:text-white transition-colors tracking-widest mt-4 disabled:opacity-50">
                    {loading ? "傳送中..." : "送出預約"}
                  </button>
                </form>
              )}
            </div>
            
          </div>
        </div>
      </section>

      {/* 頁尾 */}
      <footer className="bg-stone-950 text-stone-500 py-8 md:py-12 text-xs md:text-sm text-center border-t border-stone-900 font-light tracking-wider px-4">
        <p>&copy; 2026 觀塘地藏王古廟 Kwun Tong Ksitigarbha Temple. All rights reserved.</p>
        <p className="mt-2 text-stone-700">Digital Memorial System by Columbarium Hub</p>
      </footer>
    </div>
  );
}