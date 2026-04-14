// apps/admin/src/context/AuthContext.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";

// 建立一個簡單的 Context
const AuthContext = createContext<any>({ user: null, loading: false });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // 強制設定為已登入狀態，跳過 Firebase 驗證
  const [user] = useState({ 
    email: "admin@dev-mode.com", 
    uid: "dev-user-001",
    role: "admin" // 💡 加上角色：'admin' 或是 'staff'
  });
  const [loading] = useState(false);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);