# คำแนะนำการตั้งค่า Firebase Storage

## 1. ตรวจสอบ Path ใน Firebase Console

### วิธีตรวจสอบ:
1. ไปที่ [Firebase Console](https://console.firebase.google.com/project/musicplay-d9231/storage)
2. เลือกโปรเจกต์: `musicplay-d9231`
3. ไปที่ **Storage** ในเมนูด้านซ้าย
4. ตรวจสอบโครงสร้างโฟลเดอร์:
   ```
   users/
     └── BuxerwRsTqdw1H30u1BVLAj4mzM2/
         ├── music/
         └── hiphop/  (จะสร้างใหม่)
   ```

### Path ที่ถูกต้อง:
- **Music folder**: `users/BuxerwRsTqdw1H30u1BVLAj4mzM2/music/`
- **Hiphop folder**: `users/BuxerwRsTqdw1H30u1BVLAj4mzM2/hiphop/`

## 2. สร้างโฟลเดอร์ hiphop ใน Firebase Storage

### วิธีที่ 1: สร้างผ่าน Firebase Console
1. ไปที่ Firebase Console > Storage
2. คลิกที่โฟลเดอร์ `users/BuxerwRsTqdw1H30u1BVLAj4mzM2/`
3. คลิกปุ่ม **"Create folder"** หรือ **"New folder"**
4. ตั้งชื่อโฟลเดอร์: `hiphop`
5. คลิก **"Create"**

### วิธีที่ 2: สร้างโดยอัปโหลดไฟล์
1. ไปที่ Firebase Console > Storage
2. ไปที่โฟลเดอร์ `users/BuxerwRsTqdw1H30u1BVLAj4mzM2/`
3. คลิก **"Upload file"**
4. เลือกไฟล์ (เช่น .mp3)
5. ในช่อง **"File path"** ใส่: `hiphop/ชื่อไฟล์.mp3`
6. Firebase จะสร้างโฟลเดอร์ `hiphop` อัตโนมัติ

### วิธีที่ 3: ใช้ Firebase CLI (ถ้ามี)
```bash
# อัปโหลดไฟล์ไปยังโฟลเดอร์ hiphop (จะสร้างโฟลเดอร์อัตโนมัติ)
firebase storage:upload ./ไฟล์.mp3 users/BuxerwRsTqdw1H30u1BVLAj4mzM2/hiphop/
```

## 3. ตรวจสอบ Security Rules

Storage Rules ได้ถูกอัปเดตให้รองรับทั้ง `music/` และ `hiphop/` แล้ว

### Deploy Rules:
```bash
firebase deploy --only storage
```

## 4. เปลี่ยน Path ในโค้ด (ถ้าต้องการใช้ hiphop)

แก้ไขใน `src/App.vue`:
```javascript
const FIREBASE_STORAGE_PATH = 'users/BuxerwRsTqdw1H30u1BVLAj4mzM2/hiphop/';
```

## หมายเหตุ
- Firebase Storage ไม่มี "โฟลเดอร์" จริงๆ แต่ใช้ path แบบ hierarchical
- โฟลเดอร์จะถูกสร้างอัตโนมัติเมื่ออัปโหลดไฟล์ไปยัง path นั้น
- Path ไม่ควรมี `/` หน้าแรก (leading slash)
- Path ควรมี `/` ท้าย (trailing slash) เพื่อระบุว่าเป็นโฟลเดอร์

