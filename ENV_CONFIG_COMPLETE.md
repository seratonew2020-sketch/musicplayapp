# 🔧 Complete Environment Variables Configuration

**Updated:** December 2024  
**Service Account:** `vertex-express@musicplay-d9231.iam.gserviceaccount.com`

---

## 📋 Complete `.env` File

สร้างไฟล์ `.env` ใน root directory และเพิ่ม:

```env
# ============================================
# Firebase Client Configuration (VITE_ prefix)
# ============================================
VITE_FIREBASE_API_KEY=AQ.Ab8RN6L7y1wYQQJoA81LQj9Cdgt__fuHePSr3YjrDlVNJBMRDQ
VITE_FIREBASE_AUTH_DOMAIN=musicplay-d9231.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=musicplay-d9231
VITE_FIREBASE_STORAGE_BUCKET=musicplay-d9231.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=148604086726
VITE_FIREBASE_APP_ID=1:148604086726:web:4be9ada9787d973320aac7
VITE_FIREBASE_MEASUREMENT_ID=G-LKYJBBB94E

# ============================================
# Firebase Admin SDK Configuration
# ============================================
FIREBASE_PROJECT_ID=musicplay-d9231
FIREBASE_CLIENT_EMAIL=vertex-express@musicplay-d9231.iam.gserviceaccount.com

# Private Key จาก Service Account Key File
# วิธีได้: Download จาก Firebase Console → Generate new private key
# ต้องแปลง \n เป็น \\n (double backslash)
# ตัวอย่าง:
# FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\\n-----END PRIVATE KEY-----\\n"
FIREBASE_PRIVATE_KEY=""

# ============================================
# Optional: Google Drive API
# ============================================
# VITE_GOOGLE_API_KEY=your_google_api_key_here
```

---

## 🔑 Service Account Setup

### Service Account Email:
```
vertex-express@musicplay-d9231.iam.gserviceaccount.com
```

### วิธีได้ Private Key:

1. **ไปที่ Firebase Console**:
   ```
   https://console.firebase.google.com/project/musicplay-d9231/settings/serviceaccounts/adminsdk
   ```

2. **คลิก "Generate new private key"**

3. **เปิดไฟล์ JSON ที่ดาวน์โหลด**

4. **Copy ค่า `private_key` field**

5. **แปลง newlines**:
   - ใน JSON: `\n` 
   - ใน .env: `\\n` (double backslash)

6. **เพิ่มใน `.env`**:
   ```env
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\nYOUR_KEY_HERE\\n-----END PRIVATE KEY-----\\n"
   ```

---

## 🚀 Usage

### 1. Client-side (Vite):
- ใช้ `VITE_*` variables
- โหลดอัตโนมัติโดย Vite
- ใช้ใน: `src/plugins/firebase.js`

### 2. Server-side (Admin SDK):
- ใช้ `FIREBASE_*` variables
- ใช้ใน: `scripts/setup-cors-admin.js`
- ใช้ใน: `src/plugins/firebaseAdmin.js`

---

## ✅ Verification

### ตรวจสอบ Client Config:
```bash
# รัน dev server
npm run dev

# ตรวจสอบ browser console:
# ✅ Firebase Storage Bucket: musicplay-d9231.firebasestorage.app
```

### ตรวจสอบ Admin SDK:
```bash
# รัน setup CORS
npm run setup:cors

# Expected output:
# ✅ Using service account from environment variables
# ✅ Firebase Admin SDK initialized
# ✅ CORS configuration updated successfully!
```

---

## 📝 Important Notes

1. **API Key**: `AQ.Ab8RN6L7y1wYQQJoA81LQj9Cdgt__fuHePSr3YjrDlVNJBMRDQ`
2. **Service Account**: `vertex-express@musicplay-d9231.iam.gserviceaccount.com`
3. **Private Key**: ต้องมาจาก service account key file
4. **Security**: `.env` อยู่ใน `.gitignore` แล้ว

---

## 🔗 Quick Links

- **Firebase Console**: https://console.firebase.google.com/project/musicplay-d9231
- **Service Accounts**: https://console.firebase.google.com/project/musicplay-d9231/settings/serviceaccounts/adminsdk
- **Google Cloud IAM**: https://console.cloud.google.com/iam-admin/serviceaccounts?project=musicplay-d9231

---

**Ready to use!** สร้าง `.env` และเพิ่ม configuration แล้วรัน `npm run setup:cors`

