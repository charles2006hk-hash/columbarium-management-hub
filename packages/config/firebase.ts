// packages/config/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getFunctions } from "firebase/functions";
import { getStorage } from "firebase/storage";
// 備註：在 SSR (Server-Side Rendering) 環境下，Analytics 可能會報錯，通常會做環境判斷
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Next.js 開發環境下，避免熱重載 (Hot Reload) 導致重複初始化 App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// 初始化各項服務
const db = getFirestore(app);
const auth = getAuth(app);
const functions = getFunctions(app);
const storage = getStorage(app); // 用於儲存法事回饋圖片

export { app, db, auth, functions, storage };