// checkFirebase.mjs
// Simple script to verify Firebase initialization and list storage bucket contents
import { config } from 'dotenv';
config({ path: '.env' });
import { initializeApp } from 'firebase/app';
import { getStorage, ref, listAll } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

if (!firebaseConfig.storageBucket) {
  console.error('❌ Storage bucket not defined in env');
  process.exit(1);
}

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const storageRef = ref(storage);
listAll(storageRef)
  .then((result) => {
    console.log('✅ Firebase Storage initialized successfully.');
    console.log('Found', result.items.length, 'items in the bucket root.');
    result.items.forEach((itemRef) => {
      console.log(' -', itemRef.fullPath);
    });
  })
  .catch((error) => {
    console.error('❌ Error accessing Firebase Storage:', error);
  });
