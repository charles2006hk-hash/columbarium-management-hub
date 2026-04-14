// apps/admin/src/app/orders/ContractPrintView.tsx
"use client";

import React from "react";

interface ContractProps {
  order: any;
}

export default function ContractPrintView({ order }: ContractProps) {
  if (!order) return null;

  const orderDate = order.createdAt?.toDate ? order.createdAt.toDate() : new Date();
  const dateString = new Intl.DateTimeFormat('zh-HK', { 
    year: 'numeric', month: 'long', day: 'numeric' 
  }).format(orderDate);

  return (
    // 移除了 hidden，加上 shadow-xl 讓預覽時有實體紙張感，列印時(print:)則取消陰影與圓角
    <div className="bg-white text-black p-10 sm:p-12 w-full max-w-[210mm] mx-auto text-sm leading-relaxed font-serif shadow-2xl print:shadow-none print:p-0">
      
      <div className="text-center border-b-2 border-black pb-6 mb-8 mt-4">
        <h1 className="text-3xl font-bold tracking-widest mb-2">觀塘地藏王古廟</h1>
        <h2 className="text-xl tracking-wider">祿位使用協議書 (存根聯)</h2>
      </div>

      <div className="flex justify-between mb-8">
        <p><strong>合約編號：</strong> {order.orderNo || order.id}</p>
        <p><strong>登記日期：</strong> {dateString}</p>
      </div>

      <div className="border border-black p-6 mb-8 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <p><strong>登記人姓名 (甲方)：</strong> {order.customerName}</p>
          <p><strong>聯絡電話：</strong> {order.customerPhone || "未提供"}</p>
          <p className="col-span-2"><strong>獲編配祿位編號：</strong> <span className="text-lg font-bold border-b border-black pb-1 px-2">{order.tabletId}</span></p>
          <p><strong>協議款項總額：</strong> HKD ${order.amount?.toLocaleString()}</p>
          <p><strong>付款狀態：</strong> {order.status === 'paid' ? '已全數結清' : '待付款'}</p>
        </div>
      </div>

      <div className="mb-12">
        <h3 className="font-bold mb-3 border-b border-gray-400 pb-1">協議條款：</h3>
        <ol className="list-decimal pl-5 space-y-2 text-xs text-justify">
          <li>甲方確認並同意支付上述款項以獲得該指定祿位之使用權。</li>
          <li>此祿位僅供奉核准之先人牌位，不得轉讓或作其他商業用途。</li>
          <li>觀塘地藏王古廟（乙方）將負責日常之香火供奉及場地清潔維護。</li>
          <li>如遇不可抗力之因素導致場地變更，乙方將盡力協調並妥善安置，甲方不得異議。</li>
        </ol>
      </div>

      <div className="flex justify-between mt-24 pt-8 border-t-2 border-black border-dashed px-10">
        <div className="text-center w-40">
          <div className="border-b border-black h-12 mb-2"></div>
          <p>登記人 (甲方) 簽署</p>
        </div>
        <div className="text-center w-40">
          <div className="border-b border-black h-12 mb-2 relative">
             <span className="absolute inset-0 flex items-center justify-center text-red-500 opacity-30 transform -rotate-12 text-2xl font-bold tracking-widest border-2 border-red-500 rounded-full w-24 h-24 m-auto">古廟寶印</span>
          </div>
          <p>古廟代表 (乙方) 蓋章</p>
        </div>
      </div>
    </div>
  );
}