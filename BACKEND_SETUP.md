# 🚀 Backend Setup Guide

## 📋 Dependencies ที่จำเป็น

### Core Dependencies:
- ✅ `express` - Web framework สำหรับ API server
- ✅ `cors` - CORS middleware
- ✅ `firebase-admin` - Firebase Admin SDK (server-side)
- ✅ `dotenv` - Environment variables management

### Frontend Dependencies:
- ✅ `axios` - HTTP client
- ✅ `firebase` - Firebase Client SDK

---

## 🔧 การติดตั้ง

### 1. ติดตั้ง Dependencies

```bash
npm install express cors firebase-admin dotenv
```

### 2. ตรวจสอบการติดตั้ง

```bash
npm list express cors firebase-admin dotenv
```

**Expected Output:**
```
musicplayapp-1@0.0.0
├── cors@2.8.5
├── express@4.22.1
├── firebase-admin@13.6.0
└── dotenv@17.2.3
```

---

## ⚙️ Configuration

### 1. Firebase Admin SDK Setup

#### วิธีที่ 1: ใช้ Service Account Key File

**Download Service Account Key:**
1. ไปที่ [Firebase Console](https://console.firebase.google.com/project/musicplay-d9231/settings/serviceaccounts/adminsdk)
2. คลิก "Generate new private key"
3. บันทึกไฟล์เป็น `serviceAccountKey.json` ใน root directory

**⚠️ Important:** เพิ่ม `serviceAccountKey.json` ใน `.gitignore`

#### วิธีที่ 2: ใช้ Environment Variables

สร้างไฟล์ `.env`:
```env
FIREBASE_PROJECT_ID=musicplay-d9231
FIREBASE_CLIENT_EMAIL=vertex-express@musicplay-d9231.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

**ดูคำแนะนำเพิ่มเติม:**
- `FIREBASE_ADMIN_SETUP.md`
- `ENV_CONFIG_COMPLETE.md`

---

## 🚀 การใช้งาน

### 1. Start API Server

```bash
npm run server
```

**หรือ**

```bash
npm run dev:server
```

**Expected Output:**
```
✅ Firebase Admin SDK initialized with service account
🚀 Music API Server running on port 3000
📡 API Endpoints:
   GET /api/music - ดึงรายการเพลงทั้งหมด
   GET /api/music/* - ดึงรายการเพลงจาก path
   GET /api/music/url/* - ดึง signed URL สำหรับไฟล์
   GET /api/health - Health check
```

### 2. ตรวจสอบ Health

```bash
curl http://localhost:3000/api/health
```

**Expected Response:**
```json
{
  "success": true,
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 3. ทดสอบ API

```bash
# Get all music
curl "http://localhost:3000/api/music?includeUrl=true"

# Get from specific path
curl "http://localhost:3000/api/music/users/BuxerwRsTqdw1H30u1BVLAj4mzM2/music"
```

---

## 📁 ไฟล์ที่สำคัญ

### Backend Files:
- `server.js` - Express API server
- `src/plugins/firebaseAdmin.js` - Firebase Admin SDK initialization

### Configuration Files:
- `.env` - Environment variables (optional)
- `serviceAccountKey.json` - Service account key (optional)

### Documentation:
- `API_DOCUMENTATION.md` - API documentation
- `FIREBASE_ADMIN_SETUP.md` - Firebase Admin SDK setup
- `ENV_CONFIG_COMPLETE.md` - Environment variables guide

---

## 🔍 Troubleshooting

### Issue 1: Firebase Admin SDK ไม่ได้ initialize

**Error:**
```
❌ Failed to initialize Firebase Admin SDK
```

**Solution:**
1. ตรวจสอบ service account key file หรือ environment variables
2. ดู `FIREBASE_ADMIN_SETUP.md`

### Issue 2: Port 3000 ถูกใช้งานแล้ว

**Error:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:**
```bash
# หา process ที่ใช้ port 3000
lsof -ti:3000

# Kill process
kill -9 $(lsof -ti:3000)

# หรือเปลี่ยน port ใน server.js
const PORT = process.env.PORT || 3001
```

### Issue 3: CORS Error

**Error:**
```
Access to XMLHttpRequest has been blocked by CORS policy
```

**Solution:**
1. ตรวจสอบ CORS settings ใน `server.js`
2. เพิ่ม origin ของ frontend ใน CORS config

---

## 📊 API Endpoints

### 1. GET `/api/health`
Health check endpoint

### 2. GET `/api/music`
ดึงรายการเพลงทั้งหมด

**Query Parameters:**
- `paths` - Comma-separated paths (optional)
- `includeUrl` - Include signed URLs (default: false)
- `expiresIn` - URL expiration in seconds (default: 3600)

### 3. GET `/api/music/*`
ดึงรายการเพลงจาก path เฉพาะ

### 4. GET `/api/music/url/*`
ดึง signed URL สำหรับไฟล์เฉพาะ

**ดูรายละเอียดเพิ่มเติม:** `API_DOCUMENTATION.md`

---

## ✅ Checklist

- [ ] Dependencies ติดตั้งแล้ว (`express`, `cors`, `firebase-admin`, `dotenv`)
- [ ] Firebase Admin SDK credentials ถูกตั้งค่าแล้ว
- [ ] API Server ทำงานได้ (`npm run server`)
- [ ] Health check สำเร็จ (`curl http://localhost:3000/api/health`)
- [ ] API endpoints ทำงานได้

---

## 🔗 Related Documents

- `API_DOCUMENTATION.md` - API documentation
- `FIREBASE_ADMIN_SETUP.md` - Firebase Admin SDK setup
- `ENV_CONFIG_COMPLETE.md` - Environment variables
- `TROUBLESHOOTING.md` - Troubleshooting guide

---

**Backend พร้อมใช้งาน!** 🎵

