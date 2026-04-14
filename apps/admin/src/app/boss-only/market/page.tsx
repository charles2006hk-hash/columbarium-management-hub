// apps/admin/src/app/boss-only/market/page.tsx
"use client";

import Link from "next/link";
import { useState } from "react";

export default function MarketIntelligence() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState("");

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "8888") setIsUnlocked(true);
    else alert("授權失敗");
  };

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center p-6 print:hidden">
        <div className="max-w-md w-full bg-stone-900 p-8 shadow-2xl rounded-xl border border-stone-800">
          <form onSubmit={handleUnlock} className="space-y-4">
            <div className="text-center mb-6 text-stone-400 text-sm">請解鎖市場情報庫</div>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="授權碼" className="w-full bg-stone-950 border border-stone-800 text-stone-300 p-3 text-center tracking-[0.5em] focus:outline-none" />
            <button className="w-full bg-stone-800 text-stone-400 p-3 font-bold hover:text-white transition-colors">確認</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-24">
      <div className="flex items-center justify-between border-b border-stone-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">市場統計與牌照情報 (雙城聯動模式)</h1>
          <p className="text-sm text-stone-500 mt-1">「香港牌位供奉 ＋ 內地骨灰安放」之競爭力與定價分析。</p>
        </div>
        <Link href="/boss-only" className="bg-stone-100 text-stone-700 px-4 py-2 rounded-md font-medium border border-stone-300 hover:bg-stone-200 transition-colors">
          ⟵ 返回沙盤推演
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 1. 法規紅利與降維打擊 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200 border-t-4 border-t-green-700">
          <h2 className="text-lg font-bold text-stone-800 mb-4 flex items-center gap-2">🛡️ 法規紅利：繞過 Cap.630 死亡陷阱</h2>
          <div className="space-y-4 text-sm text-stone-600">
            <p className="font-bold text-green-800 bg-green-50 p-3 rounded border border-green-200">
              商業模式確立：純「祖先祿位/長生牌位」，不存放骨灰。
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>豁免骨灰龕條例：</strong> 因為本廟不存放骨灰，<strong>完全不受</strong>《私營骨灰安置所條例》(Cap. 630) 規管。無需經歷長達 5-7 年的發牌地獄，更沒有被政府勒令「清灰退款」的毀滅性風險。</li>
              <li><strong>建造成本大幅降低：</strong> 無骨灰意味著無需向環保署及消防署申請極度嚴苛的特殊通風與防污設備，A&A (加建及改建) 工程成本及時間大幅縮減。</li>
              <li><strong>對標成功案例：</strong> 參考<strong>荃灣圓玄學院</strong>模式，其長生祿位堂在不涉骨灰的情況下，依舊常年爆滿，是極為成熟且利潤豐厚的賽道。</li>
            </ul>
          </div>
        </div>

        {/* 2. 競爭對手與價格分佈 (牌位市場) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200 border-t-4 border-t-amber-600">
          <h2 className="text-lg font-bold text-stone-800 mb-4 flex items-center gap-2">💰 2024 香港「祿位/牌位」市場定價參考</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-stone-50 text-stone-600 font-bold border-b border-stone-200">
                <tr>
                  <th className="py-2 px-3">指標機構</th>
                  <th className="py-2 px-3">牌位參考價格 (HKD)</th>
                  <th className="py-2 px-3">市場定位與備註</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                <tr className="hover:bg-stone-50">
                  <td className="py-3 px-3 font-bold text-amber-800">圓玄學院 (荃灣)</td>
                  <td className="py-3 px-3">$3萬 - $20萬+</td>
                  <td className="py-3 px-3 text-xs">道教名山，視乎大殿及層數，一席難求</td>
                </tr>
                <tr className="hover:bg-stone-50">
                  <td className="py-3 px-3 font-bold">西方寺 (荃灣)</td>
                  <td className="py-3 px-3">$4萬 - $15萬</td>
                  <td className="py-3 px-3 text-xs">佛教聖地，附帶誦經服務</td>
                </tr>
                <tr className="hover:bg-stone-50">
                  <td className="py-3 px-3 font-bold">蓬瀛仙館 (粉嶺)</td>
                  <td className="py-3 px-3">$3.5萬 - $12萬</td>
                  <td className="py-3 px-3 text-xs">設有不同堂口，價格透明度低</td>
                </tr>
                <tr className="hover:bg-stone-50 bg-stone-100">
                  <td className="py-3 px-3 font-bold text-stone-800">我們的古廟 (觀塘)</td>
                  <td className="py-3 px-3">$3.8萬 - $8.8萬</td>
                  <td className="py-3 px-3 text-xs font-bold text-amber-700">市區地段優勢 + 數位化追思</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. 定價戰略分析 (雙城模式) */}
        <div className="bg-stone-900 text-stone-300 p-6 rounded-xl shadow-lg lg:col-span-2 border border-stone-800">
          <h2 className="text-xl font-bold text-amber-500 mb-4 border-b border-stone-800 pb-2">🎯 核心戰略：「香港牌位 ＋ 內地安放」聯動優勢</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div>
              <h3 className="text-white font-bold mb-2">1. 解決家屬的痛點 (Pain Point)</h3>
              <p className="text-sm leading-relaxed text-stone-400">
                香港骨灰龕位動輒 20-50 萬且極度短缺。我們聯合內地機構，將骨灰安置於內地（成本極低），而在香港市中心（觀塘）設立長生祿位。家屬平日無需舟車勞頓過關，下班後即可至觀塘上香祭拜，完美解決「盡孝與便利」的兩難。
              </p>
            </div>
            <div>
              <h3 className="text-white font-bold mb-2">2. 超高毛利的產品結構</h3>
              <p className="text-sm leading-relaxed text-stone-400">
                相比於龕位需要大量空間存放骨灰盅，祿位（牌位）的體積非常小。這意味著同樣的空間面積，祿位的「坪效（每平方呎收益）」是骨灰龕的 3 倍以上。配合我們 $3.8萬 起的定價，利潤空間極其驚人。
              </p>
            </div>
            <div>
              <h3 className="text-white font-bold mb-2">3. 科技追思的代際傳承</h3>
              <p className="text-sm leading-relaxed text-stone-400">
                長者家屬可親臨古廟上香，而年輕一代（或移民海外的家屬）則可透過我們開發的「家屬數位追思門戶」查看法事照片與紀錄。這項獨家功能讓我們在傳統牌位市場中脫穎而出，完全具備與圓玄學院等大機構競爭的實力。
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}