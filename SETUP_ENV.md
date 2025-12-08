# 🔧 Environment Variables Setup

## Quick Setup

### 1. Create `.env` file

```bash
# Copy from example
cp .env.example .env

# Or create manually
touch .env
```

### 2. Add Firebase Configuration

Edit `.env` file and add:

```env
VITE_FIREBASE_API_KEY=AQ.Ab8RN6L7y1wYQQJoA81LQj9Cdgt__fuHePSr3YjrDlVNJBMRDQ
VITE_FIREBASE_AUTH_DOMAIN=musicplay-d9231.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=musicplay-d9231
VITE_FIREBASE_STORAGE_BUCKET=musicplay-d9231.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=148604086726
VITE_FIREBASE_APP_ID=1:148604086726:web:4be9ada9787d973320aac7
VITE_FIREBASE_MEASUREMENT_ID=G-LKYJBBB94E
```

### 3. Restart Dev Server

```bash
# Stop current server (Ctrl+C)
npm run dev
```

---

## ✅ Verification

After setting up `.env`, check browser console:

```
✅ Firebase Storage Bucket: musicplay-d9231.firebasestorage.app
```

---

## ⚠️ Important

- **Never commit `.env` to git** (already in `.gitignore`)
- **Restart dev server** after changing `.env`
- **VITE_ prefix** is required for Vite to expose variables

---

## 📝 Current Configuration

- **Project**: `musicplay-d9231`
- **Storage Bucket**: `musicplay-d9231.firebasestorage.app` (new domain)
- **Path**: `users/BuxerwRsTqdw1H30u1BVLAj4mzM2/music/`

