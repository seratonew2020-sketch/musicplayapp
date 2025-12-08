// src/plugins/firebaseAdmin.js
// Firebase Admin SDK - สำหรับ server-side operations

import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getStorage } from 'firebase-admin/storage'
import { getAuth } from 'firebase-admin/auth'

// Service Account Configuration
// ใช้ environment variable หรือ service account key file
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID || 'musicplay-d9231',
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL || 'vertex-express@musicplay-d9231.iam.gserviceaccount.com',
  // Private key ควรมาจาก environment variable หรือไฟล์ key
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
}

// Initialize Firebase Admin (ถ้ายังไม่ได้ initialize)
let adminApp
if (getApps().length === 0) {
  try {
    // วิธีที่ 1: ใช้ service account object
    if (serviceAccount.privateKey) {
      adminApp = initializeApp({
        credential: cert(serviceAccount),
        projectId: serviceAccount.projectId,
        storageBucket: `${serviceAccount.projectId}.firebasestorage.app`,
      })
      console.log('✅ Firebase Admin SDK initialized with service account')
    } 
    // วิธีที่ 2: ใช้ service account key file
    else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      adminApp = initializeApp({
        credential: cert(process.env.GOOGLE_APPLICATION_CREDENTIALS),
        projectId: serviceAccount.projectId,
        storageBucket: `${serviceAccount.projectId}.firebasestorage.app`,
      })
      console.log('✅ Firebase Admin SDK initialized with key file')
    }
    // วิธีที่ 3: ใช้ default credentials (ถ้า run บน GCP)
    else {
      adminApp = initializeApp({
        projectId: serviceAccount.projectId,
        storageBucket: `${serviceAccount.projectId}.firebasestorage.app`,
      })
      console.log('✅ Firebase Admin SDK initialized with default credentials')
    }
  } catch (error) {
    console.error('❌ Failed to initialize Firebase Admin SDK:', error)
    throw error
  }
} else {
  adminApp = getApps()[0]
  console.log('✅ Firebase Admin SDK already initialized')
}

// Export Admin services
export const adminStorage = getStorage(adminApp)
export const adminAuth = getAuth(adminApp)
export { adminApp }

export default adminApp

