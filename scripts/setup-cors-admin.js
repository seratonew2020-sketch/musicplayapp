// scripts/setup-cors-admin.js
// ตั้งค่า CORS โดยใช้ Firebase Admin SDK

import { initializeApp, cert } from 'firebase-admin/app'
import { getStorage } from 'firebase-admin/storage'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Service Account Configuration
const serviceAccountPath = join(__dirname, '../serviceAccountKey.json')
let serviceAccount

try {
  // วิธีที่ 1: อ่านจากไฟล์
  if (readFileSync(serviceAccountPath, { flag: 'r' })) {
    serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'))
    console.log('✅ Loaded service account from file')
  }
} catch (error) {
  // วิธีที่ 2: ใช้ environment variables
  serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID || 'musicplay-d9231',
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL || 'vertex-express@musicplay-d9231.iam.gserviceaccount.com',
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }
  console.log('✅ Using service account from environment variables')
}

if (!serviceAccount.privateKey) {
  console.error('❌ Service account private key not found')
  console.error('Please provide service account key file or environment variables')
  process.exit(1)
}

// Initialize Firebase Admin
const adminApp = initializeApp({
  credential: cert(serviceAccount),
  projectId: serviceAccount.projectId,
  storageBucket: `${serviceAccount.projectId}.firebasestorage.app`,
})

const adminStorage = getStorage(adminApp)
const bucket = adminStorage.bucket()

// CORS Configuration
const corsConfig = [
  {
    origin: [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:3000',
      'http://127.0.0.1:5173'
    ],
    method: ['GET', 'HEAD', 'OPTIONS'],
    responseHeader: ['Content-Type', 'Authorization', 'x-goog-resumable'],
    maxAgeSeconds: 3600
  }
]

// Set CORS
async function setupCors() {
  try {
    console.log('🔧 Setting up CORS for bucket:', bucket.name)
    console.log('📋 CORS Config:', JSON.stringify(corsConfig, null, 2))
    
    await bucket.setCorsConfiguration(corsConfig)
    
    console.log('✅ CORS configuration updated successfully!')
    console.log('⏰ CORS will propagate in 1-2 minutes')
    
    // Verify
    const [currentCors] = await bucket.getCorsConfiguration()
    console.log('📋 Current CORS:', JSON.stringify(currentCors, null, 2))
    
  } catch (error) {
    console.error('❌ Failed to set CORS:', error)
    process.exit(1)
  }
}

setupCors()

