// apps/admin/src/app/settings/page.tsx
"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function SettingsPage() {
  const { user } = useAuth();
  
  // 模擬系統使用者名單
  const [staffList] = useState([
    { id: 1, name: "系統管理員 (Admin)", email: "admin@dev-mode.com", role: "admin", status: "active" },
    { id: 2, name: "前台客服 (Staff)", email: "staff@test.com", role: "staff", status: "active" },
    { id: 3, name: "法事師傅 (Master)", email: "master@test.com", role: "staff", status: "inactive" },
  ]);

  if (user?.role !== "admin") {
    return (
      <div className="flex h-[60vh] items-center justify-center flex-col gap-4">
        <span className="text-6xl">🔒</span>
        <h1 className="text-2xl font-bold text-stone-800">權限不足</h1>
        <p className="text-stone-500">只有系統管理員 (Admin) 可以存取設定頁面。</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">系統設定與權限</h1>
        <p className="text-sm text-stone-500 mt-1">管理員專屬控制台，可調整系統參數與員工權限。</p>
      </div>

      {/* 區塊 1：員工權限管理 */}
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

      {/* 區塊 2：系統通用參數 */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
        <h2 className="text-lg font-bold text-stone-800 mb-4">祿位定價參數設定</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-stone-700">大堂區 預設價格 (HKD)</label>
            <input type="number" defaultValue={58000} className="mt-1 w-full rounded-md border-stone-300 shadow-sm focus:border-amber-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700">天區 預設價格 (HKD)</label>
            <input type="number" defaultValue={88000} className="mt-1 w-full rounded-md border-stone-300 shadow-sm focus:border-amber-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700">地區 預設價格 (HKD)</label>
            <input type="number" defaultValue={68000} className="mt-1 w-full rounded-md border-stone-300 shadow-sm focus:border-amber-500" />
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button className="bg-stone-800 text-white px-6 py-2 rounded-md font-bold hover:bg-stone-700">
            儲存參數
          </button>
        </div>
      </div>

    </div>
  );
}