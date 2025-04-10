// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// Firebase config from env
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Validate env vars
const requiredVars = Object.entries(firebaseConfig);
const missing = requiredVars.filter(([, value]) => !value).map(([key]) => key);

if (missing.length > 0) {
  console.error('[Firebase] Missing environment variables:', missing);
}

const shouldInitialize = missing.length === 0;

let app: FirebaseApp | undefined;
let auth: Auth | null = null;
let db: Firestore | null = null;

if (shouldInitialize) {
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
console.log('firebaseConfig', firebaseConfig);
  console.log('app', app);
  if (typeof window !== 'undefined') {
    auth = getAuth(app);
    db = getFirestore(app);
  } else {
    console.warn('[Firebase] Skipped auth/db init on server');
  }
}

export { auth, db };
