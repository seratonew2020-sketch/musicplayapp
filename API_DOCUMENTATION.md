# 🎵 Music API Documentation

## 📡 API Endpoints

### Base URL
- **Local Development**: `http://localhost:3000`
- **Production**: (จะได้ URL หลัง deploy)

---

## 🎯 Endpoints

### 1. GET `/api/music`
ดึงรายการเพลงทั้งหมดจากหลายโฟลเดอร์

#### Query Parameters:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `paths` | string | No | `users/BuxerwRsTqdw1H30u1BVLAj4mzM2/music/,users/eGiEPTHkK1WAgzAuWtp2EgKdRIa2/music/` | Comma-separated paths |
| `includeUrl` | boolean | No | `false` | Include signed URLs |
| `expiresIn` | number | No | `3600` | URL expiration in seconds |

#### Example Requests:

**ดึงรายการเพลงทั้งหมด (default paths):**
```bash
GET http://localhost:3000/api/music
```

**ดึงรายการเพลงพร้อม URL:**
```bash
GET http://localhost:3000/api/music?includeUrl=true
```

**ดึงจาก path เฉพาะ:**
```bash
GET http://localhost:3000/api/music?paths=users/BuxerwRsTqdw1H30u1BVLAj4mzM2/music/
```

**ดึงจากหลาย paths:**
```bash
GET http://localhost:3000/api/music?paths=users/BuxerwRsTqdw1H30u1BVLAj4mzM2/music/,users/eGiEPTHkK1WAgzAuWtp2EgKdRIa2/music/
```

#### Response:
```json
{
  "success": true,
  "count": 10,
  "files": [
    {
      "id": "users/BuxerwRsTqdw1H30u1BVLAj4mzM2/music/song.mp3",
      "name": "song.mp3",
      "fullPath": "users/BuxerwRsTqdw1H30u1BVLAj4mzM2/music/song.mp3",
      "sourceFolder": "users/BuxerwRsTqdw1H30u1BVLAj4mzM2/music/",
      "sourceUser": "BuxerwRsTqdw1H30u1BVLAj4mzM2",
      "size": 1234567,
      "contentType": "audio/mpeg",
      "updated": "2024-01-01T00:00:00.000Z",
      "created": "2024-01-01T00:00:00.000Z",
      "url": "https://firebasestorage.googleapis.com/..." // if includeUrl=true
    }
  ],
  "paths": [
    "users/BuxerwRsTqdw1H30u1BVLAj4mzM2/music/",
    "users/eGiEPTHkK1WAgzAuWtp2EgKdRIa2/music/"
  ]
}
```

---

### 2. GET `/api/music/*`
ดึงรายการเพลงจาก path เฉพาะ

#### Path Parameter:
- `*` - Firebase Storage path (required)

#### Query Parameters:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `includeUrl` | boolean | No | `false` | Include signed URLs |
| `expiresIn` | number | No | `3600` | URL expiration in seconds |

#### Example Requests:

**ดึงจาก path เฉพาะ:**
```bash
GET http://localhost:3000/api/music/users/BuxerwRsTqdw1H30u1BVLAj4mzM2/music
```

**ดึงพร้อม URL:**
```bash
GET http://localhost:3000/api/music/users/BuxerwRsTqdw1H30u1BVLAj4mzM2/music?includeUrl=true
```

#### Response:
```json
{
  "success": true,
  "count": 5,
  "files": [
    {
      "id": "users/BuxerwRsTqdw1H30u1BVLAj4mzM2/music/song.mp3",
      "name": "song.mp3",
      "fullPath": "users/BuxerwRsTqdw1H30u1BVLAj4mzM2/music/song.mp3",
      "sourceFolder": "users/BuxerwRsTqdw1H30u1BVLAj4mzM2/music/",
      "sourceUser": "BuxerwRsTqdw1H30u1BVLAj4mzM2",
      "size": 1234567,
      "contentType": "audio/mpeg",
      "updated": "2024-01-01T00:00:00.000Z",
      "created": "2024-01-01T00:00:00.000Z",
      "url": "https://firebasestorage.googleapis.com/..." // if includeUrl=true
    }
  ],
  "path": "users/BuxerwRsTqdw1H30u1BVLAj4mzM2/music/"
}
```

