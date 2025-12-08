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

