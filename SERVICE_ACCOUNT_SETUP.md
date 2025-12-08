# 🔑 Service Account Setup Guide

**Service Account:** `firebase-adminsdk-fbsvc@musicplay-d9231.iam.gserviceaccount.com`  
**Project:** `musicplay-d9231`

---

## 📥 Step 1: Download Service Account Key

### วิธีที่ 1: ผ่าน Firebase Console (แนะนำ)

1. **เปิดลิงก์นี้**:
   ```
   https://console.firebase.google.com/project/musicplay-d9231/settings/serviceaccounts/adminsdk
   ```

2. **คลิก "Generate new private key"**

3. **คลิก "Generate key"** ใน dialog

4. **ไฟล์ JSON จะถูกดาวน์โหลด** (ชื่อประมาณ `musicplay-d9231-firebase-adminsdk-xxxxx.json`)

5. **เปลี่ยนชื่อไฟล์**:
   ```bash
   mv ~/Downloads/musicplay-d9231-firebase-adminsdk-*.json ./serviceAccountKey.json
   ```

### วิธีที่ 2: ผ่าน Google Cloud Console

1. ไปที่: https://console.cloud.google.com/iam-admin/serviceaccounts?project=musicplay-d9231
2. คลิกที่ service account: `firebase-adminsdk-fbsvc@musicplay-d9231.iam.gserviceaccount.com`
3. ไปที่แท็บ "Keys"
4. คลิก "Add Key" → "Create new key"
5. เลือก "JSON" และคลิก "Create"
6. ไฟล์จะถูกดาวน์โหลด

---

## 📁 Step 2: วางไฟล์ใน Root Directory

```bash
# ตรวจสอบว่าไฟล์อยู่ใน root directory
ls -la serviceAccountKey.json

# ควรเห็น:
# -rw-r--r--  serviceAccountKey.json
```

---

## ✅ Step 3: ตรวจสอบไฟล์

ไฟล์ `serviceAccountKey.json` ควรมีโครงสร้างแบบนี้:

```json
{
  "type": "service_account",
  "project_id": "musicplay-d9231",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-fbsvc@musicplay-d9231.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "..."
}
```

---

## 🚀 Step 4: รัน Setup CORS

```bash
npm run setup:cors
```

**Expected Output:**
```
✅ Loaded service account from file
✅ Firebase Admin SDK initialized
🔧 Setting up CORS for bucket: musicplay-d9231.firebasestorage.app
📋 CORS Config: [...]
✅ CORS configuration updated successfully!
⏰ CORS will propagate in 1-2 minutes
```

---

## 🔒 Security Checklist

- [x] `serviceAccountKey.json` อยู่ใน `.gitignore` แล้ว
- [ ] ไฟล์ `serviceAccountKey.json` อยู่ใน root directory
- [ ] ไฟล์มี permissions ที่ปลอดภัย (600)
- [ ] ไม่เคย commit ไฟล์นี้ไป git

### ตั้งค่า Permissions:

```bash
chmod 600 serviceAccountKey.json
```

---

## ⚠️ Troubleshooting

### Error: Service account key not found

**Solution:**
1. ตรวจสอบว่าไฟล์ `serviceAccountKey.json` อยู่ใน root directory
2. ตรวจสอบชื่อไฟล์ (ต้องตรงกับ `serviceAccountKey.json`)
3. ตรวจสอบว่าไฟล์มี JSON format ถูกต้อง

### Error: Invalid credentials

**Solution:**
1. ตรวจสอบว่า service account key ถูกต้อง
2. ตรวจสอบว่า project ID ตรงกับ `musicplay-d9231`
3. ลอง download key ใหม่จาก Firebase Console

### Error: Permission denied

**Solution:**
1. ตรวจสอบว่า service account มีสิทธิ์ "Storage Admin"
2. ไปที่: https://console.cloud.google.com/iam-admin/iam?project=musicplay-d9231
3. ตรวจสอบ role ของ service account

---

## 📝 Alternative: ใช้ Environment Variables

ถ้าไม่ต้องการใช้ไฟล์ key สามารถใช้ environment variables แทน:

```env
FIREBASE_PROJECT_ID=musicplay-d9231
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@musicplay-d9231.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

**หมายเหตุ:** Private key ต้องมี `\n` แทน newlines

---

## 🔗 Quick Links

- **Firebase Service Accounts**: https://console.firebase.google.com/project/musicplay-d9231/settings/serviceaccounts/adminsdk
- **Google Cloud IAM**: https://console.cloud.google.com/iam-admin/serviceaccounts?project=musicplay-d9231
- **Storage Bucket**: https://console.cloud.google.com/storage/browser?project=musicplay-d9231

---

## ✅ Verification

หลังจากรัน `npm run setup:cors` แล้ว:

1. **ตรวจสอบ CORS ใน Google Cloud Console**:
   - ไปที่: https://console.cloud.google.com/storage/browser/musicplay-d9231.firebasestorage.app?project=musicplay-d9231
   - Configuration → CORS
   - ควรเห็น CORS config ที่ตั้งค่าไว้

2. **ทดสอบใน Browser**:
   - รอ 1-2 นาที (ให้ CORS propagate)
   - Clear browser cache (Cmd+Shift+R)
   - รีเฟรชหน้า app
   - ตรวจสอบ Console ว่าไม่มี CORS error

---

**Ready to setup?** Download service account key และรัน `npm run setup:cors`!

