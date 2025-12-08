# ⚡ Quick Start: Setup CORS with Admin SDK

## 🎯 Goal
ตั้งค่า CORS สำหรับ Firebase Storage โดยใช้ Firebase Admin SDK

---

## 📥 Step 1: Download Service Account Key

### วิธีที่ 1: Firebase Console (ง่ายที่สุด)

1. **เปิดลิงก์นี้**:
   ```
   https://console.firebase.google.com/project/musicplay-d9231/settings/serviceaccounts/adminsdk
   ```

2. **คลิก "Generate new private key"**

3. **คลิก "Generate key"** ใน confirmation dialog

4. **ไฟล์ JSON จะถูกดาวน์โหลด** (ชื่อประมาณ `musicplay-d9231-firebase-adminsdk-xxxxx.json`)

5. **ย้ายไฟล์ไปที่ root directory**:
   ```bash
   # ตรวจสอบไฟล์ที่ดาวน์โหลด
   ls ~/Downloads/*firebase-adminsdk*.json
   
   # ย้ายและเปลี่ยนชื่อ
   mv ~/Downloads/musicplay-d9231-firebase-adminsdk-*.json ./serviceAccountKey.json
   
   # ตั้งค่า permissions
   chmod 600 serviceAccountKey.json
   ```

6. **ตรวจสอบไฟล์**:
   ```bash
   ls -la serviceAccountKey.json
   ```

---

## 🚀 Step 2: Run Setup CORS

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
📋 Current CORS: [...]
```

---

## ✅ Step 3: Verify

### ตรวจสอบใน Google Cloud Console:

1. ไปที่: https://console.cloud.google.com/storage/browser/musicplay-d9231.firebasestorage.app?project=musicplay-d9231
2. คลิก bucket → **Configuration** → **CORS**
3. ควรเห็น CORS config ที่ตั้งค่าไว้

### ทดสอบใน Browser:

1. **รอ 1-2 นาที** (ให้ CORS propagate)
2. **Clear browser cache**: `Cmd+Shift+R` (Mac) หรือ `Ctrl+Shift+R` (Windows)
3. **รีเฟรชหน้า**: http://localhost:5173/
4. **ตรวจสอบ Console**: ไม่ควรมี CORS error

---

## 🔧 Alternative: ใช้ Environment Variables

ถ้าไม่ต้องการใช้ไฟล์ key สามารถใช้ environment variables:

### เพิ่มใน `.env`:

```env
FIREBASE_PROJECT_ID=musicplay-d9231
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@musicplay-d9231.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
```

**หมายเหตุ:** 
- Private key ต้องมี `\n` แทน newlines
- ต้อง wrap ด้วย double quotes

---

## ⚠️ Troubleshooting

### Error: Service account key not found

**Solution:**
```bash
# ตรวจสอบว่าไฟล์อยู่ที่ root directory
ls -la serviceAccountKey.json

# ถ้าไม่มี ให้ download จาก Firebase Console
```

### Error: Invalid credentials

**Solution:**
1. ตรวจสอบว่า service account key ถูกต้อง
2. ตรวจสอบว่า project ID ตรงกับ `musicplay-d9231`
3. ลอง download key ใหม่

### Error: Permission denied

**Solution:**
1. ตรวจสอบว่า service account มี role "Storage Admin"
2. ไปที่: https://console.cloud.google.com/iam-admin/iam?project=musicplay-d9231
3. ตรวจสอบ permissions ของ service account

---

## 📋 Checklist

- [ ] Download service account key จาก Firebase Console
- [ ] วางไฟล์ `serviceAccountKey.json` ใน root directory
- [ ] ตั้งค่า permissions: `chmod 600 serviceAccountKey.json`
- [ ] รัน `npm run setup:cors`
- [ ] ตรวจสอบ CORS ใน Google Cloud Console
- [ ] ทดสอบใน browser (รอ 1-2 นาที)

---

## 🔗 Quick Links

- **Firebase Service Accounts**: https://console.firebase.google.com/project/musicplay-d9231/settings/serviceaccounts/adminsdk
- **Google Cloud Storage**: https://console.cloud.google.com/storage/browser?project=musicplay-d9231
- **IAM Permissions**: https://console.cloud.google.com/iam-admin/iam?project=musicplay-d9231

---

**Ready?** Download key และรัน `npm run setup:cors`!

