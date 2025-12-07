# 🚀 Firebase App Hosting Backend Configuration Guide

## 📋 Overview

Firebase App Hosting ช่วยให้คุณสามารถ deploy full-stack applications พร้อม backend capabilities ได้

## 🛠️ การ Setup Backend

### วิธีที่ 1: ผ่าน Firebase Console

1. **เข้าสู่ Firebase Console**
   - ไปที่: https://console.firebase.google.com/project/musicplay-d9231
   - เลือกเมนู **"Build"** → **"App Hosting"**

2. **สร้าง Backend**
   - คลิก **"Create backend"** หรือ **"Get started"** (ถ้าเป็น backend แรก)
   - เลือกภูมิภาค (Region)
   - เชื่อมต่อกับ GitHub repository (ถ้ามี)
   - ตั้งค่า deployment configuration

3. **ตั้งค่า Environment Variables**
   - ไปที่ **"Settings"** → **"Environment variables"**
   - เพิ่ม secrets สำหรับ Firebase config:
     - `VITE_FIREBASE_API_KEY`
     - `VITE_FIREBASE_AUTH_DOMAIN`
     - `VITE_FIREBASE_MESSAGING_SENDER_ID`
     - `VITE_FIREBASE_APP_ID`

### วิธีที่ 2: ผ่าน Firebase CLI

#### ตรวจสอบ Firebase CLI Version
```bash
firebase --version
# ต้องเป็น 13.15.4 หรือใหม่กว่า
```

#### สร้าง Backend
```bash
# สร้าง backend ใหม่
firebase apphosting:backends:create --project musicplay-d9231

# ดูรายการ backends
firebase apphosting:backends:list --project musicplay-d9231
```

#### Deploy Backend
```bash
# Deploy ไปยัง production
firebase apphosting:backends:deploy BACKEND_ID --project musicplay-d9231

# Deploy ไปยัง staging
firebase apphosting:backends:deploy BACKEND_ID --project musicplay-d9231 --config apphosting.staging.yaml
```

## 📁 ไฟล์ Configuration

### `apphosting.yaml` (Default)
- Configuration หลักสำหรับ development
- ใช้สำหรับ local testing และ development environment

### `apphosting.production.yaml`
- Configuration สำหรับ production
- มี resource limits สูงกว่า (2 CPU, 1GB RAM)
- minInstances: 1 (เพื่อลด cold start)

### `apphosting.staging.yaml`
- Configuration สำหรับ staging/testing
- Resource limits ต่ำกว่า (1 CPU, 512MB RAM)
- minInstances: 0 (ประหยัด cost)

## 🔧 การจัดการ Backend

### ดูรายการ Backends
```bash
firebase apphosting:backends:list --project musicplay-d9231
```

### ดู Backend Details
```bash
firebase apphosting:backends:get BACKEND_ID --project musicplay-d9231
```

### ลบ Backend
```bash
# ผ่าน CLI
firebase apphosting:backends:delete BACKEND_ID --project musicplay-d9231

# ผ่าน Console
# Settings → Delete backend
```

### ตั้งค่า Deployment Settings
1. ไปที่ Firebase Console → App Hosting → Backend
2. เลือกแท็บ **"Deployment settings"**
3. ตั้งค่า:
   - **Auto-deploy**: เปิด/ปิดการ deploy อัตโนมัติ
   - **Live branch**: สาขาที่จะ deploy (เช่น `main`, `production`)
   - **Root directory**: ไดเรกทอรีรากของโปรเจกต์ (เช่น `/`)

## 🔐 การจัดการ Secrets

### เพิ่ม Secrets ผ่าน Firebase Console
1. ไปที่ **"Settings"** → **"Secrets"**
2. คลิก **"Add secret"**
3. ตั้งชื่อและค่า secret
4. ใช้ใน `apphosting.yaml`:
   ```yaml
   env:
     - variable: VITE_FIREBASE_API_KEY
       secret: firebase-api-key
   ```

### เพิ่ม Secrets ผ่าน CLI
```bash
# ใช้ Google Cloud Secret Manager
gcloud secrets create firebase-api-key --data-file=- <<< "YOUR_API_KEY"
```

## 📊 Monitoring และ Logs

### ดู Logs
```bash
# ดู logs ของ backend
firebase apphosting:backends:logs BACKEND_ID --project musicplay-d9231

# ดู logs แบบ real-time
firebase apphosting:backends:logs BACKEND_ID --project musicplay-d9231 --follow
```

### ดู Metrics
- ไปที่ Firebase Console → App Hosting → Backend
- เลือกแท็บ **"Metrics"** เพื่อดู:
  - Request count
  - Response time
  - Error rate
  - Resource usage

## 🔄 CI/CD Integration

### GitHub Actions Example
```yaml
name: Deploy to App Hosting

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          projectId: musicplay-d9231
          channelId: live
```

## ⚙️ Configuration Options

### Runtime
- `nodejs20`: Node.js 20 (แนะนำ)
- `nodejs18`: Node.js 18

### Resources
- **CPU**: 1-4 cores
- **Memory**: 512Mi - 4Gi
- **Scaling**: minInstances (0-10), maxInstances (1-100)

### Health Check
- **Path**: Path สำหรับ health check endpoint
- **Interval**: ความถี่ในการตรวจสอบ (30s)
- **Timeout**: เวลารอ response (5s)
- **Failure Threshold**: จำนวนครั้งที่ล้มเหลวก่อน restart (3)

## 🚨 Troubleshooting

### Backend ไม่ deploy
- ตรวจสอบว่าไฟล์ `apphosting.yaml` อยู่ใน root directory
- ตรวจสอบ build commands ว่าถูกต้อง
- ดู logs ใน Firebase Console

### Environment Variables ไม่ทำงาน
- ตรวจสอบว่า secrets ถูกตั้งค่าใน Firebase Console
- ตรวจสอบ syntax ใน `apphosting.yaml`
- ใช้ `value` สำหรับค่าคงที่, `secret` สำหรับ sensitive data

### Resource Limits
- หาก backend crash บ่อย อาจต้องเพิ่ม memory หรือ CPU
- ตรวจสอบ logs เพื่อดู error messages

## 📚 Resources

- [Firebase App Hosting Documentation](https://firebase.google.com/docs/app-hosting)
- [Configuration Reference](https://firebase.google.com/docs/app-hosting/configure)
- [CLI Commands](https://firebase.google.com/docs/cli/apphosting)

## 🔗 Quick Links

- **Firebase Console**: https://console.firebase.google.com/project/musicplay-d9231/apphosting
- **Project Console**: https://console.firebase.google.com/project/musicplay-d9231/overview

