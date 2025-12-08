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

