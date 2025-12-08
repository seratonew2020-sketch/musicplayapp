// src/plugins/firebase.js
import { initializeApp } from 'firebase/app'
import { getStorage } from 'firebase/storage'

const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID

// สร้าง storageBucket อัตโนมัติจาก projectId ถ้าไม่ได้ตั้งค่าใน env
// ใช้ firebasestorage.app domain (ใหม่) หรือ appspot.com (เก่า)
const storageBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 
  (projectId ? `${projectId}.firebasestorage.app` : undefined)

if (!storageBucket) {
  console.error('❌ Firebase Storage Bucket ไม่ได้ถูกตั้งค่า และไม่สามารถสร้างจาก projectId ได้')
} else {
  console.log('✅ Firebase Storage Bucket:', storageBucket)
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: projectId,
  storageBucket: storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Storage
const storage = getStorage(app)

export { app, storage }
export default app


