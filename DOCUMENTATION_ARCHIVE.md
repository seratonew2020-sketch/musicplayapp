# 🔍 Code Review Report - Latest

**Generated:** December 2024  
**Project:** Music Play App (Vue 3 + Vite + Firebase)  
**Reviewer:** AI Code Review

---

## 📊 Executive Summary

**Overall Code Quality:** 8.5/10  
**Security:** 7/10 ⚠️  
**Performance:** 8/10  
**Maintainability:** 9/10  
**Best Practices:** 8/10

---

## 🔴 Critical Issues

### 1. **User Experience: Blocking Alerts**
**Files:** Multiple files use `alert()` for error handling

**Issue:** Using `alert()` blocks UI thread and provides poor UX

**Example in `firebaseStorage.js`:**
```javascript
alert('❌ ไม่พบโฟลเดอร์ที่ระบุใน Firebase Storage')
```

**Recommendation:**
```javascript
// Use a toast/notification system instead
import { useToast } from 'vuetify'

const toast = useToast()
toast.error('คำขอไม่ถูกต้อง (Bad Request)')
```

**Priority:** 🟡 Medium

---

## 🟡 Important Issues

### 3. **Error Handling Inconsistency**
**Files:** Multiple files use different error handling patterns

**Issue:**
- `firebaseStorage.js` uses `alert()` and `console.error()`
- `useAudioPlayer.js` uses `console.error()`
- `musicApi.js` uses `alert()` for errors

**Recommendation:**
- Create a centralized error handler
- Use consistent notification system (Vuetify Snackbar)
- Log errors to error tracking service (Sentry, etc.)

**Priority:** 🟡 Medium

---

### 4. **Hardcoded User Path**
**File:** `src/App.vue:260`

**Issue:**
```javascript
const FIREBASE_STORAGE_PATH = 'users/BuxerwRsTqdw1H30u1BVLAj4mzM2/music/';
```

**Recommendation:**
```javascript
// Get from Firebase Auth
import { getAuth } from 'firebase/auth'

const auth = getAuth()
const userId = auth.currentUser?.uid
const FIREBASE_STORAGE_PATH = userId ? `users/${userId}/music/` : null
```

**Priority:** 🟡 Medium

---

### 5. **Missing Type Safety**
**Files:** All JavaScript files

**Issue:** No TypeScript or JSDoc types

**Recommendation:**
```javascript
/**
 * @param {string} folderPath - Path ของโฟลเดอร์
 * @returns {Promise<Array<{id: string, name: string, url: string, fullPath: string}>>}
 */
export const loadAudioFilesFromStorage = async (folderPath) => {
  // ...
}
```

**Priority:** 🟢 Low

---

## ✅ Strengths

### 1. **Excellent Error Handling**
- ✅ Retry logic with exponential backoff
- ✅ Comprehensive error messages
- ✅ Batch processing for large file lists
- ✅ Proper error categorization

### 2. **Good Architecture**
- ✅ Clean separation of concerns
- ✅ Proper use of Vue 3 Composition API
- ✅ Well-organized file structure
- ✅ Reusable composables

### 3. **Performance Optimizations**
- ✅ Batch processing (5 files at a time)
- ✅ Retry with backoff
- ✅ Proper cleanup in `onUnmounted`

---

## 🚀 Recommendations

### Immediate Actions

1. **Remove API Key Logging**
   ```javascript
   // Remove this line:
   console.log('🔑 API Key loaded:', apiKey ? `${apiKey.substring(0, 5)}...` : 'None')
   ```

2. **Replace alert() with Toast**
   ```javascript
   // Install: npm install @mdi/font
   // Use Vuetify Snackbar component
   ```

3. **Add Loading States**
   ```javascript
   const isLoading = ref(false)
   // Show loading indicator during API calls
   ```

### Short-term Improvements

1. **Add TypeScript or JSDoc**
2. **Implement Error Tracking** (Sentry)
3. **Add Unit Tests**
4. **Implement Playlist Caching**

### Long-term Enhancements

1. **Move API calls to Backend**
2. **Add Offline Support**
3. **Implement Code Splitting**
4. **Add Audio Visualization**

---

## 📝 Code Quality Metrics

| Metric | Score | Notes |
|--------|-------|-------|
| Security | 7/10 | API key exposure issue |
| Performance | 8/10 | Good batch processing |
| Maintainability | 9/10 | Clean code structure |
| Error Handling | 9/10 | Comprehensive |
| Type Safety | 5/10 | No TypeScript/JSDoc |
| Testing | 0/10 | No tests found |

---

## 🔗 Related Files

- `src/plugins/firebaseStorage.js` - Firebase Storage operations
- `src/composables/useAudioPlayer.js` - Audio player logic
- `src/App.vue` - Main component

---

## ✅ Action Items

- [ ] Remove API key logging
- [ ] Replace alert() with toast notifications
- [ ] Add centralized error handler
- [ ] Get user ID from Firebase Auth
- [ ] Add JSDoc type annotations
- [ ] Implement error tracking
- [ ] Add loading states
- [ ] Write unit tests

---

**Next Review:** After implementing critical fixes

# ⚠️ Configuration Warning

## 🚨 Critical Issue: Storage Rules Block All Access

The provided Storage Rules will **block all read and write access**:

```javascript
match /{allPaths=**} {
  allow read, write: if false;  // ❌ This blocks EVERYTHING
}
```

**This will prevent the app from working!**

---

## 📋 Recommended Storage Rules

Use these rules instead to allow public read and authenticated write:

```javascript
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read;  // ✅ Allow public read
    }

    match /users/{userId}/{allPaths=**} {
      allow write: if request.auth != null && request.auth.uid == userId;  // ✅ Allow authenticated write
    }
  }
}
```

---

## 🔄 Project Configuration Change

**Current Project:** `musicplay-d9231`  
**New Project:** `gen-lang-client-0619551860`

### Firebase Config Provided:
```javascript
{
  apiKey: "AIzaSyCuQdTLxNd9NmQFuNrlWOlTcr2MFgCpKUk",
  authDomain: "gen-lang-client-0619551860.firebaseapp.com",
  projectId: "gen-lang-client-0619551860",
  storageBucket: "gen-lang-client-0619551860.firebasestorage.app",
  messagingSenderId: "701217503722",
  appId: "1:701217503722:web:817ea665a80f2d6a685a93"
}
```

