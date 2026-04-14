// apps/admin/src/app/services/page.tsx
"use client";

import { useState, useEffect } from "react";
import { collection, addDoc, getDocs, updateDoc, doc, query, orderBy, where, getDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
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
const storage = getStorage(app);

// 🛠️ 前端圖片壓縮函式 (目標約 130KB)
const compressImage = (file: File): Promise<Blob> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800; // 限制最大寬度以縮小檔案
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        // 設定 JPEG 品質為 0.7，通常能將照片壓到 100~150KB 左右
        canvas.toBlob((blob) => resolve(blob as Blob), 'image/jpeg', 0.7);
      };
    };
  });
};

export default function ServicesPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  
  // 智慧搜尋相關狀態
  const [soldTablets, setSoldTablets] = useState<any[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // 動態服務項目
  const [serviceTypes, setServiceTypes] = useState<string[]>(["預設法事"]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ tabletId: "", type: "", scheduledDate: "" });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. 讀取系統設定的服務項目
        const settingSnap = await getDoc(doc(db, "settings", "general"));
        if (settingSnap.exists() && settingSnap.data().serviceTypes) {
          const types = settingSnap.data().serviceTypes;
          setServiceTypes(types);
          setFormData(prev => ({ ...prev, type: types[0] })); // 預設選第一個
        }

        // 2. 讀取真實排程
        const qTasks = query(collection(db, "services"), orderBy("createdAt", "desc"));
        const snapshotTasks = await getDocs(qTasks);
        setTasks(snapshotTasks.docs.map(doc => ({ dbId: doc.id, ...doc.data() })));

        // 3. 讀取所有已售出的祿位，供智慧搜尋
        const qTablets = query(collection(db, "tablets"), where("status", "==", "sold"));
        const snapshotTablets = await getDocs(qTablets);
        setSoldTablets(snapshotTablets.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        
      } catch (err) {
        console.error("資料讀取失敗:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 建立新派單
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "services"), {
        taskId: `SRV-${Date.now().toString().slice(-6)}`,
        tabletId: formData.tabletId,
        type: formData.type,
        scheduledDate: formData.scheduledDate,
        status: "pending",
        imageUrls: [], // 支援多圖陣列
        createdAt: new Date(),
      });
      setIsModalOpen(false);
      setFormData({ tabletId: "", type: serviceTypes[0], scheduledDate: "" });
      
      // 重新讀取任務列表
      const qTasks = query(collection(db, "services"), orderBy("createdAt", "desc"));
      const snapshotTasks = await getDocs(qTasks);
      setTasks(snapshotTasks.docs.map(doc => ({ dbId: doc.id, ...doc.data() })));
      alert("法事排程建立成功！");
    } catch (err) {
      console.error("建立排程失敗:", err);
    }
  };

  // 多圖上傳與壓縮
  const handleMultipleFilesUpload = async (task: any, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    if (files.length > 5) {
      alert("每次最多只能上傳 5 張照片！");
      return;
    }

    setUploadingId(task.dbId);
    try {
      const uploadedUrls: string[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        // 1. 壓縮圖片
        const compressedBlob = await compressImage(file);
        // 2. 上傳至 Storage
        const storageRef = ref(storage, `services/${task.taskId}-${Date.now()}-${i}.jpg`);
        await uploadBytes(storageRef, compressedBlob);
        const downloadURL = await getDownloadURL(storageRef);
        uploadedUrls.push(downloadURL);
      }
      
      // 3. 寫入資料庫
      const taskRef = doc(db, "services", task.dbId);
      await updateDoc(taskRef, {
        status: "completed",
        imageUrls: uploadedUrls, // 存入多張照片網址
        completedAt: new Date(),
      });

      // 更新畫面
      setTasks(prev => prev.map(t => 
        t.dbId === task.dbId ? { ...t, status: 'completed', imageUrls: uploadedUrls } : t
      ));
      alert("法事照片上傳成功，任務已結案！");
    } catch (error) {
      console.error("上傳失敗:", error);
      alert("上傳失敗請重試");
    } finally {
      setUploadingId(null);
    }
  };

  // 智慧搜尋的過濾邏輯：可搜編號，也可搜姓名
  const filteredOptions = soldTablets.filter(tablet => 
    tablet.id.toLowerCase().includes(formData.tabletId.toLowerCase()) || 
    (tablet.ownerName && tablet.ownerName.toLowerCase().includes(formData.tabletId.toLowerCase()))
  ).slice(0, 5);

  return (
    <div className="space-y-6 relative">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">法事與服務紀錄</h1>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-amber-700 text-white px-4 py-2 rounded-md font-medium hover:bg-amber-800 transition shadow-sm"
        >
          + 新增法事排程
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-stone-500">載入排程中...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <div key={task.dbId} className="bg-white p-6 rounded-xl shadow-sm border border-stone-200 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-xs font-bold text-stone-400">{task.taskId}</span>
                  <h3 className="text-lg font-bold text-amber-900 mt-1">{task.tabletId}</h3>
                </div>
                <span className={`px-2 py-1 text-xs font-bold rounded-md ${task.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {task.status === 'completed' ? '已完成' : '待執行'}
                </span>
              </div>
              
              <div className="text-sm text-stone-600 space-y-1 mb-4">
                <p><strong>服務項目：</strong> {task.type}</p>
                <p><strong>預定日期：</strong> {task.scheduledDate || '未指定'}</p>
              </div>
              
              {/* 多圖 / 單圖 兼容展示區 */}
              {task.imageUrls && task.imageUrls.length > 0 ? (
                <div className="mb-4 grid grid-cols-2 gap-2">
                  {task.imageUrls.map((url: string, idx: number) => (
                    <img key={idx} src={url} alt={`照片 ${idx+1}`} className="w-full h-24 object-cover rounded border border-stone-200" />
                  ))}
                </div>
              ) : task.imageUrl ? (
                <div className="mb-4 rounded-md overflow-hidden border border-stone-200">
                  <img src={task.imageUrl} alt="法事紀錄" className="w-full h-40 object-cover" />
                </div>
              ) : null}
              
              <div className="mt-auto pt-4 border-t border-stone-100 relative">
                {uploadingId === task.dbId ? (
                  <div className="w-full text-center py-2 text-sm text-stone-500 font-medium animate-pulse">壓縮並上傳中...</div>
                ) : (
                  <label className="cursor-pointer w-full flex items-center justify-center bg-stone-50 text-stone-700 py-2 rounded-md text-sm font-medium hover:bg-stone-100 transition border border-dashed border-stone-300">
                    {task.imageUrls?.length > 0 || task.imageUrl ? '📸 重新上傳照片' : '📸 上傳照片 (最多5張)'}
                    <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleMultipleFilesUpload(task, e)} />
                  </label>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 🔴 已修復 z-index 與背景點擊的 Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-2xl overflow-visible relative z-10">
            <h2 className="text-xl font-bold mb-6 text-stone-800">建立新法事排程</h2>
            <form onSubmit={handleCreateTask} className="space-y-4">
              
              {/* 智慧搜尋框 (Autocomplete) */}
              <div className="relative">
                <label className="block text-sm font-medium text-stone-700">目標祿位 (可輸入編號或客戶姓名)</label>
                <input 
                  required 
                  type="text" 
                  value={formData.tabletId} 
                  autoComplete="off"
                  onChange={e => {
                    setFormData({...formData, tabletId: e.target.value});
                    setIsDropdownOpen(true);
                  }}
                  onFocus={() => setIsDropdownOpen(true)}
                  onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
                  className="mt-1 w-full rounded-md border-stone-300 shadow-sm focus:border-amber-500" 
                  placeholder="例如: L1-101 或 王大明"
                />
                
                {/* 彈出下拉選單 */}
                {isDropdownOpen && formData.tabletId && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-stone-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                    {filteredOptions.length > 0 ? (
                      filteredOptions.map(opt => (
                        <div 
                          key={opt.id}
                          className="px-4 py-2 hover:bg-amber-50 cursor-pointer text-sm flex justify-between"
                          onClick={() => {
                            setFormData({...formData, tabletId: opt.id});
                            setIsDropdownOpen(false);
                          }}
                        >
                          <span className="font-bold text-amber-900">{opt.id}</span>
                          <span className="text-stone-500">{opt.ownerName}</span>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-sm text-stone-500">找不到符合的已售祿位</div>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700">服務項目</label>
                <select 
                  value={formData.type} 
                  onChange={e => setFormData({...formData, type: e.target.value})}
                  className="mt-1 w-full rounded-md border-stone-300 shadow-sm focus:border-amber-500"
                >
                  {serviceTypes.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700">預定執行日期</label>
                <input 
                  required 
                  type="date" 
                  value={formData.scheduledDate} 
                  onChange={e => setFormData({...formData, scheduledDate: e.target.value})} 
                  className="mt-1 w-full rounded-md border-stone-300 shadow-sm focus:border-amber-500" 
                />
              </div>
              <div className="flex justify-end gap-3 mt-8 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-md">取消</button>
                <button type="submit" className="bg-amber-700 text-white px-6 py-2 rounded-md font-bold hover:bg-amber-800">確認派單</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}