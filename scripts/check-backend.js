#!/usr/bin/env node
/**
 * Backend Health Check Script
 * ตรวจสอบว่า backend dependencies และ configuration พร้อมใช้งาน
 */

import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { readFileSync, existsSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, '..')

console.log('🔍 กำลังตรวจสอบ Backend Setup...\n')

// 1. ตรวจสอบ Dependencies
console.log('📦 ตรวจสอบ Dependencies:')
const packageJson = JSON.parse(readFileSync(join(rootDir, 'package.json'), 'utf8'))
const requiredDeps = ['express', 'cors', 'firebase-admin', 'dotenv']

let allDepsInstalled = true
for (const dep of requiredDeps) {
  if (packageJson.dependencies?.[dep]) {
    console.log(`   ✅ ${dep}@${packageJson.dependencies[dep]}`)
  } else {
    console.log(`   ❌ ${dep} - ไม่พบ`)
    allDepsInstalled = false
  }
}

// 2. ตรวจสอบไฟล์ที่สำคัญ
console.log('\n📁 ตรวจสอบไฟล์ที่สำคัญ:')
const importantFiles = [
  'server.js',
  'src/plugins/firebaseAdmin.js'
]

for (const file of importantFiles) {
  const filePath = join(rootDir, file)
  if (existsSync(filePath)) {
    console.log(`   ✅ ${file}`)
  } else {
    console.log(`   ❌ ${file} - ไม่พบ`)
  }
}

// 3. ตรวจสอบ Firebase Admin SDK Configuration
console.log('\n🔐 ตรวจสอบ Firebase Admin SDK Configuration:')

// ตรวจสอบ service account key file
const serviceAccountKeyPath = join(rootDir, 'serviceAccountKey.json')
if (existsSync(serviceAccountKeyPath)) {
  console.log('   ✅ serviceAccountKey.json พบ')
  try {
    const key = JSON.parse(readFileSync(serviceAccountKeyPath, 'utf8'))
    if (key.private_key && key.client_email) {
      console.log('   ✅ Service account key ถูกต้อง')
    } else {
      console.log('   ⚠️  Service account key อาจไม่สมบูรณ์')
    }
  } catch (error) {
    console.log('   ❌ Service account key ไม่ถูกต้อง:', error.message)
  }
} else {
  console.log('   ⚠️  serviceAccountKey.json ไม่พบ')
  console.log('   💡 ใช้ environment variables แทน (FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL)')
}

// ตรวจสอบ environment variables
const envPath = join(rootDir, '.env')
if (existsSync(envPath)) {
  console.log('   ✅ .env file พบ')
} else {
  console.log('   ⚠️  .env file ไม่พบ (optional)')
}

// 4. ตรวจสอบ Node.js version
console.log('\n🟢 ตรวจสอบ Node.js:')
console.log(`   ✅ Node.js ${process.version}`)

// 5. สรุป
console.log('\n📊 สรุป:')
if (allDepsInstalled) {
  console.log('   ✅ Dependencies พร้อมใช้งาน')
  console.log('   ✅ Backend setup เสร็จสมบูรณ์')
  console.log('\n🚀 เริ่มใช้งาน:')
  console.log('   npm run server')
} else {
  console.log('   ❌ Dependencies บางตัวยังไม่ได้ติดตั้ง')
  console.log('\n💡 ติดตั้ง dependencies:')
  console.log('   npm install express cors firebase-admin dotenv')
}

console.log('\n📚 ดูคำแนะนำเพิ่มเติม:')
console.log('   - BACKEND_SETUP.md')
console.log('   - FIREBASE_ADMIN_SETUP.md')
console.log('   - API_DOCUMENTATION.md')

