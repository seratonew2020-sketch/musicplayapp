# 🚀 คู่มือตั้งค่า CORS สำหรับ Firebase Storage

## ⚠️ สถานะปัจจุบัน
- gsutil: ❌ ยังไม่ได้ติดตั้ง
- CORS: ❌ ยังไม่ได้ตั้งค่า

---

## วิธีที่ 1: ใช้ Google Cloud Console (แนะนำ - ง่ายที่สุด) ⭐

### ขั้นตอน:

1. **เปิดลิงก์นี้**:
   ```
   https://console.cloud.google.com/storage/browser/musicplay-d9231.appspot.com?project=musicplay-d9231
   ```

2. **คลิกที่ bucket**: `musicplay-d9231.appspot.com`

3. **ไปที่แท็บ "Configuration"** (ด้านบน)

4. **คลิก "CORS"** (ในเมนูด้านซ้าย)

5. **คลิก "Edit"** (ปุ่มด้านบน)

6. **ลบเนื้อหาเก่า** (ถ้ามี) และ **วางโค้ดนี้**:
   ```json
   [
     {
       "origin": ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000", "http://127.0.0.1:5173"],
       "method": ["GET", "HEAD", "OPTIONS"],
       "responseHeader": ["Content-Type", "Authorization", "x-goog-resumable"],
       "maxAgeSeconds": 3600
     }
   ]
   ```

7. **คลิก "Save"**

8. **รอ 1-2 นาที** แล้วรีเฟรช browser

---

## วิธีที่ 2: ติดตั้ง gsutil แล้วใช้สคริปต์

### ติดตั้ง Google Cloud SDK:

```bash
# macOS (ใช้ Homebrew)
brew install google-cloud-sdk

# หรือดาวน์โหลดจาก
# https://cloud.google.com/sdk/docs/install
```

### หลังจากติดตั้งแล้ว:

```bash
# Login
gcloud auth login

# ตั้งค่า project
gcloud config set project musicplay-d9231

# รันสคริปต์
./setup-cors.sh
```

---

## วิธีที่ 3: ใช้ gsutil แบบ manual

```bash
# หลังจากติดตั้ง gsutil แล้ว
gsutil cors set cors.json gs://musicplay-d9231.appspot.com

# ตรวจสอบ
gsutil cors get gs://musicplay-d9231.appspot.com
```

---

## 📋 CORS Configuration

ไฟล์ `cors.json` มีเนื้อหาดังนี้:

```json
[
  {
    "origin": ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000", "http://127.0.0.1:5173"],
    "method": ["GET", "HEAD", "OPTIONS"],
    "responseHeader": ["Content-Type", "Authorization", "x-goog-resumable"],
    "maxAgeSeconds": 3600
  }
]
```

---

## ✅ ตรวจสอบว่า CORS ตั้งค่าแล้ว

### หลังจากตั้งค่า CORS:

1. **รอ 1-2 นาที** (ให้ CORS propagate)

2. **Clear browser cache**:
   - Mac: `Cmd+Shift+R`
   - Windows: `Ctrl+Shift+R`

3. **รีเฟรชหน้า**: http://localhost:5173/

4. **ตรวจสอบ Console**:
   - ไม่ควรมี CORS error
   - ควรเห็น "✅ listAll สำเร็จ"

5. **ตรวจสอบ Network Tab**:
   - OPTIONS request ควรได้ status 200 OK
   - ไม่ควรมี CORS error

---

## 🔍 Troubleshooting

### ถ้ายังมี CORS error:

1. **ตรวจสอบว่า CORS ตั้งค่าแล้วจริงๆ**:
   - ไปที่ Google Cloud Console → Storage → Bucket → Configuration → CORS
   - ตรวจสอบว่า config ถูกต้อง

2. **ลองใช้ incognito/private window**

3. **ตรวจสอบว่า origin ถูกต้อง**:
   - ต้องตรงกับ URL ที่ใช้ (http://localhost:5173)

4. **รอให้ CORS propagate**:
   - อาจใช้เวลา 2-5 นาที

---

## 📝 หมายเหตุ

- CORS ต้องตั้งค่าใน **Google Cloud Storage** (ไม่ใช่ Firebase Console)
- Firebase Storage ใช้ Google Cloud Storage bucket ด้านหลัง
- CORS config จะใช้เวลา propagate ประมาณ 1-2 นาที
- หลังจากตั้งค่าแล้ว ต้อง clear browser cache

---

## 🎯 Quick Link

**Google Cloud Console - Storage Bucket**:
https://console.cloud.google.com/storage/browser/musicplay-d9231.appspot.com?project=musicplay-d9231

