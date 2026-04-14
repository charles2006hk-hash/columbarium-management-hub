// apps/admin/src/app/login/page.tsx
"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@repo/config/firebase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoggingIn(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // 成功後 AuthContext 會自動攔截並導向首頁 "/"
    } catch (err: any) {
      console.error("Login failed:", err);
      setError("登入失敗，請檢查電郵或密碼是否正確。");
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-100">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-stone-800">藏霞精舍</h1>
          <p className="mt-2 text-sm text-stone-500">內部系統登入</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-stone-700">員工電郵</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 placeholder-stone-400 focus:border-amber-500 focus:outline-none focus:ring-amber-500 sm:text-sm"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700">密碼</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 placeholder-stone-400 focus:border-amber-500 focus:outline-none focus:ring-amber-500 sm:text-sm"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={isLoggingIn}
            className="flex w-full justify-center rounded-md border border-transparent bg-amber-700 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:bg-amber-400"
          >
            {isLoggingIn ? "登入中..." : "登入"}
          </button>
        </form>
      </div>
    </div>
  );
}