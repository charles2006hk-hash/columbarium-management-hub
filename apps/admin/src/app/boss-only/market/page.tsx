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
          <h1 className="text-2xl font-bold text-stone-900">市場統計與牌照情報 (2024-2025)</h1>
          <p className="text-sm text-stone-500 mt-1">基於香港立法會文件、食環署公開數據與殯儀市場報價彙整。</p>
        </div>
        <Link href="/boss-only" className="bg-stone-100 text-stone-700 px-4 py-2 rounded-md font-medium border border-stone-300 hover:bg-stone-200 transition-colors">
          ⟵ 返回沙盤推演
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 1. 發牌法規與風險 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200 border-t-4 border-t-red-700">
          <h2 className="text-lg font-bold text-stone-800 mb-4 flex items-center gap-2">🏛️ 政策與法規風險 (Cap. 630)</h2>
          <div className="space-y-4 text-sm text-stone-600">
            <p className="font-bold text-red-700 bg-red-50 p-3 rounded border border-red-100">
              根據《2024年私營骨灰安置所(修訂)條例草案》立法會報告 (2025年5月最新披露)：
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>發牌率極低：</strong> 自第630章生效7年多以來，政府僅批出 <strong>13個牌照</strong> 及 <strong>5份豁免書</strong>，仍有77間申請正在處理中，進度極其緩慢。</li>
              <li><strong>清灰危機：</strong> 若未能符合消防、屋宇署(BD)及補地價要求，最終無法獲牌的龕場必須「清灰」並退款，對營辦商屬毀滅性打擊。</li>
              <li><strong>合規成本高昂：</strong> 市場上許多舊式古廟卡在「無煙化寶爐(環保署)」與「樓面承重結構鞏固(屋宇署)」，前期 A&A 工程動輒千萬起跳。</li>
            </ul>
          </div>
        </div>

        {/* 2. 競爭對手與價格分佈 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200 border-t-4 border-t-amber-600">
          <h2 className="text-lg font-bold text-stone-800 mb-4 flex items-center gap-2">💰 2024 市場定價行情 (私營/政府)</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-stone-50 text-stone-600 font-bold border-b border-stone-200">
                <tr>
                  <th className="py-2 px-3">龕場類型</th>
                  <th className="py-2 px-3">參考價格 (HKD)</th>
                  <th className="py-2 px-3">安放年期/備註</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                <tr className="hover:bg-stone-50">
                  <td className="py-3 px-3 font-bold text-red-800">龍山寺 (粉嶺)</td>
                  <td className="py-3 px-3">$38.9萬 - $500萬+</td>
                  <td className="py-3 px-3 text-xs">使用至2047年，不設退款</td>
                </tr>
                <tr className="hover:bg-stone-50">
                  <td className="py-3 px-3 font-bold">寶福山 (沙田)</td>
                  <td className="py-3 px-3">$20萬 - $25萬起</td>
                  <td className="py-3 px-3 text-xs">輪候1至3年</td>
                </tr>
                <tr className="hover:bg-stone-50">
                  <td className="py-3 px-3 font-bold">思親公園 (沙田)</td>
                  <td className="py-3 px-3">$20萬 - $42萬</td>
                  <td className="py-3 px-3 text-xs">使用至2056年，不可轉讓</td>
                </tr>
                <tr className="hover:bg-stone-50">
                  <td className="py-3 px-3 font-bold text-blue-800">天主教墳場</td>
                  <td className="py-3 px-3">$1.5萬 - $6萬</td>
                  <td className="py-3 px-3 text-xs">限教徒，免輪候</td>
                </tr>
                <tr className="hover:bg-stone-50 bg-stone-100">
                  <td className="py-3 px-3 font-bold text-stone-600">政府骨灰龕</td>
                  <td className="py-3 px-3">$2,400 (首20年)</td>
                  <td className="py-3 px-3 text-xs">續期每10年$1,200 (輪候可達數年)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. 定價戰略分析 (為何我們會贏) */}
        <div className="bg-stone-900 text-stone-300 p-6 rounded-xl shadow-lg lg:col-span-2 border border-stone-800">
          <h2 className="text-xl font-bold text-amber-500 mb-4 border-b border-stone-800 pb-2">🎯 觀塘地藏王古廟：定價優勢與市場空缺 (藍海策略)</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div>
              <h3 className="text-white font-bold mb-2">1. 填補「中產階級斷層」</h3>
              <p className="text-sm leading-relaxed text-stone-400">
                目前市場呈極端兩極化：政府龕位雖便宜 ($2,400) 但一位難求且非永久；而大型合法私營龕場 (如寶福山、思親公園) 門檻高達 <strong>20萬港幣起跳</strong>。我們定價在 <strong>$3.8萬 - $8.8萬</strong>，完美攔截了「等不及政府，但買不起寶福山」的龐大中產剛需。
              </p>
            </div>
            <div>
              <h3 className="text-white font-bold mb-2">2. 市區地段的降維打擊</h3>
              <p className="text-sm leading-relaxed text-stone-400">
                多數大型私營龕場位於新界偏遠地區 (如粉嶺、屯門)。我們座落於九龍東 (觀塘半山)，交通便利度極高。在相同的價格區間內，我們能提供無可比擬的「市區地利」，成為銷售的最強底氣。
              </p>
            </div>
            <div>
              <h3 className="text-white font-bold mb-2">3. 科技賦能的溢價點</h3>
              <p className="text-sm leading-relaxed text-stone-400">
                傳統廟宇極少配備現代化 IT 系統。我們首創的「家屬數位追思門戶」及法事進度追蹤，能大幅提升品牌信任度與專業感。這讓我們有充分理由在 Phase 2 (正式營運期) 將天區/地區的定價上調 15%-20%，依然具備競爭力。
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}