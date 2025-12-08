# 🔧 Troubleshooting Guide

## ❌ ปัญหา: Retry Limit Exceeded

### สาเหตุ:
- Firebase Storage SDK มีปัญหา timeout เมื่อโหลดไฟล์จำนวนมาก
- ใช้ Firebase Storage SDK โดยตรงจาก frontend

### ✅ วิธีแก้ไข:

#### 1. ใช้ API Server แทน Firebase Storage SDK

**Start API Server:**
```bash
npm run server
```

**ตรวจสอบว่า Server ทำงาน:**
```bash
curl http://localhost:3000/api/health
```

**Expected Response:**
```json
{
  "success": true,
  "status": "ok",
  "timestamp": "..."
}
```

#### 2. ตรวจสอบ Firebase Admin SDK

**ตรวจสอบ service account key:**
```bash
# ตรวจสอบว่าไฟล์มีอยู่
ls -la serviceAccountKey.json

# หรือตรวจสอบ environment variables
echo $FIREBASE_PRIVATE_KEY | head -c 50
```

**ดูคำแนะนำ:**
- `FIREBASE_ADMIN_SETUP.md` - วิธี setup Firebase Admin SDK
- `ENV_CONFIG_COMPLETE.md` - Environment variables

#### 3. ตรวจสอบ Network

**Test API Connection:**
```bash
# Health check
curl http://localhost:3000/api/health

# Get music
curl "http://localhost:3000/api/music?includeUrl=true"
```

---

## 🔍 Debug Steps

### Step 1: ตรวจสอบ API Server

```bash
# 1. ตรวจสอบว่า server ทำงาน
ps aux | grep "node server.js"

# 2. ตรวจสอบ port
lsof -ti:3000

# 3. Start server (ถ้ายังไม่ทำงาน)
npm run server
```

### Step 2: ตรวจสอบ Frontend

**เปิด Browser Console และดู logs:**
```
🎵 เริ่มโหลด playlist จาก API: http://localhost:3000
✅ โหลดเพลงสำเร็จจาก API และเพิ่มเข้า Queue: X ไฟล์
```

**ถ้าเห็น error:**
```
❌ โหลดจาก API ล้มเหลว
💡 กำลังลองใช้ Firebase Storage SDK (อาจมีปัญหา Retry Limit Exceeded)
```

### Step 3: ตรวจสอบ Firebase Admin SDK

**ตรวจสอบ credentials:**
1. Service account key file: `serviceAccountKey.json`
2. Environment variables: `FIREBASE_PRIVATE_KEY`, `FIREBASE_CLIENT_EMAIL`

**ดูคำแนะนำ:**
- `FIREBASE_ADMIN_SETUP.md`

---

## 🚨 Common Issues

### Issue 1: API Server ไม่ทำงาน

**อาการ:**
- Frontend แสดง error: "API server ไม่พร้อมใช้งาน"
- Fallback ไปใช้ Firebase Storage SDK

**วิธีแก้:**
```bash
npm run server
```

### Issue 2: Firebase Admin SDK ไม่ได้ setup

**อาการ:**
- API return `count: 0, files: []`
- ไม่มี error แต่ไม่มีไฟล์

**วิธีแก้:**
1. Setup service account key (ดู `FIREBASE_ADMIN_SETUP.md`)
2. ตรวจสอบ environment variables
3. ตรวจสอบว่า service account มีสิทธิ์เข้าถึง Storage

### Issue 3: CORS Error

**อาการ:**
- Browser console แสดง CORS error
- API ไม่สามารถเรียกได้

**วิธีแก้:**
1. ตรวจสอบ CORS settings ใน `server.js`
2. ตรวจสอบว่า API server รองรับ origin ของ frontend

### Issue 4: Timeout

**อาการ:**
- API timeout หลังจาก 60 วินาที
- ไฟล์จำนวนมากเกินไป

**วิธีแก้:**
1. เพิ่ม timeout ใน `server.js`
2. ใช้ pagination สำหรับไฟล์จำนวนมาก
3. ลดจำนวนไฟล์ในแต่ละ request

---

## 📋 Checklist

- [ ] API Server ทำงานอยู่ (`npm run server`)
- [ ] Health check สำเร็จ (`curl http://localhost:3000/api/health`)
- [ ] Firebase Admin SDK credentials ถูกตั้งค่าแล้ว
- [ ] Service account มีสิทธิ์เข้าถึง Storage
- [ ] Network connection ทำงานปกติ
- [ ] CORS settings ถูกต้อง
- [ ] Frontend ใช้ API (`useAPI = true`)

---

## 🔗 Related Documents

- `RETRY_LIMIT_FIX.md` - วิธีแก้ไข Retry Limit Exceeded
- `API_DOCUMENTATION.md` - API documentation
- `FIREBASE_ADMIN_SETUP.md` - Firebase Admin SDK setup
- `ENV_CONFIG_COMPLETE.md` - Environment variables

---

**ถ้ายังมีปัญหา ให้ตรวจสอบ logs ใน console และ server output** 🔍

