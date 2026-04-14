// apps/admin/src/app/services/page.tsx
"use client";

import { useState, useEffect } from "react";
import { collection, addDoc, getDocs, updateDoc, doc, query, orderBy, where } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAdU0mra6pXm4jvpHc3XVc68RMcE_n1Q2I",
  authDomain: "columbarium-hub-2026.firebaseapp.com",
  projectId: "columbarium-hub-2026",
  storageBucket: "columbarium-hub-2026.firebasestorage.app",
};
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const storage = getStorage(app);

export default function ServicesPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  
  // 💡 新增：用來存放所有「已售出」的祿位資料，供智慧搜尋使用
  const [soldTablets, setSoldTablets] = useState<any[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ tabletId: "", type: "初一十五供奉", scheduledDate: "" });

  const serviceTypes = ["初一十五供奉", "週年法事", "百日追思", "清明祭祀", "重陽秋祭", "其他專屬法事"];

  // 讀取真實排程
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "services"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      setTasks(snapshot.docs.map(doc => ({ dbId: doc.id, ...doc.data() })));
    } catch (err) {
      console.error("讀取法事排程失敗:", err);
    } finally {
      setLoading(false);
    }
  };

  // 💡 讀取所有已售出的祿位，供建單時搜尋
  const fetchSoldTablets = async () => {
    try {
      const q = query(collection(db, "tablets"), where("status", "==", "sold"));
      const snapshot = await getDocs(q);
      setSoldTablets(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error("讀取已售祿位失敗:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchSoldTablets();
  }, []);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "services"), {
        taskId: `SRV-${Date.now().toString().slice(-6)}`,
        tabletId: formData.tabletId,
        type: formData.type,
        scheduledDate: formData.scheduledDate,
        status: "pending",
        imageUrl: "",
        createdAt: new Date(),
      });
      setIsModalOpen(false);
      setFormData({ tabletId: "", type: "初一十五供奉", scheduledDate: "" });
      fetchTasks();
      alert("法事排程建立成功！");
    } catch (err) {
      console.error("建立排程失敗:", err);
    }
  };

  const handleFileUpload = async (task: any, e: React.ChangeEvent<HTMLInputElement>) => {
    // ... (保留原本的上傳邏輯，與之前完全相同)
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingId(task.dbId);
    try {
      const storageRef = ref(storage, `services/${task.taskId}-${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      
      const taskRef = doc(db, "services", task.dbId);
      await updateDoc(taskRef, {
        status: "completed",
        imageUrl: downloadURL,
        completedAt: new Date(),
      });

      setTasks(prev => prev.map(t => 
        t.dbId === task.dbId ? { ...t, status: 'completed', imageUrl: downloadURL } : t
      ));
      alert("法事照片上傳成功，任務已結案！");
    } catch (error) {
      console.error("上傳失敗:", error);
    } finally {
      setUploadingId(null);
    }
  };

  // 💡 智慧搜尋的過濾邏輯：可搜編號，也可搜姓名
  const filteredOptions = soldTablets.filter(tablet => 
    tablet.id.toLowerCase().includes(formData.tabletId.toLowerCase()) || 
    (tablet.ownerName && tablet.ownerName.toLowerCase().includes(formData.tabletId.toLowerCase()))
  ).slice(0, 5); // 最多只顯示 5 筆建議，避免畫面太長

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

      {/* 任務列表卡片... (保持不變) */}
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
              
              {task.imageUrl && (
                <div className="mb-4 rounded-md overflow-hidden border border-stone-200">
                  <img src={task.imageUrl} alt="法事紀錄" className="w-full h-40 object-cover" />
                </div>
              )}
              
              <div className="mt-auto pt-4 border-t border-stone-100 relative">
                {uploadingId === task.dbId ? (
                  <div className="w-full text-center py-2 text-sm text-stone-500 font-medium animate-pulse">上傳中...</div>
                ) : (
                  <label className="cursor-pointer w-full flex items-center justify-center bg-stone-50 text-stone-700 py-2 rounded-md text-sm font-medium hover:bg-stone-100 transition border border-dashed border-stone-300">
                    {task.imageUrl ? '📸 重新上傳照片' : '📸 上傳法事照片'}
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(task, e)} />
                  </label>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ===== 新增排程 Modal ===== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-2xl overflow-visible">
            <h2 className="text-xl font-bold mb-6 text-stone-800">建立新法事排程</h2>
            <form onSubmit={handleCreateTask} className="space-y-4">
              
              {/* 💡 智慧搜尋框 (Autocomplete) */}
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
                  onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)} // 延遲關閉，避免點不到清單
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