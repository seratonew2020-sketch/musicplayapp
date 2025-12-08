# 🔧 Environment Variables Setup Guide

## 📋 Overview

ใช้ environment variables สำหรับ Firebase configuration และ Admin SDK

---

## 📁 Step 1: สร้างไฟล์ `.env`

```bash
# Copy from example
cp .env.example .env

# หรือสร้างใหม่
touch .env
```

---

## 🔥 Step 2: ตั้งค่า Firebase Client Configuration

เพิ่มใน `.env`:

```env
# Firebase Client Configuration
VITE_FIREBASE_API_KEY=AQ.Ab8RN6L7y1wYQQJoA81LQj9Cdgt__fuHePSr3YjrDlVNJBMRDQ
VITE_FIREBASE_AUTH_DOMAIN=musicplay-d9231.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=musicplay-d9231
VITE_FIREBASE_STORAGE_BUCKET=musicplay-d9231.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=148604086726
VITE_FIREBASE_APP_ID=1:148604086726:web:4be9ada9787d973320aac7
VITE_FIREBASE_MEASUREMENT_ID=G-LKYJBBB94E
```

---

## 🔑 Step 3: ตั้งค่า Firebase Admin SDK

### วิธีที่ 1: ใช้ Private Key จาก Service Account Key File

1. **Download service account key** จาก Firebase Console:
   - https://console.firebase.google.com/project/musicplay-d9231/settings/serviceaccounts/adminsdk
   - คลิก "Generate new private key"
   - เปิดไฟล์ JSON ที่ดาวน์โหลด

2. **Copy private_key field** จาก JSON file

3. **แปลง newlines** (`\n`) เป็น `\\n`:
   ```bash
   # ตัวอย่าง private key ใน JSON:
   "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
   
   # ใน .env ต้องเป็น:
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\\n-----END PRIVATE KEY-----\\n"
   ```

4. **เพิ่มใน `.env`**:
   ```env
   FIREBASE_PROJECT_ID=musicplay-d9231
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@musicplay-d9231.iam.gserviceaccount.com
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\nYOUR_PRIVATE_KEY_HERE\\n-----END PRIVATE KEY-----\\n"
   ```

### วิธีที่ 2: ใช้ Script แปลง Private Key

```bash
# เปิดไฟล์ service account key JSON
cat serviceAccountKey.json | jq -r '.private_key' | sed 's/\\n/\\\\n/g'
```

---

## 🚀 Step 4: รัน Setup CORS

```bash
npm run setup:cors
```

สคริปต์จะอ่าน environment variables จาก `.env` อัตโนมัติ

---

## ✅ Step 5: ตรวจสอบ

### ตรวจสอบ Environment Variables:

```bash
# ตรวจสอบว่า .env ถูกโหลด
node -e "require('dotenv').config(); console.log(process.env.FIREBASE_PROJECT_ID)"
```

### ตรวจสอบ CORS:

```bash
npm run setup:cors
```

**Expected Output:**
```
✅ Using service account from environment variables
✅ Firebase Admin SDK initialized
🔧 Setting up CORS for bucket: musicplay-d9231.firebasestorage.app
✅ CORS configuration updated successfully!
```

---

## 📝 ตัวอย่างไฟล์ `.env` เต็ม

```env
# Firebase Client Configuration
VITE_FIREBASE_API_KEY=AQ.Ab8RN6L7y1wYQQJoA81LQj9Cdgt__fuHePSr3YjrDlVNJBMRDQ
VITE_FIREBASE_AUTH_DOMAIN=musicplay-d9231.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=musicplay-d9231
VITE_FIREBASE_STORAGE_BUCKET=musicplay-d9231.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=148604086726
VITE_FIREBASE_APP_ID=1:148604086726:web:4be9ada9787d973320aac7
VITE_FIREBASE_MEASUREMENT_ID=G-LKYJBBB94E

# Firebase Admin SDK
FIREBASE_PROJECT_ID=musicplay-d9231
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@musicplay-d9231.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\\n-----END PRIVATE KEY-----\\n"
```

---

## ⚠️ Important Notes

1. **Private Key Format**:
   - ต้อง wrap ด้วย double quotes `"`
   - ต้องใช้ `\\n` แทน `\n` (double backslash)
   - ต้องมี `-----BEGIN PRIVATE KEY-----` และ `-----END PRIVATE KEY-----`

2. **Security**:
   - `.env` อยู่ใน `.gitignore` แล้ว
   - ไม่ควร commit `.env` ไป git
   - ใช้ `.env.example` เป็น template

3. **Loading**:
   - Vite โหลด `VITE_*` variables อัตโนมัติ
   - Node.js scripts ต้องใช้ `dotenv` package

---

## 🔧 Troubleshooting

### Error: Private key not found

**Solution:**
- ตรวจสอบว่า `FIREBASE_PRIVATE_KEY` ถูกตั้งค่าใน `.env`
- ตรวจสอบว่า private key มี `\\n` แทน `\n`
- ตรวจสอบว่า wrap ด้วย double quotes

### Error: Invalid credentials

**Solution:**
- ตรวจสอบว่า private key ถูกต้อง (copy จาก JSON file)
- ตรวจสอบว่า client email ตรงกับ service account
- ลอง download service account key ใหม่

---

## 📚 Related Files

- `.env.example` - Template สำหรับ environment variables
- `scripts/setup-cors-admin.js` - Script ที่ใช้ env variables
- `FIREBASE_ADMIN_SETUP.md` - คู่มือ Admin SDK แบบละเอียด

---

**Ready?** สร้าง `.env` และเพิ่ม configuration แล้วรัน `npm run setup:cors`!

