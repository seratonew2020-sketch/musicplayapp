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