---

### 3. GET `/api/music/url/*`
ดึง signed URL สำหรับไฟล์เพลงเฉพาะ

#### Path Parameter:
- `*` - Full file path in Firebase Storage (required)

#### Query Parameters:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `expiresIn` | number | No | `3600` | URL expiration in seconds |

#### Example Requests:

**ดึง URL สำหรับไฟล์:**
```bash
GET http://localhost:3000/api/music/url/users/BuxerwRsTqdw1H30u1BVLAj4mzM2/music/song.mp3
```

**ดึง URL ที่ expire ใน 1 ชั่วโมง:**
```bash
GET http://localhost:3000/api/music/url/users/BuxerwRsTqdw1H30u1BVLAj4mzM2/music/song.mp3?expiresIn=3600
```

#### Response:
```json
{
  "success": true,
  "url": "https://firebasestorage.googleapis.com/v0/b/musicplay-d9231.firebasestorage.app/o/users%2FBuxerwRsTqdw1H30u1BVLAj4mzM2%2Fmusic%2Fsong.mp3?alt=media&token=...",
  "path": "users/BuxerwRsTqdw1H30u1BVLAj4mzM2/music/song.mp3",
  "expiresIn": 3600
}
```

---

### 4. GET `/api/health`
Health check endpoint

#### Example Request:
```bash
GET http://localhost:3000/api/health
```

#### Response:
```json
{
  "success": true,
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

## 🔧 Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": "Path is required"
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "File not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Error message",
  "message": "ไม่สามารถดึงข้อมูลเพลงได้"
}
```

---

## 📋 Supported Audio Formats

- `.mp3`
- `.wav`
- `.ogg`
- `.m4a`
- `.aac`
- `.flac`
- `.webm`

---

## 🚀 การใช้งาน

### 1. Start Server (Local)
```bash
npm run server
# หรือ
npm run dev:server
```

### 2. Test API
```bash
# Health check
curl http://localhost:3000/api/health

# Get all music
curl http://localhost:3000/api/music

# Get music with URLs
curl "http://localhost:3000/api/music?includeUrl=true"
```

### 3. Use in Frontend
```javascript
// Load music from API
const response = await fetch('http://localhost:3000/api/music?includeUrl=true')
const data = await response.json()

if (data.success) {
  console.log(`Found ${data.count} songs`)
  data.files.forEach(file => {
    console.log(file.name, file.url)
  })
}
```

---

## 🔒 Security Notes

1. **Signed URLs**: URLs จะ expire ตาม `expiresIn` ที่กำหนด (default: 1 hour)
2. **CORS**: API รองรับ CORS สำหรับ localhost origins
3. **Authentication**: (สามารถเพิ่ม Firebase Auth middleware ได้ในอนาคต)

---

## 📚 Example Usage

### JavaScript/Fetch
```javascript
// Get all music
const getMusic = async () => {
  const response = await fetch('http://localhost:3000/api/music?includeUrl=true')
  const data = await response.json()
  return data.files
}

// Get music from specific path
const getMusicFromPath = async (path) => {
  const response = await fetch(`http://localhost:3000/api/music/${path}?includeUrl=true`)
  const data = await response.json()
  return data.files
}

// Get file URL
const getFileUrl = async (filePath) => {
  const response = await fetch(`http://localhost:3000/api/music/url/${filePath}`)
  const data = await response.json()
  return data.url
}
```

### Axios
```javascript
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000/api'
})

// Get all music
const music = await api.get('/music', {
  params: { includeUrl: true }
})

// Get from specific path
const music = await api.get('/music/users/BuxerwRsTqdw1H30u1BVLAj4mzM2/music', {
  params: { includeUrl: true }
})
```

---

**API พร้อมใช้งาน!** 🎵

