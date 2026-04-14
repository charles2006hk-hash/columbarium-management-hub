"use client";

import { useState } from "react";

export default function BossFinancialSandbox() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState("");

  // ================= 商業模型參數 (可調) =================
  const [requiredCash, setRequiredCash] = useState(15000000); // 目標實拿資金 (HKD)
  const [interestRate, setInterestRate] = useState(10); // 年利率 (%)
  const [upfrontYears, setUpfrontYears] = useState(2); // 預扣年數
  
  const [renoCostPerSqft, setRenoCostPerSqft] = useState(3500); // 裝修單價 (每呎)
  const [areaSqft, setAreaSqft] = useState(3000); // 總面積 (平方呎)
  const [marketingBudget, setMarketingBudget] = useState(2000000); // 初期行銷與牌照費
  
  const [avgTabletPrice, setAvgTabletPrice] = useState(68000); // 平均祿位售價
  const [monthlySales, setMonthlySales] = useState(15); // 預期每月銷售數量

  // ================= 自動計算邏輯 =================
  // 1. 資金計算
  const upfrontDeductionRate = (interestRate / 100) * upfrontYears; // 預扣比例 (如 20%)
  const actualLoanAmount = requiredCash / (1 - upfrontDeductionRate); // 必須借貸的總額
  const upfrontInterestCost = actualLoanAmount - requiredCash; // 被扣掉的利息錢
  
  // 2. 支出計算
  const totalRenoCost = renoCostPerSqft * areaSqft;
  const totalInitialCapEx = totalRenoCost + marketingBudget; // 總初期投入
  const bufferCash = requiredCash - totalInitialCapEx; // 剩餘營運資金 (Buffer)

  // 3. 營收預測與回本 (Breakeven)
  const monthlyRevenue = avgTabletPrice * monthlySales;
  const monthsToBreakeven = actualLoanAmount / monthlyRevenue; // 幾個月能還清本金

  // 密碼解鎖邏輯 (建議設定一個自己記得的密碼，此處預設為 "8888")
  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "8888") {
      setIsUnlocked(true);
    } else {
      alert("密碼錯誤，拒絕存取。");
    }
  };

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center p-6 print:hidden">
        <div className="max-w-md w-full bg-stone-900 p-8 border border-stone-800 shadow-2xl rounded-xl">
          <div className="text-center mb-8">
            <span className="text-4xl">🦅</span>
            <h1 className="text-xl font-bold text-stone-300 mt-4 tracking-widest">董事局戰略推演室</h1>
          </div>
          <form onSubmit={handleUnlock} className="space-y-4">
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="輸入最高授權碼" 
              className="w-full bg-stone-950 border border-stone-800 text-stone-300 p-3 text-center tracking-[0.5em] focus:border-amber-600 focus:outline-none"
            />
            <button className="w-full bg-stone-800 text-stone-400 hover:text-amber-500 hover:border-amber-500 border border-transparent p-3 font-bold tracking-widest transition-colors">
              授權進入
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-24">
      <div className="flex items-center justify-between border-b border-stone-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">商業財務沙盤推演 (Financial Sandbox)</h1>
          <p className="text-sm text-stone-500 mt-1">機密資料。即時試算資金成本、裝修投入與回本週期。</p>
        </div>
        <button onClick={() => window.print()} className="bg-stone-900 text-white px-4 py-2 rounded-md font-medium shadow-sm hover:bg-stone-800 print:hidden">
          匯出 PDF 報告
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 左側：參數調整區 (Control Panel) */}
        <div className="lg:col-span-1 space-y-6 print:hidden">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
            <h2 className="text-lg font-bold text-stone-800 mb-4 flex items-center gap-2">💰 融資條件</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-600">需要實拿資金 (HKD: {(requiredCash/10000).toFixed(0)} 萬)</label>
                <input type="range" min="5000000" max="50000000" step="1000000" value={requiredCash} onChange={e => setRequiredCash(Number(e.target.value))} className="w-full mt-2 accent-amber-600" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-600">年息 (%)</label>
                  <input type="number" value={interestRate} onChange={e => setInterestRate(Number(e.target.value))} className="w-full mt-1 border-stone-300 rounded focus:border-amber-500 p-2 border" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-600">預扣年數</label>
                  <input type="number" value={upfrontYears} onChange={e => setUpfrontYears(Number(e.target.value))} className="w-full mt-1 border-stone-300 rounded focus:border-amber-500 p-2 border" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
            <h2 className="text-lg font-bold text-stone-800 mb-4 flex items-center gap-2">🏗️ 工程與前期投入</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-600">裝修成本估計 ($/呎)</label>
                <input type="number" value={renoCostPerSqft} onChange={e => setRenoCostPerSqft(Number(e.target.value))} className="w-full mt-1 border-stone-300 rounded focus:border-amber-500 p-2 border" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-600">大廳總面積 (平方呎)</label>
                <input type="number" value={areaSqft} onChange={e => setAreaSqft(Number(e.target.value))} className="w-full mt-1 border-stone-300 rounded focus:border-amber-500 p-2 border" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-600">初期行銷/公關/牌照費 ($)</label>
                <input type="number" value={marketingBudget} onChange={e => setMarketingBudget(Number(e.target.value))} className="w-full mt-1 border-stone-300 rounded focus:border-amber-500 p-2 border" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
            <h2 className="text-lg font-bold text-stone-800 mb-4 flex items-center gap-2">📈 銷售預測</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-600">預期平均客單價 (HKD)</label>
                <input type="number" value={avgTabletPrice} onChange={e => setAvgTabletPrice(Number(e.target.value))} className="w-full mt-1 border-stone-300 rounded focus:border-amber-500 p-2 border" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-600">預期每月去化量 (座)</label>
                <input type="number" value={monthlySales} onChange={e => setMonthlySales(Number(e.target.value))} className="w-full mt-1 border-stone-300 rounded focus:border-amber-500 p-2 border" />
              </div>
            </div>
          </div>
        </div>

        {/* 右側：數據儀表板與分析報告 (Report) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 核心財務指標 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-stone-900 text-white p-4 rounded-xl shadow-lg border-b-4 border-amber-500">
              <p className="text-xs text-stone-400 mb-1">名義借貸總額 (欠款)</p>
              <p className="text-xl font-bold">${(actualLoanAmount/10000).toFixed(1)} 萬</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-200">
              <p className="text-xs text-stone-500 mb-1">實際到手資金</p>
              <p className="text-xl font-bold text-green-700">${(requiredCash/10000).toFixed(1)} 萬</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-200">
              <p className="text-xs text-stone-500 mb-1">預扣利息成本 (血虧)</p>
              <p className="text-xl font-bold text-red-600">${(upfrontInterestCost/10000).toFixed(1)} 萬</p>
            </div>
            <div className="bg-amber-50 p-4 rounded-xl shadow-sm border border-amber-200">
              <p className="text-xs text-amber-800 mb-1">預計回本期 (Breakeven)</p>
              <p className="text-xl font-bold text-amber-900">{monthsToBreakeven.toFixed(1)} 個月</p>
            </div>
          </div>

          {/* 資金水位條 */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
            <h3 className="text-lg font-bold text-stone-800 mb-4">實拿資金分配圖</h3>
            <div className="w-full h-8 flex rounded-full overflow-hidden text-xs font-bold text-white text-center">
              <div style={{ width: `${(totalRenoCost / requiredCash) * 100}%` }} className="bg-stone-600 flex items-center justify-center">
                裝修工程 {((totalRenoCost / requiredCash) * 100).toFixed(0)}%
              </div>
              <div style={{ width: `${(marketingBudget / requiredCash) * 100}%` }} className="bg-amber-600 flex items-center justify-center">
                行銷牌照 {((marketingBudget / requiredCash) * 100).toFixed(0)}%
              </div>
              <div style={{ width: `${(bufferCash / requiredCash) * 100}%` }} className="bg-green-600 flex items-center justify-center">
                週轉金 (Buffer) {((bufferCash / requiredCash) * 100).toFixed(0)}%
              </div>
            </div>
            {bufferCash < 0 && <p className="text-red-600 text-sm mt-3 font-bold flex items-center gap-1">⚠️ 警告：實拿資金不足以支付初期工程與行銷費用！缺口：${(Math.abs(bufferCash)/10000).toFixed(1)} 萬</p>}
          </div>

          {/* Deep Research 專業分析報告 */}
          <div className="bg-stone-50 p-8 rounded-xl border border-stone-200 prose prose-stone max-w-none">
            <h3 className="text-xl font-bold text-stone-900 border-b border-stone-300 pb-2">📂 香港私營骨灰龕營運與風險部署書</h3>
            
            <h4 className="text-stone-800 font-bold mt-6">1. 裝修與工程法規 (A&A 部署)</h4>
            <ul className="text-sm text-stone-600">
              <li><strong>防漏工程 (Critical)：</strong> 古廟山坡地容易滲水。必須採取「底層打針 + PU防水膠 + 泥水保護層」標準，預算不低於 $300/呎。一旦骨灰龕受潮發霉，面臨的退款與公關危機將毀滅品牌。</li>
              <li><strong>結構承重 (BD 屋宇署)：</strong> 石碑與龕位牆極重。必須聘請 RSE (註冊結構工程師) 計算樓面活載重 (Live Load)，舊建築極可能需要加裝工字鐵鞏固。</li>
              <li><strong>環保與消防 (FSD & EPD)：</strong> 必須加裝自動撒水系統；若設有化寶爐，需符合《空氣污染管制條例》，安裝無煙水洗過濾系統。</li>
            </ul>

            <h4 className="text-stone-800 font-bold mt-6">2. 資金結構風險警示</h4>
            <ul className="text-sm text-stone-600">
              <li>本次採用 <strong>「{(interestRate)}% 年息，預扣 {upfrontYears} 年」</strong> 的過橋/夾層融資機制。</li>
              <li><strong>致命點：</strong> 表面上是借 {(actualLoanAmount/10000).toFixed(1)} 萬，實際只拿到 {(requiredCash/10000).toFixed(1)} 萬。這意味著您的「真實有效利率 (APR)」遠大於 {interestRate}%。</li>
              <li><strong>破局點：</strong> 必須在 {upfrontYears} 年內 (免息期結束前) 實現 <strong>{(actualLoanAmount/10000).toFixed(0)} 萬</strong> 的現金回籠。按目前設定的客單價 ${avgTabletPrice.toLocaleString()}，前 {upfrontYears} 年必須成功售出 <strong>{Math.ceil(actualLoanAmount / avgTabletPrice)} 座</strong> 才能全身而退。</li>
            </ul>

            <h4 className="text-stone-800 font-bold mt-6">3. 行銷與銷售階段策略 (Marketing Roadmap)</h4>
            <ul className="text-sm text-stone-600">
              <li><strong>Phase 1: 預售籌資期 (0-6個月)</strong> - 裝修施工中。主打「內部認購」，提供 7 折早鳥價，瞄準原有信眾與宗親會，目標在完工前收回 30% 工程款。</li>
              <li><strong>Phase 2: 落成強銷期 (7-12個月)</strong> - 舉行盛大開光法會，邀請風水大師背書。主推高價位的「大堂區、天區」，恢復原價，以稀缺性逼單。</li>
              <li><strong>Phase 3: 渠道分銷期 (第2年起)</strong> - 釋出 B2B 佣金 (15%-25%)，與本地長生店、殮葬商、安老院建立轉介機制，穩定去化。</li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}