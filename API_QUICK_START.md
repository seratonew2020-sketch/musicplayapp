# 🚀 API Quick Start Guide

## 📡 API Endpoints สำหรับดึงเพลง

### Base URL
- **Local**: `http://localhost:3000`
- **Production**: (จะได้ URL หลัง deploy)

---

## 🎯 ลิงค์ API หลัก

### 1. ดึงรายการเพลงทั้งหมด (2 โฟลเดอร์)
```
GET http://localhost:3000/api/music
```

### 2. ดึงรายการเพลงพร้อม URL
```
GET http://localhost:3000/api/music?includeUrl=true
```

### 3. ดึงจาก path เฉพาะ
```
GET http://localhost:3000/api/music/users/BuxerwRsTqdw1H30u1BVLAj4mzM2/music
```

### 4. ดึง URL สำหรับไฟล์เฉพาะ
```
GET http://localhost:3000/api/music/url/users/BuxerwRsTqdw1H30u1BVLAj4mzM2/music/song.mp3
```

---

## 🚀 วิธีใช้งาน

### 1. Start Server
```bash
npm run server
```

### 2. Test API
```bash
# Health check
curl http://localhost:3000/api/health

# Get all music
curl http://localhost:3000/api/music

# Get with URLs
curl "http://localhost:3000/api/music?includeUrl=true"
```

### 3. ใช้ใน Frontend
```javascript
// ดึงรายการเพลงทั้งหมด
const response = await fetch('http://localhost:3000/api/music?includeUrl=true')
const data = await response.json()

if (data.success) {
  console.log(`พบ ${data.count} เพลง`)
  data.files.forEach(file => {
    console.log(file.name, file.url)
  })
}
```

---

## 📋 Response Format

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
      "url": "https://firebasestorage.googleapis.com/..." // if includeUrl=true
    }
  ]
}
```

---

## 🔗 ลิงค์ที่ใช้บ่อย

### Default Paths (2 โฟลเดอร์):
- `users/BuxerwRsTqdw1H30u1BVLAj4mzM2/music/`
- `users/eGiEPTHkK1WAgzAuWtp2EgKdRIa2/music/`

### API Links:
- **All Music**: `http://localhost:3000/api/music`
- **With URLs**: `http://localhost:3000/api/music?includeUrl=true`
- **User 1**: `http://localhost:3000/api/music/users/BuxerwRsTqdw1H30u1BVLAj4mzM2/music`
- **User 2**: `http://localhost:3000/api/music/users/eGiEPTHkK1WAgzAuWtp2EgKdRIa2/music`

---

**ดูเอกสารเต็มที่**: `API_DOCUMENTATION.md`

