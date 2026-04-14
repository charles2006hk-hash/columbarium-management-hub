// apps/admin/src/app/boss-only/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";

export default function BossFinancialSandbox() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState("");

  // ================= 商業模型參數 =================
  const [requiredCash, setRequiredCash] = useState(15000000); 
  const [interestRate, setInterestRate] = useState(10); 
  const [upfrontYears, setUpfrontYears] = useState(2); 
  
  const [totalInitialCapEx, setTotalInitialCapEx] = useState(8000000); 
  const [avgTabletPrice, setAvgTabletPrice] = useState(68000); 

  const [preSaleMonths, setPreSaleMonths] = useState(6); 
  const [preSaleDiscount, setPreSaleDiscount] = useState(70); 
  const [preSaleMonthlyVolume, setPreSaleMonthlyVolume] = useState(25); 
  
  const [normalMonthlyVolume, setNormalMonthlyVolume] = useState(10); 

  // ================= 動態推演運算 =================
  const upfrontDeductionRate = (interestRate / 100) * upfrontYears; 
  const actualLoanAmount = requiredCash / (1 - upfrontDeductionRate); 
  const upfrontInterestCost = actualLoanAmount - requiredCash; 
  
  // 💡 風險參數：加入 20% 工程超支預備金 (Contingency)
  const capExWithContingency = totalInitialCapEx * 1.2;
  const bufferCash = requiredCash - capExWithContingency; 

  const preSalePrice = avgTabletPrice * (preSaleDiscount / 100);
  const totalPreSaleRevenue = preSaleMonths * preSaleMonthlyVolume * preSalePrice;

  const remainingDebtAfterPreSale = actualLoanAmount - totalPreSaleRevenue;
  const normalMonthlyRevenue = normalMonthlyVolume * avgTabletPrice;
  
  let totalMonthsToBreakeven = 0;
  let breakevenAnalysis = "";

  if (remainingDebtAfterPreSale <= 0) {
    totalMonthsToBreakeven = actualLoanAmount / (preSaleMonthlyVolume * preSalePrice);
    breakevenAnalysis = `極度樂觀：在前期預售階段的第 ${totalMonthsToBreakeven.toFixed(1)} 個月即可完全回本。`;
  } else {
    const normalMonthsNeeded = remainingDebtAfterPreSale / normalMonthlyRevenue;
    totalMonthsToBreakeven = preSaleMonths + normalMonthsNeeded;
    breakevenAnalysis = `需跨入中期：預售期結束後，仍欠 ${(remainingDebtAfterPreSale/10000).toFixed(0)} 萬，需在正式營運期再賣 ${normalMonthsNeeded.toFixed(1)} 個月才能回本。`;
  }

  const isSafe = totalMonthsToBreakeven <= (upfrontYears * 12);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "8888") setIsUnlocked(true);
    else alert("授權失敗");
  };

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center p-6 print:hidden">
        <div className="max-w-md w-full bg-stone-900 p-8 shadow-2xl rounded-xl border border-stone-800">
          <div className="text-center mb-8">
            <span className="text-4xl">🦅</span>
            <h1 className="text-xl font-bold text-stone-300 mt-4 tracking-widest">董事局戰略推演室</h1>
          </div>
          <form onSubmit={handleUnlock} className="space-y-4">
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="輸入最高授權碼" className="w-full bg-stone-950 border border-stone-800 text-stone-300 p-3 text-center tracking-[0.5em] focus:border-amber-600 focus:outline-none" />
            <button className="w-full bg-stone-800 text-stone-400 hover:text-amber-500 hover:border-amber-500 border border-transparent p-3 font-bold tracking-widest transition-colors">授權進入</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-24">
      <div className="flex items-center justify-between border-b border-stone-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">時間矩陣與商業沙盤 (Financial Sandbox)</h1>
          <p className="text-sm text-stone-500 mt-1">分析「前期預售」與「中期營運」的時間變數，對抗高昂資金成本。</p>
        </div>
        <div className="flex gap-3 print:hidden">
          {/* 🌟 前往市場情報頁面的入口 */}
          <Link href="/boss-only/market" className="bg-amber-700 text-white px-4 py-2 rounded-md font-medium shadow-sm hover:bg-amber-800 transition-colors flex items-center gap-2">
            📊 2024-25 市場情報與定價分析
          </Link>
          <button onClick={() => window.print()} className="bg-stone-900 text-white px-4 py-2 rounded-md font-medium shadow-sm hover:bg-stone-800">
            匯出 PDF 報告
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 左側：控制面板 */}
        <div className="lg:col-span-1 space-y-6 print:hidden">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200 border-l-4 border-l-stone-800">
            <h2 className="text-lg font-bold text-stone-800 mb-4">💰 融資與初期投入</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-600">實拿資金需求 ({(requiredCash/10000).toFixed(0)} 萬)</label>
                <input type="range" min="5000000" max="30000000" step="1000000" value={requiredCash} onChange={e => setRequiredCash(Number(e.target.value))} className="w-full mt-2 accent-stone-800" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-600">裝修與牌照總預算 (HKD)</label>
                <input type="number" value={totalInitialCapEx} onChange={e => setTotalInitialCapEx(Number(e.target.value))} className="w-full mt-1 bg-white text-stone-900 border-stone-300 rounded focus:border-stone-500 p-2 border" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-600">年息 (%)</label>
                  <input type="number" value={interestRate} onChange={e => setInterestRate(Number(e.target.value))} className="w-full mt-1 bg-white text-stone-900 border-stone-300 rounded focus:border-stone-500 p-2 border" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-600">預扣年數</label>
                  <input type="number" value={upfrontYears} onChange={e => setUpfrontYears(Number(e.target.value))} className="w-full mt-1 bg-white text-stone-900 border-stone-300 rounded focus:border-stone-500 p-2 border" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200 border-l-4 border-l-amber-500">
            <h2 className="text-lg font-bold text-stone-800 mb-4">⏳ 前期 (預售/工程期) 策略</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-600">預售長度 (月)</label>
                  <input type="number" value={preSaleMonths} onChange={e => setPreSaleMonths(Number(e.target.value))} className="w-full mt-1 bg-amber-50 text-stone-900 border-stone-300 rounded focus:border-amber-500 p-2 border" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-600">早鳥折扣 (%)</label>
                  <input type="number" value={preSaleDiscount} onChange={e => setPreSaleDiscount(Number(e.target.value))} className="w-full mt-1 bg-amber-50 text-stone-900 border-stone-300 rounded focus:border-amber-500 p-2 border" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-600">預計每月去化 (座)</label>
                <input type="number" value={preSaleMonthlyVolume} onChange={e => setPreSaleMonthlyVolume(Number(e.target.value))} className="w-full mt-1 bg-amber-50 text-stone-900 border-stone-300 rounded focus:border-amber-500 p-2 border" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200 border-l-4 border-l-green-600">
            <h2 className="text-lg font-bold text-stone-800 mb-4">📈 中期 (正式營運期) 策略</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-600">恢復原價客單價 (HKD)</label>
                <input type="number" value={avgTabletPrice} onChange={e => setAvgTabletPrice(Number(e.target.value))} className="w-full mt-1 bg-green-50 text-stone-900 border-stone-300 rounded focus:border-green-500 p-2 border" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-600">平穩期每月售出祿位 (座)</label>
                <input type="number" value={normalMonthlyVolume} onChange={e => setNormalMonthlyVolume(Number(e.target.value))} className="w-full mt-1 bg-green-50 text-stone-900 border-stone-300 rounded focus:border-green-500 p-2 border" />
              </div>
            </div>
          </div>
        </div>

        {/* 右側：時間軸與深度分析報告 */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-stone-900 text-white p-4 rounded-xl shadow-lg border-b-4 border-red-500">
              <p className="text-xs text-stone-400 mb-1">名義借貸本金 (欠款)</p>
              <p className="text-xl font-bold">${(actualLoanAmount/10000).toFixed(1)} 萬</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-200">
              <p className="text-xs text-stone-500 mb-1">預售期回籠資金</p>
              <p className="text-xl font-bold text-amber-600">${(totalPreSaleRevenue/10000).toFixed(1)} 萬</p>
            </div>
            <div className={`p-4 rounded-xl shadow-sm border ${isSafe ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <p className={`text-xs mb-1 ${isSafe ? 'text-green-800' : 'text-red-800'}`}>總回本時間 (Breakeven)</p>
              <p className={`text-xl font-bold ${isSafe ? 'text-green-700' : 'text-red-700'}`}>{totalMonthsToBreakeven.toFixed(1)} 個月</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-200">
              <p className="text-xs text-stone-500 mb-1">免息安全期</p>
              <p className="text-xl font-bold text-stone-900">{upfrontYears * 12} 個月</p>
            </div>
          </div>

          <div className="bg-stone-50 p-8 rounded-xl border border-stone-200 prose prose-stone max-w-none">
            <h3 className="text-xl font-bold text-stone-900 border-b border-stone-300 pb-2">⏱️ 時間與現金流深度分析</h3>
            
            <h4 className="text-stone-800 font-bold mt-6">1. 資金池與無牌照風險紅利</h4>
            <p className="text-sm text-stone-600">
              實拿資金 ${(requiredCash/10000).toFixed(0)} 萬。由於本專案採「純祿位不存骨灰」模式，完美避開骨灰龕條例。系統設定的 20% 超支準備金 (總計 ${(capExWithContingency/10000).toFixed(1)} 萬) 僅用於室內裝潢與承重強化。
              扣除後，真實營運週轉金 (Buffer) 剩餘 <strong className={bufferCash >= 0 ? "text-green-600" : "text-red-600"}>${(bufferCash/10000).toFixed(1)} 萬</strong>。
            </p>

            <h4 className="text-stone-800 font-bold mt-6 border-t border-stone-300 pt-4">🎯 終局推演與風險評估</h4>
            
            {/* 🌟 修復的白底黑字區域 */}
            <p className="text-sm font-bold p-4 rounded-lg bg-white border border-stone-200 text-stone-900 shadow-sm">
              {breakevenAnalysis}
            </p>
            
            {isSafe ? (
              <p className="text-sm text-green-700 font-bold mt-3 flex items-center gap-1">
                ✅ 安全：您能夠在 {upfrontYears * 12} 個月的預扣免息期內回本，剩餘的均為淨利潤。
              </p>
            ) : (
              <p className="text-sm text-red-600 font-bold mt-3 flex items-start gap-1">
                <span>⚠️</span> 
                <span>
                  危險：回本期 ({totalMonthsToBreakeven.toFixed(1)} 個月) 超過免息期 ({upfrontYears * 12} 個月)！<br/>
                  必須提高前期折扣、增加行銷力道，或考慮引進第二輪較低息的常規融資 (Refinancing) 替換高利橋貸。
                </span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}