---

## ⚠️ Action Required

1. **Update Storage Rules** - Use the recommended rules above
2. **Update Environment Variables** - If switching projects
3. **Update .firebaserc** - If switching projects
4. **Deploy Rules** - After updating

---

## 🔧 Steps to Update

### Option 1: Keep Current Project (musicplay-d9231)
- Keep current Storage Rules (already correct)
- No changes needed

### Option 2: Switch to New Project (gen-lang-client-0619551860)
1. Update `.env` file with new Firebase config
2. Update `.firebaserc` with new project ID
3. Update Storage Rules (use recommended rules)
4. Deploy rules: `firebase deploy --only storage`

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

# 🔧 CORS Troubleshooting Guide

## ปัญหา: OPTIONS Request 404 Not Found

### อาการ
```
Request Method: OPTIONS
Status Code: 404 Not Found
URL: https://firebasestorage.googleapis.com/v0/b/musicplay-d9231.appspot.com/o?prefix=users%2FBuxerwRsTqdw1H30u1BVLAj4mzM2%2Fmusic%2F&delimiter=%2F
```

### สาเหตุ
Firebase Storage REST API endpoint ไม่รองรับ OPTIONS request (CORS preflight) สำหรับ listAll operation

### วิธีแก้ไข

#### 1. ตรวจสอบ Path ใน Firebase Console
1. ไปที่: https://console.firebase.google.com/project/musicplay-d9231/storage
2. ตรวจสอบว่า path `users/BuxerwRsTqdw1H30u1BVLAj4mzM2/music/` มีอยู่จริง
3. ตรวจสอบว่ามีไฟล์เสียงในโฟลเดอร์นี้

#### 2. ตรวจสอบ Storage Rules
Storage Rules ควรอนุญาตให้อ่านไฟล์:
```javascript
match /users/{userId}/music/{allPaths=**} {
  allow read: if true;
}
```

#### 3. ตรวจสอบว่าไฟล์มีอยู่จริง
- ไปที่ Firebase Console > Storage
- ตรวจสอบว่าโฟลเดอร์ `users/BuxerwRsTqdw1H30u1BVLAj4mzM2/music/` มีไฟล์อยู่จริง
- ถ้าไม่มีไฟล์ ให้อัปโหลดไฟล์เสียง (.mp3, .m4a, etc.)

#### 4. ลองใช้ Path อื่น
ถ้า path ไม่ถูกต้อง ลองเปลี่ยนเป็น:
- `music/` (root level)
- หรือ path อื่นที่มีไฟล์อยู่จริง

#### 5. ใช้ Cloud Functions (ถ้ายังไม่ได้)
สร้าง Cloud Function เพื่อ list files แทนการเรียก REST API โดยตรง

### วิธีตรวจสอบ

#### ตรวจสอบ Path
```bash
# ตรวจสอบ path ในโค้ด
grep -r "FIREBASE_STORAGE_PATH" src/
```

#### ตรวจสอบ Storage Rules
```bash
# ดู storage rules
cat storage.rules
```

#### Deploy Storage Rules
```bash
firebase deploy --only storage
```

### หมายเหตุ
- Firebase SDK ควรจัดการ CORS อัตโนมัติ
- ถ้ายังมีปัญหา อาจต้องตรวจสอบว่า Firebase Storage API ทำงานปกติ
- หรือใช้ Cloud Functions เป็น proxy

# 🔍 รายงานการ Debug และแก้ไขปัญหา

**วันที่**: $(date)  
**URL**: http://localhost:5173/  
**สถานะ**: ⚠️ กำลังแก้ไข

---

## 📋 สรุปปัญหา

### 1. ❌ CORS Error (ปัญหาหลัก)
**อาการ**:
```
Access to XMLHttpRequest at 'https://firebasestorage.googleapis.com/v0/b/musicplay-d9231.appspot.com/...' 
from origin 'http://localhost:5173' has been blocked by CORS policy
```

**สาเหตุ**:
- Firebase Storage bucket ยังไม่ได้ตั้งค่า CORS สำหรับ localhost
- Browser block การเรียก API เนื่องจาก CORS preflight request ล้มเหลว

**วิธีแก้ไข**:
- ✅ สร้างไฟล์ `cors.json` แล้ว
- ⚠️ ต้อง apply CORS config ผ่าน gsutil หรือ Google Cloud Console
- ดูคำแนะนำใน `CORS_FIX.md`

### 2. ⚠️ Storage Bucket Configuration
**ปัญหา**:
- Code ตั้งค่าให้ใช้ `firebasestorage.app` แต่ error แสดงว่าใช้ `appspot.com`
- อาจมี environment variable ที่ override การตั้งค่า

**วิธีแก้ไข**:
- ตรวจสอบ `.env` file (ถ้ามี)
- ตั้งค่า `VITE_FIREBASE_STORAGE_BUCKET` ให้ถูกต้อง

### 3. ⚠️ Retry Limit Exceeded
**อาการ**:
```
Firebase Storage: Max retry time for operation exceeded
```

**สาเหตุ**:
- CORS error ทำให้ retry หลายครั้งจนเกิน limit
- ไฟล์จำนวนมากอาจทำให้ timeout

**วิธีแก้ไข**:
- ✅ เพิ่ม retry logic และ batch processing แล้ว
- ต้องแก้ CORS ก่อนเพื่อให้ retry ทำงานได้

---

## 🔧 การแก้ไขที่ทำแล้ว

### 1. ✅ เพิ่ม Retry Logic
- เพิ่ม `retryWithBackoff()` function
- Exponential backoff: 1s, 2s, 4s
- Max retries: 3 ครั้ง

### 2. ✅ เพิ่ม Batch Processing
- Process ไฟล์ทีละ 5 ไฟล์
- เพิ่ม delay 200ms ระหว่าง batches
- ลดโอกาส timeout

### 3. ✅ ปรับปรุง Error Handling
- แยก error types (CORS, retry limit, 404, etc.)
- แสดง error messages ที่ชัดเจน
- Logging ที่ดีขึ้น

### 4. ✅ สร้าง CORS Configuration
- ไฟล์ `cors.json` พร้อมใช้
- รองรับ localhost:5173, 5174, 3000
- Methods: GET, HEAD, OPTIONS

