// scripts/seed-tablets.js
const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json");

// 初始化 Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// 根據平面圖解析出來的區塊邏輯
const zonesConfig = [
  {
    zoneName: "大堂區",
    prefix: "L",
    blocks: [
      { id: "L1", startCol: 1, endCol: 13, rows: 13 },
      { id: "L2", startCol: 14, endCol: 20, rows: 13 },
      { id: "L3", startCol: 21, endCol: 27, rows: 13 },
      { id: "L4", startCol: 28, endCol: 34, rows: 13 },
      { id: "L5", startCol: 35, endCol: 41, rows: 13 },
      { id: "L6", startCol: 42, endCol: 48, rows: 13 },
      { id: "L7", startCol: 49, endCol: 55, rows: 13 },
    ],
  },
  {
    zoneName: "天區",
    prefix: "A",
    blocks: [
      { id: "A1", startCol: 1, endCol: 15, rows: 13 },
      { id: "A2", startCol: 16, endCol: 29, rows: 13 },
      { id: "A3", startCol: 30, endCol: 45, rows: 13 },
      { id: "A4", startCol: 46, endCol: 74, rows: 13 },
      { id: "A5", startCol: 75, endCol: 80, rows: 13 },
      { id: "A6", startCol: 81, endCol: 117, rows: 13 },
      { id: "A7", startCol: 118, endCol: 123, rows: 13 },
      { id: "A8", startCol: 124, endCol: 213, rows: 13 },
      { id: "A9", startCol: 214, endCol: 219, rows: 13 },
      { id: "A10", startCol: 220, endCol: 267, rows: 13 },
    ],
  },
  {
    zoneName: "地區",
    prefix: "B",
    blocks: [
      { id: "B1", startCol: 1, endCol: 48, rows: 13 },
      { id: "B2", startCol: 49, endCol: 54, rows: 13 },
      { id: "B3", startCol: 55, endCol: 76, rows: 13 },
      { id: "B4", startCol: 77, endCol: 82, rows: 13 },
      { id: "B5", startCol: 83, endCol: 130, rows: 13 },
    ],
  },
  {
    zoneName: "玄區",
    prefix: "C",
    blocks: [
      { id: "C1", startCol: 1, endCol: 48, rows: 13 },
      { id: "C2", startCol: 49, endCol: 54, rows: 13 },
      { id: "C3", startCol: 55, endCol: 75, rows: 13 },
      { id: "C4", startCol: 76, endCol: 81, rows: 13 },
      { id: "C5", startCol: 82, endCol: 106, rows: 13 },
      { id: "C6", startCol: 107, endCol: 133, rows: 13 },
    ],
  },
  {
    zoneName: "宇區",
    prefix: "D",
    blocks: [
      { id: "D1", startCol: 1, endCol: 33, rows: 10 },
      { id: "D2", startCol: 34, endCol: 39, rows: 10 },
      { id: "D3", startCol: 40, endCol: 59, rows: 10 },
      { id: "D4", startCol: 60, endCol: 65, rows: 10 },
      { id: "D5", startCol: 66, endCol: 106, rows: 10 },
    ],
  },
  {
    zoneName: "宙區",
    prefix: "E",
    blocks: [
      { id: "E1", startCol: 1, endCol: 33, rows: 10 },
      { id: "E2", startCol: 34, endCol: 39, rows: 10 },
      { id: "E3", startCol: 40, endCol: 65, rows: 10 },
      { id: "E4", startCol: 66, endCol: 71, rows: 10 },
      { id: "E5", startCol: 72, endCol: 104, rows: 10 },
    ],
  },
];

async function seedTablets() {
  console.log("開始生成牌位資料...");
  const tablets = [];

  // 生成所有牌位的 JSON 資料
  zonesConfig.forEach((zone) => {
    zone.blocks.forEach((block) => {
      for (let col = block.startCol; col <= block.endCol; col++) {
        for (let row = 1; row <= block.rows; row++) {
          // 格式化數字：行數固定為兩位數，例如 col 1, row 1 -> 101
          const rowStr = row.toString().padStart(2, "0");
          const tabletNumber = `${col}${rowStr}`;
          const tabletId = `${block.id}-${tabletNumber}`; // 最終 ID 如 L1-101

          tablets.push({
            id: tabletId,
            locationId: "kwun_tong_temple", // 預留未來擴展國內龕位
            zone: zone.zoneName,
            block: block.id,
            number: tabletNumber,
            col: col,
            row: row,
            status: "available", // 初始狀態皆為可售空位
            price: 0, // 價格需視乎特、甲、乙等定價後續批次更新
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
          });
        }
      }
    });
  });

  console.log(`共計產生 ${tablets.length} 筆牌位資料，準備寫入 Firestore...`);

  // Firestore 批次寫入 (每批最多 500 筆)
  const BATCH_SIZE = 500;
  let batchCount = 0;

  for (let i = 0; i < tablets.length; i += BATCH_SIZE) {
    const batch = db.batch();
    const chunk = tablets.slice(i, i + BATCH_SIZE);

    chunk.forEach((tablet) => {
      const docRef = db.collection("tablets").doc(tablet.id);
      batch.set(docRef, tablet);
    });

    await batch.commit();
    batchCount++;
    console.log(`✅ 已成功寫入第 ${batchCount} 批 (${chunk.length} 筆)`);
  }

  console.log("🎉 所有牌位資料匯入完成！");
}

seedTablets().catch(console.error);