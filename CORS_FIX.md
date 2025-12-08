# 🔧 แก้ไข CORS Error สำหรับ Firebase Storage

## ปัญหา
```
Access to XMLHttpRequest at 'https://firebasestorage.googleapis.com/v0/b/musicplay-d9231.appspot.com/...' 
from origin 'http://localhost:5173' has been blocked by CORS policy
```

## สาเหตุ
Firebase Storage bucket ยังไม่ได้ตั้งค่า CORS สำหรับ localhost ทำให้ browser block การเรียก API

## วิธีแก้ไข

### วิธีที่ 1: ใช้สคริปต์อัตโนมัติ (ง่ายที่สุด) ⭐

รันสคริปต์ที่สร้างไว้แล้ว:
```bash
./setup-cors.sh
```

สคริปต์จะ:
- ตรวจสอบว่า gsutil ติดตั้งแล้วหรือยัง
- Login Google Cloud (ถ้ายังไม่ได้ login)
- ตั้งค่า CORS อัตโนมัติ
- แสดงผลการตั้งค่า

### วิธีที่ 2: ใช้ gsutil แบบ manual

1. **ติดตั้ง Google Cloud SDK** (ถ้ายังไม่มี):
   ```bash
   # macOS
   brew install google-cloud-sdk
   
   # หรือดาวน์โหลดจาก: https://cloud.google.com/sdk/docs/install
   ```

2. **Login และตั้งค่า project**:
   ```bash
   gcloud auth login
   gcloud config set project musicplay-d9231
   ```

3. **Apply CORS configuration**:
   ```bash
   gsutil cors set cors.json gs://musicplay-d9231.appspot.com
   ```

4. **ตรวจสอบว่า CORS ถูกตั้งค่าแล้ว**:
   ```bash
   gsutil cors get gs://musicplay-d9231.appspot.com
   ```

### วิธีที่ 2: ใช้ Google Cloud Console

1. ไปที่ [Google Cloud Console](https://console.cloud.google.com/storage/browser?project=musicplay-d9231)
2. เลือก bucket `musicplay-d9231.appspot.com`
3. ไปที่แท็บ **"Configuration"** → **"CORS"**
4. คลิก **"Edit"** และวาง CORS configuration:
   ```json
   [
     {
       "origin": ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],
       "method": ["GET", "HEAD", "OPTIONS"],
       "responseHeader": ["Content-Type", "Authorization", "x-goog-resumable"],
       "maxAgeSeconds": 3600
     }
   ]
   ```
5. คลิก **"Save"**

### วิธีที่ 3: ใช้ Firebase CLI (ถ้าใช้ firebasestorage.app)

ถ้าใช้ bucket ใหม่ (`firebasestorage.app`), อาจต้องตั้งค่า CORS ผ่าน Google Cloud Console เท่านั้น

## ตรวจสอบ

หลังจากตั้งค่า CORS แล้ว:
1. รีเฟรช browser (Ctrl+Shift+R หรือ Cmd+Shift+R)
2. ลองโหลดไฟล์อีกครั้ง
3. ตรวจสอบ Console ว่าไม่มี CORS error

## หมายเหตุ

- CORS configuration จะใช้เวลาสักครู่ในการ propagate (ประมาณ 1-2 นาที)
- ถ้ายังมีปัญหา ลอง clear browser cache
- สำหรับ production, ควรเพิ่ม production domain ใน CORS config