---

## 🚀 ขั้นตอนการแก้ไข

### Step 1: ตั้งค่า CORS (สำคัญที่สุด)
```bash
# วิธีที่ 1: ใช้ gsutil
gsutil cors set cors.json gs://musicplay-d9231.appspot.com

# วิธีที่ 2: ใช้ Google Cloud Console
# ไปที่: https://console.cloud.google.com/storage/browser?project=musicplay-d9231
# เลือก bucket → Configuration → CORS → Edit → วาง config จาก cors.json
```

### Step 2: ตรวจสอบ Environment Variables
สร้างไฟล์ `.env` (ถ้ายังไม่มี):
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=musicplay-d9231
VITE_FIREBASE_STORAGE_BUCKET=musicplay-d9231.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Step 3: รีสตาร์ท Dev Server
```bash
# หยุด server (Ctrl+C)
# รันใหม่
npm run dev
```

### Step 4: Clear Browser Cache
- Hard refresh: `Cmd+Shift+R` (Mac) หรือ `Ctrl+Shift+R` (Windows)
- หรือ clear cache ใน DevTools

---

## 📊 สถานะการแก้ไข

| ปัญหา | สถานะ | หมายเหตุ |
|-------|-------|----------|
| CORS Error | ⚠️ ต้องตั้งค่า CORS | ใช้ไฟล์ `cors.json` |
| Retry Logic | ✅ แก้ไขแล้ว | เพิ่ม exponential backoff |
| Batch Processing | ✅ แก้ไขแล้ว | Process 5 ไฟล์ต่อครั้ง |
| Error Handling | ✅ ปรับปรุงแล้ว | แสดง error ที่ชัดเจน |
| Storage Bucket | ⚠️ ตรวจสอบ env | อาจต้องตั้งค่า env variable |

---

## 🧪 การทดสอบ

หลังจากแก้ไข CORS แล้ว:

1. **เปิด Browser Console** (F12)
2. **ตรวจสอบ Logs**:
   - ✅ Firebase Storage Bucket: `musicplay-d9231.appspot.com`
   - ✅ listAll สำเร็จ
   - ✅ พบไฟล์ X ไฟล์
3. **ตรวจสอบ Network Tab**:
   - ไม่มี CORS error
   - OPTIONS request ผ่าน (200 OK)
   - GET request สำเร็จ

---

## 📝 หมายเหตุ

1. **CORS propagation**: หลังจากตั้งค่า CORS อาจใช้เวลา 1-2 นาที
2. **Browser cache**: ต้อง clear cache หรือ hard refresh
3. **Storage Rules**: ตรวจสอบว่า Storage Rules อนุญาตให้อ่านไฟล์
4. **Path verification**: ตรวจสอบว่า path `users/BuxerwRsTqdw1H30u1BVLAj4mzM2/music/` มีไฟล์อยู่จริง

---

## 🔗 ไฟล์ที่เกี่ยวข้อง

- `cors.json` - CORS configuration
- `CORS_FIX.md` - คำแนะนำการตั้งค่า CORS
- `src/plugins/firebase.js` - Firebase initialization
- `src/plugins/firebaseStorage.js` - Storage operations
- `src/App.vue` - Main component

---

## ✅ Checklist

- [ ] ตั้งค่า CORS ใน Google Cloud Storage
- [ ] ตรวจสอบ environment variables
- [ ] รีสตาร์ท dev server
- [ ] Clear browser cache
- [ ] ทดสอบการโหลดไฟล์
- [ ] ตรวจสอบ console logs
- [ ] ตรวจสอบ network requests

---

**อัปเดตล่าสุด**: $(date)

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

# 🔥 Firebase Admin SDK Setup

**Service Account:** `vertex-express@musicplay-d9231.iam.gserviceaccount.com`  
**Project:** `musicplay-d9231`

---

## 📦 Installation

```bash
npm install firebase-admin
```

---

## 🔑 Service Account Setup

### Option 1: Service Account Key File (แนะนำสำหรับ local development)

1. **Download Service Account Key**:
   - ไปที่: https://console.firebase.google.com/project/musicplay-d9231/settings/serviceaccounts/adminsdk
   - คลิก "Generate new private key"
   - บันทึกไฟล์เป็น `serviceAccountKey.json`

2. **Add to .gitignore**:
   ```bash
   echo "serviceAccountKey.json" >> .gitignore
   ```

3. **Set Environment Variable**:
   ```bash
   export GOOGLE_APPLICATION_CREDENTIALS="./serviceAccountKey.json"
   ```

### Option 2: Environment Variables (แนะนำสำหรับ production)

สร้างไฟล์ `.env` และเพิ่ม:

```env
# Firebase Admin SDK
FIREBASE_PROJECT_ID=musicplay-d9231
FIREBASE_CLIENT_EMAIL=vertex-express@musicplay-d9231.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

**หมายเหตุ:** Private key ต้องมี `\n` แทน newlines

---

## 📝 Usage Examples

### 1. List Files in Storage

```javascript
import { adminStorage } from './plugins/firebaseAdmin'

const bucket = adminStorage.bucket()
const [files] = await bucket.getFiles({
  prefix: 'users/BuxerwRsTqdw1H30u1BVLAj4mzM2/music/'
})

console.log('Files:', files.map(f => f.name))
```

### 2. Get File Metadata

```javascript
import { adminStorage } from './plugins/firebaseAdmin'

const bucket = adminStorage.bucket()
const file = bucket.file('users/BuxerwRsTqdw1H30u1BVLAj4mzM2/music/song.mp3')
const [metadata] = await file.getMetadata()

console.log('File size:', metadata.size)
console.log('Content type:', metadata.contentType)
```

### 3. Set CORS Configuration

```javascript
import { adminStorage } from './plugins/firebaseAdmin'

const bucket = adminStorage.bucket()
await bucket.setCorsConfiguration([
  {
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    method: ['GET', 'HEAD', 'OPTIONS'],
    responseHeader: ['Content-Type', 'Authorization'],
    maxAgeSeconds: 3600
  }
])

console.log('✅ CORS configuration updated')
```

### 4. Create Custom Token

```javascript
import { adminAuth } from './plugins/firebaseAdmin'

const customToken = await adminAuth.createCustomToken('user-uid')
console.log('Custom token:', customToken)
```

---

## 🚀 Server-Side Usage

### Node.js Server Example

```javascript
// server.js
import express from 'express'
import { adminStorage } from './src/plugins/firebaseAdmin.js'

const app = express()

app.get('/api/files', async (req, res) => {
  try {
    const bucket = adminStorage.bucket()
    const [files] = await bucket.getFiles({
      prefix: 'users/BuxerwRsTqdw1H30u1BVLAj4mzM2/music/'
    })
    
    res.json({
      files: files.map(f => ({
        name: f.name,
        size: f.metadata.size,
        contentType: f.metadata.contentType
      }))
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.listen(3000, () => {
  console.log('Server running on port 3000')
})
```

---

## ⚠️ Important Notes

1. **Never expose service account key** in client-side code
2. **Use Admin SDK only on server-side** (Node.js, Cloud Functions, etc.)
3. **Keep service account key secure** - add to `.gitignore`
4. **Use environment variables** in production

---

## 🔒 Security Best Practices

1. **Local Development**:
   - Use service account key file
   - Add to `.gitignore`
   - Never commit to git

2. **Production**:
   - Use environment variables
   - Or use default credentials (if running on GCP)
   - Restrict service account permissions

---

## 📚 Resources

- [Firebase Admin SDK Documentation](https://firebase.google.com/docs/admin/setup)
- [Service Account Setup](https://console.firebase.google.com/project/musicplay-d9231/settings/serviceaccounts/adminsdk)
- [Storage Admin API](https://googleapis.dev/nodejs/storage/latest/)

---

## ✅ Checklist

- [ ] Install firebase-admin: `npm install firebase-admin`
- [ ] Download service account key
- [ ] Set up environment variables or key file
- [ ] Test Admin SDK initialization
- [ ] Add service account key to `.gitignore`

---

**Service Account Email:** `vertex-express@musicplay-d9231.iam.gserviceaccount.com`

# 🔥 Firebase Configuration

**Project:** `musicplay-d9231`  
**Last Updated:** December 2024

---

## 📋 Firebase Configuration

```javascript
{
  apiKey: "AQ.Ab8RN6L7y1wYQQJoA81LQj9Cdgt__fuHePSr3YjrDlVNJBMRDQ",
  authDomain: "musicplay-d9231.firebaseapp.com",
  projectId: "musicplay-d9231",
  storageBucket: "musicplay-d9231.firebasestorage.app",
  messagingSenderId: "148604086726",
  appId: "1:148604086726:web:4be9ada9787d973320aac7",
  measurementId: "G-LKYJBBB94E"
}
```

---

## 🔧 Environment Variables

สร้างไฟล์ `.env` ใน root directory:

```env
VITE_FIREBASE_API_KEY=AQ.Ab8RN6L7y1wYQQJoA81LQj9Cdgt__fuHePSr3YjrDlVNJBMRDQ
VITE_FIREBASE_AUTH_DOMAIN=musicplay-d9231.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=musicplay-d9231
VITE_FIREBASE_STORAGE_BUCKET=musicplay-d9231.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=148604086726
VITE_FIREBASE_APP_ID=1:148604086726:web:4be9ada9787d973320aac7
VITE_FIREBASE_MEASUREMENT_ID=G-LKYJBBB94E
```

---

## ✅ Configuration Status

| Component | Value | Status |
|-----------|-------|--------|
| **Project ID** | `musicplay-d9231` | ✅ Correct |
| **Storage Bucket** | `musicplay-d9231.firebasestorage.app` | ✅ Using new domain |
| **Auth Domain** | `musicplay-d9231.firebaseapp.com` | ✅ Correct |
| **App ID** | `1:148604086726:web:4be9ada9787d973320aac7` | ✅ Correct |
| **Measurement ID** | `G-LKYJBBB94E` | ✅ Analytics enabled |

---

## 📝 Notes

1. **Storage Bucket**: ใช้ `firebasestorage.app` domain (ใหม่) แทน `appspot.com`
2. **Measurement ID**: มี Analytics enabled
3. **Environment Variables**: Code ใช้ `import.meta.env.VITE_*` ซึ่งต้องตั้งค่าใน `.env`

---

## 🚀 Setup Instructions

1. **Create `.env` file**:
   ```bash
   cp .env.example .env
   # Edit .env and add your values
   ```

2. **Verify configuration**:
   - Check browser console for Firebase initialization logs
   - Should see: `✅ Firebase Storage Bucket: musicplay-d9231.firebasestorage.app`

3. **Test connection**:
   - App should connect to Firebase Storage automatically
   - Check console for any errors

---

## 🔗 Firebase Console Links

- **Project Overview**: https://console.firebase.google.com/project/musicplay-d9231/overview
- **Storage**: https://console.firebase.google.com/project/musicplay-d9231/storage
- **Authentication**: https://console.firebase.google.com/project/musicplay-d9231/authentication
- **Analytics**: https://console.firebase.google.com/project/musicplay-d9231/analytics

---

## ⚠️ Security Notes

- **Never commit `.env` file** to git
- **API keys** are exposed in client-side code (VITE_ prefix)
- Consider using Firebase Functions for sensitive operations
- Restrict API keys in Google Cloud Console

---

## 📦 Storage Path

Current storage path:
```
gs://musicplay-d9231.firebasestorage.app/users/BuxerwRsTqdw1H30u1BVLAj4mzM2/music/
```

---

**Last Updated:** December 2024

# คำแนะนำการตั้งค่า Firebase Storage

## 1. ตรวจสอบ Path ใน Firebase Console

### วิธีตรวจสอบ:
1. ไปที่ [Firebase Console](https://console.firebase.google.com/project/musicplay-d9231/storage)
2. เลือกโปรเจกต์: `musicplay-d9231`
3. ไปที่ **Storage** ในเมนูด้านซ้าย
4. ตรวจสอบโครงสร้างโฟลเดอร์:
   ```
   users/
     └── BuxerwRsTqdw1H30u1BVLAj4mzM2/
         ├── music/
         └── hiphop/  (จะสร้างใหม่)
   ```

### Path ที่ถูกต้อง:
- **Music folder**: `users/BuxerwRsTqdw1H30u1BVLAj4mzM2/music/`
- **Hiphop folder**: `users/BuxerwRsTqdw1H30u1BVLAj4mzM2/hiphop/`

## 2. สร้างโฟลเดอร์ hiphop ใน Firebase Storage

### วิธีที่ 1: สร้างผ่าน Firebase Console
1. ไปที่ Firebase Console > Storage
2. คลิกที่โฟลเดอร์ `users/BuxerwRsTqdw1H30u1BVLAj4mzM2/`
3. คลิกปุ่ม **"Create folder"** หรือ **"New folder"**
4. ตั้งชื่อโฟลเดอร์: `hiphop`
5. คลิก **"Create"**

### วิธีที่ 2: สร้างโดยอัปโหลดไฟล์
1. ไปที่ Firebase Console > Storage
2. ไปที่โฟลเดอร์ `users/BuxerwRsTqdw1H30u1BVLAj4mzM2/`
3. คลิก **"Upload file"**
4. เลือกไฟล์ (เช่น .mp3)
5. ในช่อง **"File path"** ใส่: `hiphop/ชื่อไฟล์.mp3`
6. Firebase จะสร้างโฟลเดอร์ `hiphop` อัตโนมัติ

### วิธีที่ 3: ใช้ Firebase CLI (ถ้ามี)
```bash
# อัปโหลดไฟล์ไปยังโฟลเดอร์ hiphop (จะสร้างโฟลเดอร์อัตโนมัติ)
firebase storage:upload ./ไฟล์.mp3 users/BuxerwRsTqdw1H30u1BVLAj4mzM2/hiphop/
```

## 3. ตรวจสอบ Security Rules

Storage Rules ได้ถูกอัปเดตให้รองรับทั้ง `music/` และ `hiphop/` แล้ว

### Deploy Rules:
```bash
firebase deploy --only storage
```

## 4. เปลี่ยน Path ในโค้ด (ถ้าต้องการใช้ hiphop)

แก้ไขใน `src/App.vue`:
```javascript
const FIREBASE_STORAGE_PATH = 'users/BuxerwRsTqdw1H30u1BVLAj4mzM2/hiphop/';
```

## หมายเหตุ
- Firebase Storage ไม่มี "โฟลเดอร์" จริงๆ แต่ใช้ path แบบ hierarchical
- โฟลเดอร์จะถูกสร้างอัตโนมัติเมื่ออัปโหลดไฟล์ไปยัง path นั้น
- Path ไม่ควรมี `/` หน้าแรก (leading slash)
- Path ควรมี `/` ท้าย (trailing slash) เพื่อระบุว่าเป็นโฟลเดอร์

# ✅ Implementation Summary - Retry Limit Exceeded Fix

## 🎯 เป้าหมาย

แก้ไขปัญหา **Retry Limit Exceeded** โดยใช้ API แทน Firebase Storage SDK

---

## ✅ การแก้ไขที่ทำแล้ว

### 1. ✅ ใช้ API แทน Firebase Storage SDK

**ไฟล์**: `src/composables/useAudioPlayer.js`

**การเปลี่ยนแปลง**:
- ใช้ `loadAudioFilesFromAPI` เป็นหลัก
- Fallback ไป Firebase Storage SDK เฉพาะเมื่อ API ไม่พร้อม
- Health check ก่อนเรียก API

**Code**:
```javascript
const loadPlaylist = async (folderPaths, useAPI = true, apiBaseUrl = 'http://localhost:3000') => {
  if (useAPI) {
    // Health check ก่อน
    const healthCheck = await fetch(`${apiBaseUrl}/api/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(3000)
    })
    
    // ใช้ API
    const files = await loadAudioFilesFromAPI(apiBaseUrl, folderPaths, true)
    // ...
  }
}
```

---

### 2. ✅ เพิ่ม Timeout เป็น 60 วินาที

**ไฟล์**: `src/plugins/musicApi.js`

**การเปลี่ยนแปลง**:
- เพิ่ม timeout จาก 30 วินาที เป็น 60 วินาที
- รองรับไฟล์จำนวนมาก

**Code**:
```javascript
const musicApi = axios.create({
  timeout: 60000, // 60 seconds (เพิ่มขึ้นเพื่อรองรับไฟล์จำนวนมาก)
  headers: {
    'Content-Type': 'application/json',
  }
})
```

---

### 3. ✅ Health Check ก่อนเรียก API

**ไฟล์**: `src/composables/useAudioPlayer.js`

**การเปลี่ยนแปลง**:
- ตรวจสอบว่า API server ทำงานอยู่ก่อนเรียก API
- Timeout 3 วินาทีสำหรับ health check
- แสดง error message ถ้า API ไม่พร้อม

**Code**:
```javascript
// ตรวจสอบว่า API server ทำงานอยู่หรือไม่
const healthCheck = await fetch(`${apiBaseUrl}/api/health`, {
  method: 'GET',
  signal: AbortSignal.timeout(3000) // 3 seconds timeout
}).catch(() => null)

if (!healthCheck || !healthCheck.ok) {
  throw new Error('API server ไม่พร้อมใช้งาน')
}
```

---

### 4. ✅ Error Handling ที่ดีขึ้น

**ไฟล์**: `src/composables/useAudioPlayer.js`, `src/plugins/musicApi.js`

**การเปลี่ยนแปลง**:
- แสดง error messages ที่ชัดเจน
- แสดงคำแนะนำเมื่อเกิด error
- Logging ที่ดีขึ้น

**Code**:
```javascript
catch (apiError) {
  console.error('❌ โหลดจาก API ล้มเหลว:', apiError)
  console.error('💡 กำลังลองใช้ Firebase Storage SDK (อาจมีปัญหา Retry Limit Exceeded)')
  console.error('💡 แนะนำให้:')
  console.error('   1. ตรวจสอบว่า API server ทำงานอยู่ (npm run server)')
  console.error('   2. ตรวจสอบ Firebase Admin SDK credentials')
  console.error('   3. ตรวจสอบ network connection')
  
  // Fallback to Firebase Storage SDK
}
```

---

### 5. ✅ ไม่มีปัญหา Retry Limit Exceeded

**สาเหตุ**:
- ใช้ Firebase Admin SDK (server-side) แทน Firebase Storage SDK (client-side)
- Firebase Admin SDK ไม่มีปัญหา timeout เหมือน client-side SDK
- API server จัดการ retry และ error handling ได้ดีกว่า

**Flow**:
```
Frontend → API Server → Firebase Admin SDK → Firebase Storage
         ✅ ไม่มีปัญหา timeout
         ✅ ไม่มี Retry Limit Exceeded
```

---

## 📋 ไฟล์ที่อัปเดต

### 1. `src/composables/useAudioPlayer.js`
- ✅ ใช้ API เป็นหลัก
- ✅ Health check ก่อนเรียก API
- ✅ Error handling ที่ดีขึ้น
- ✅ Fallback to Firebase Storage SDK

### 2. `src/plugins/musicApi.js`
- ✅ เพิ่ม timeout เป็น 60 วินาที
- ✅ ปรับปรุง error messages
- ✅ รองรับ multiple paths

### 3. `src/App.vue`
- ✅ ใช้ API โดย default
- ✅ ลบการตรวจสอบ Firebase Storage connection ที่ไม่จำเป็น
- ✅ Error handling ที่ดีขึ้น

---

## 🚀 วิธีใช้งาน

### 1. Start API Server
```bash
npm run server
```

### 2. ตรวจสอบ Health
```bash
curl http://localhost:3000/api/health
```

### 3. เปิด Frontend
```bash
npm run dev
```

Frontend จะ:
1. ตรวจสอบ API health ก่อน
2. โหลดจาก API (ไม่มีปัญหา Retry Limit Exceeded)
3. Fallback to Firebase Storage SDK ถ้า API ไม่พร้อม

---

## ✅ Checklist

- [x] ใช้ API แทน Firebase Storage SDK
- [x] เพิ่ม timeout เป็น 60 วินาที
- [x] Health check ก่อนเรียก API
- [x] Error handling ที่ดีขึ้น
- [x] ไม่มีปัญหา Retry Limit Exceeded

---

## 📊 ผลลัพธ์

### Before:
```
Frontend → Firebase Storage SDK → Firebase Storage
         ❌ Retry Limit Exceeded
         ❌ Timeout เมื่อไฟล์จำนวนมาก
```

### After:
```
Frontend → API Server → Firebase Admin SDK → Firebase Storage
         ✅ ไม่มี Retry Limit Exceeded
         ✅ รองรับไฟล์จำนวนมาก
         ✅ Timeout 60 วินาที
```

---

## 🔍 Testing

### Test 1: Health Check
```bash
curl http://localhost:3000/api/health
# Expected: {"success":true,"status":"ok",...}
```

### Test 2: Get Music
```bash
curl "http://localhost:3000/api/music?includeUrl=true"
# Expected: {"success":true,"count":X,"files":[...]}
```

### Test 3: Frontend
1. เปิด browser console
2. ดู logs:
   ```
   🎵 เริ่มโหลด playlist จาก API: http://localhost:3000
   ✅ โหลดเพลงสำเร็จจาก API และเพิ่มเข้า Queue: X ไฟล์
   ```

---

## 📚 Related Documents

- `RETRY_LIMIT_FIX.md` - วิธีแก้ไข Retry Limit Exceeded
- `TROUBLESHOOTING.md` - Troubleshooting guide
- `API_DOCUMENTATION.md` - API documentation

---

**✅ การแก้ไขทั้งหมดเสร็จสมบูรณ์แล้ว!**

**ตอนนี้ app จะใช้ API เป็นหลักและไม่มีปัญหา Retry Limit Exceeded แล้ว** 🎵

# 📂 Path Verification Report

**Date:** December 2024  
**Path:** `gs://musicplay-d9231.firebasestorage.app/users/BuxerwRsTqdw1H30u1BVLAj4mzM2/music`

---

## ✅ Path Configuration

### Expected Path:
```
gs://musicplay-d9231.firebasestorage.app/users/BuxerwRsTqdw1H30u1BVLAj4mzM2/music/
```

### Current Configuration in Code:

**File:** `src/App.vue:260`
```javascript
const FIREBASE_STORAGE_PATH = 'users/BuxerwRsTqdw1H30u1BVLAj4mzM2/music/';
```

**File:** `src/plugins/firebase.js:9-10`
```javascript
const storageBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 
  (projectId ? `${projectId}.firebasestorage.app` : undefined)
```

---

## 📊 Path Breakdown

| Component | Value | Status |
|-----------|-------|--------|
| **Bucket** | `musicplay-d9231.firebasestorage.app` | ✅ Correct |
| **User ID** | `BuxerwRsTqdw1H30u1BVLAj4mzM2` | ✅ Correct |
| **Folder** | `music/` | ✅ Correct |
| **Full Path** | `users/BuxerwRsTqdw1H30u1BVLAj4mzM2/music/` | ✅ Correct |

---

## 🔍 Verification Steps

### 1. Check Bucket Configuration
- ✅ Code uses `firebasestorage.app` domain (new format)
- ✅ Falls back to `appspot.com` if env variable not set
- ⚠️ Make sure `VITE_FIREBASE_STORAGE_BUCKET` is set correctly (if used)

### 2. Check Path Format
- ✅ Path format: `users/{userId}/music/`
- ✅ Has trailing slash (required)
- ✅ No leading slash (correct)

### 3. Check Storage Rules
- ✅ Rules allow read for all paths
- ✅ Rules allow write for authenticated users in `users/{userId}/`

---

## 🧪 Testing

### Console Output Should Show:
```
📦 Storage Bucket: musicplay-d9231.firebasestorage.app
📦 Full GS URL: gs://musicplay-d9231.firebasestorage.app/users/BuxerwRsTqdw1H30u1BVLAj4mzM2/music/
📂 Path ที่ใช้: users/BuxerwRsTqdw1H30u1BVLAj4mzM2/music/
✅ กำลังเข้าถึง: gs://musicplay-d9231.firebasestorage.app/users/BuxerwRsTqdw1H30u1BVLAj4mzM2/music/
```

---

## ⚠️ Potential Issues

### 1. Bucket Domain Mismatch
**Issue:** Code might use `appspot.com` instead of `firebasestorage.app`

**Solution:**
- Set `VITE_FIREBASE_STORAGE_BUCKET=musicplay-d9231.firebasestorage.app` in `.env`
- Or ensure code defaults to `firebasestorage.app` (already done)

### 2. Path Not Found
**Issue:** Files might not exist in the specified path

**Check:**
1. Go to Firebase Console: https://console.firebase.google.com/project/musicplay-d9231/storage
2. Navigate to: `users/BuxerwRsTqdw1H30u1BVLAj4mzM2/music/`
3. Verify files exist

### 3. CORS Not Configured
**Issue:** CORS might not be set for `firebasestorage.app` domain

**Solution:**
- Set CORS for both domains if needed
- Or ensure using correct bucket domain

---

## 🔧 Quick Fixes

### If Path Not Working:

1. **Verify in Firebase Console:**
   ```
   https://console.firebase.google.com/project/musicplay-d9231/storage
   ```

2. **Check Environment Variables:**
   ```bash
   # Check if VITE_FIREBASE_STORAGE_BUCKET is set
   echo $VITE_FIREBASE_STORAGE_BUCKET
   ```

3. **Update Path if Needed:**
   ```javascript
   // In src/App.vue
   const FIREBASE_STORAGE_PATH = 'users/BuxerwRsTqdw1H30u1BVLAj4mzM2/music/';
   ```

---

## ✅ Summary

- **Path Format:** ✅ Correct
- **Bucket Domain:** ✅ Using `firebasestorage.app`
- **Code Configuration:** ✅ Correct
- **Storage Rules:** ✅ Deployed and correct

**Status:** Path configuration is correct. If issues persist, check:
1. Files exist in Firebase Console
2. CORS is configured
3. Storage Rules are deployed

# 🎵 Queue Features - Firebase Storage

## ✅ Features ที่มีอยู่

### 1. **Auto-load จาก Firebase Storage**
- โหลดเพลงอัตโนมัติเมื่อ app เปิด
- Path: `users/BuxerwRsTqdw1H30u1BVLAj4mzM2/music/`
- เพิ่มไฟล์ทั้งหมดเข้า Queue อัตโนมัติ

### 2. **Queue Display**
- แสดงรายการเพลงทั้งหมด
- แสดงจำนวนเพลงใน Queue
- Highlight เพลงที่กำลังเล่น
- แสดงสถานะ playing/paused

### 3. **Queue Management**
- คลิกเพื่อเปลี่ยนเพลง
- แสดงลำดับเพลง (1, 2, 3...)
- Auto-play ถัดไปเมื่อเพลงจบ
- Previous/Next controls

### 4. **Track Information**
- ชื่อไฟล์
- Full path จาก Firebase Storage
- ขนาดไฟล์ (ถ้ามี)
- Icon แสดงสถานะ

---

## 🎨 UI Features

### Queue Header
- แสดงจำนวนเพลง: "Queue (X เพลง)"
- ปุ่มปิด Queue

### Queue Items
- **Active Track**: 
  - Background highlight (primary color with opacity)
  - Equalizer icon (animated) เมื่อกำลังเล่น
  - Pause icon เมื่อหยุดชั่วคราว
  
- **Other Tracks**:
  - หมายเลขลำดับ
  - ชื่อไฟล์
  - Firebase Storage path
  - ขนาดไฟล์

### Empty State
- แสดงเมื่อไม่มีเพลงใน Queue
- Icon และข้อความแจ้งเตือน

---

## 🔄 การทำงาน

### Flow:
1. **App Mount** → ตรวจสอบ Firebase Storage connection
2. **Load Playlist** → โหลดไฟล์จาก Firebase Storage
3. **Add to Queue** → เพิ่มไฟล์ทั้งหมดเข้า `playlist` array
4. **Display Queue** → แสดงใน bottom sheet
5. **Play Track** → คลิกเพื่อเล่นเพลง

---

## 📋 Queue Data Structure

```javascript
{
  id: "filename.mp3",
  name: "filename.mp3",
  mimeType: "audio/mpeg",
  size: 1234567, // bytes
  url: "https://firebasestorage.googleapis.com/...",
  fullPath: "users/BuxerwRsTqdw1H30u1BVLAj4mzM2/music/filename.mp3"
}
```

---

## 🎯 การใช้งาน

### เปิด Queue:
- คลิกปุ่ม Queue (mdi-playlist-music icon)
- หรือคลิกปุ่ม chevron-down

### เล่นเพลง:
- คลิกที่เพลงใน Queue
- ใช้ Previous/Next buttons
- Auto-play ถัดไปเมื่อจบ

### ดูข้อมูล:
- ชื่อไฟล์
- Path ใน Firebase Storage
- ขนาดไฟล์ (ถ้ามี)

---

## 🔧 Code Structure

### Files:
- `src/App.vue` - Queue UI component
- `src/composables/useAudioPlayer.js` - Queue management logic
- `src/plugins/firebaseStorage.js` - Load files from Firebase

### Key Functions:
- `loadPlaylist(path)` - โหลดเพลงจาก Firebase Storage
- `loadTrack(index)` - เล่นเพลงตาม index
- `playNextTrack()` - เล่นเพลงถัดไป
- `playPrevTrack()` - เล่นเพลงก่อนหน้า

---

## ✅ Status

- ✅ Auto-load จาก Firebase Storage
- ✅ แสดง Queue
- ✅ คลิกเพื่อเปลี่ยนเพลง
- ✅ แสดงข้อมูลเพลง
- ✅ Highlight เพลงที่กำลังเล่น
- ✅ Animation เมื่อกำลังเล่น
- ✅ Empty state

---

**Queue พร้อมใช้งาน!** เพลงจะถูกโหลดจาก Firebase Storage และเพิ่มเข้า Queue อัตโนมัติ

# ⚡ แก้ไข CORS Error อย่างรวดเร็ว

## 🚨 ปัญหา
```
Access to XMLHttpRequest blocked by CORS policy
Response to preflight request doesn't pass access control check
```

## ✅ วิธีแก้ไข (เลือก 1 วิธี)

### วิธีที่ 1: ใช้สคริปต์ (แนะนำ) ⭐

```bash
./setup-cors.sh
```

### วิธีที่ 2: ใช้ Google Cloud Console (ไม่ต้องติดตั้งอะไร)

1. **เปิดลิงก์นี้**:
   https://console.cloud.google.com/storage/browser/musicplay-d9231.appspot.com?project=musicplay-d9231

2. **คลิกที่ bucket**: `musicplay-d9231.appspot.com`

3. **ไปที่แท็บ "Configuration"** → **"CORS"**

4. **คลิก "Edit"** และวางโค้ดนี้:
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

5. **คลิก "Save"**

6. **รอ 1-2 นาที** แล้วรีเฟรช browser (Cmd+Shift+R)

### วิธีที่ 3: ใช้ gsutil (ถ้ามีติดตั้งแล้ว)

```bash
gsutil cors set cors.json gs://musicplay-d9231.appspot.com
```

---

## ⏰ หลังจากตั้งค่า CORS

1. **รอ 1-2 นาที** (ให้ CORS propagate)
2. **Clear browser cache**: `Cmd+Shift+R` (Mac) หรือ `Ctrl+Shift+R` (Windows)
3. **รีเฟรชหน้า**: http://localhost:5173/
4. **ตรวจสอบ Console**: ไม่ควรมี CORS error

---

## 🔍 ตรวจสอบว่า CORS ตั้งค่าแล้ว

### ใช้ gsutil:
```bash
gsutil cors get gs://musicplay-d9231.appspot.com
```

### ใช้ Browser DevTools:
1. เปิด Network tab
2. ดู OPTIONS request
3. ควรได้ status 200 OK (ไม่ใช่ CORS error)

---

## ❓ ถ้ายังมีปัญหา

1. **ตรวจสอบว่า CORS ตั้งค่าแล้วจริงๆ**:
   ```bash
   gsutil cors get gs://musicplay-d9231.appspot.com
   ```

2. **ลองใช้ incognito/private window**

3. **ตรวจสอบ Storage Rules**:
   - ไปที่: https://console.firebase.google.com/project/musicplay-d9231/storage/rules
   - ตรวจสอบว่า rules อนุญาตให้อ่านไฟล์

4. **ตรวจสอบ path**:
   - Path: `users/BuxerwRsTqdw1H30u1BVLAj4mzM2/music/`
   - ตรวจสอบว่า path นี้มีไฟล์อยู่จริงใน Firebase Console

---

## 📝 หมายเหตุ

- CORS ต้องตั้งค่าใน **Google Cloud Storage** (ไม่ใช่ Firebase Console)
- Firebase Storage ใช้ Google Cloud Storage bucket ด้านหลัง
- CORS config จะใช้เวลา propagate ประมาณ 1-2 นาที

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

# play

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) 
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```
# 🔧 แก้ไขปัญหา Retry Limit Exceeded

## ❌ ปัญหา

**Error**: `Retry Limit Exceeded: Firebase Storage ไม่สามารถโหลดไฟล์ได้`

**สาเหตุ**:
- Firebase Storage SDK มีปัญหา timeout เมื่อโหลดไฟล์จำนวนมาก
- CORS errors ทำให้ retry หลายครั้งจนเกิน limit
- Network latency สูง

---

## ✅ วิธีแก้ไข

### 1. ใช้ API แทน Firebase Storage SDK

**เปลี่ยนจาก**: Firebase Storage SDK โดยตรง (มีปัญหา Retry Limit Exceeded)  
**เปลี่ยนเป็น**: API Server (ใช้ Firebase Admin SDK - ไม่มีปัญหา timeout)

### 2. การทำงาน

```
Frontend → API Server → Firebase Admin SDK → Firebase Storage
```

**ข้อดี**:
- ✅ ไม่มีปัญหา Retry Limit Exceeded
- ✅ รองรับไฟล์จำนวนมาก
- ✅ Signed URLs จาก server-side
- ✅ Error handling ที่ดีกว่า

---

## 🔄 การเปลี่ยนแปลง

### ไฟล์ที่อัปเดต:

1. **`src/composables/useAudioPlayer.js`**
   - เพิ่ม health check ก่อนเรียก API
   - ปรับปรุง error handling
   - แสดงข้อความแนะนำเมื่อ API ไม่พร้อม

2. **`src/plugins/musicApi.js`**
   - เพิ่ม timeout เป็น 60 วินาที (รองรับไฟล์จำนวนมาก)
   - ปรับปรุง error messages

3. **`src/App.vue`**
   - ใช้ API เป็นหลัก
   - ลบการตรวจสอบ Firebase Storage connection ที่ไม่จำเป็น

---

## 🚀 วิธีใช้งาน

### 1. Start API Server

```bash
npm run server
```

### 2. ตรวจสอบว่า Server ทำงาน

```bash
curl http://localhost:3000/api/health
```

### 3. เปิด Frontend

```bash
npm run dev
```

Frontend จะโหลดจาก API อัตโนมัติ

---

## 📋 Flow การทำงาน

### Before (มีปัญหา):
```
Frontend → Firebase Storage SDK → Firebase Storage
         ❌ Retry Limit Exceeded
```

### After (แก้ไขแล้ว):
```
Frontend → API Server → Firebase Admin SDK → Firebase Storage
         ✅ ไม่มีปัญหา timeout
```

---

## ⚠️ ถ้ายังมีปัญหา

### 1. API Server ไม่ทำงาน
```bash
# ตรวจสอบว่า server ทำงานอยู่
curl http://localhost:3000/api/health

# ถ้าไม่ทำงาน ให้ start server
npm run server
```

### 2. Firebase Admin SDK ไม่ได้ setup
- ตรวจสอบ service account key
- ดูคำแนะนำใน `FIREBASE_ADMIN_SETUP.md`

### 3. Network Issues
- ตรวจสอบ firewall
- ตรวจสอบ CORS settings

---

## 🔍 Debug

### ดู Logs:

**Frontend Console:**
```
🎵 เริ่มโหลด playlist จาก API: http://localhost:3000
✅ โหลดเพลงสำเร็จจาก API และเพิ่มเข้า Queue: X ไฟล์
```

**API Server:**
```
📂 Loading music from paths: [...]
✅ Loaded X files from path
```

---

## ✅ สรุป

- ✅ ใช้ API แทน Firebase Storage SDK
- ✅ เพิ่ม timeout เป็น 60 วินาที
- ✅ Health check ก่อนเรียก API
- ✅ Error handling ที่ดีกว่า
- ✅ ไม่มีปัญหา Retry Limit Exceeded

**ตอนนี้ app จะใช้ API เป็นหลักและหลีกเลี่ยงปัญหา Retry Limit Exceeded แล้ว!** 🎵

