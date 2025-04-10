import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};
console.log('Firebase config:', firebaseConfig);
// Initialize Firebase
let app: FirebaseApp;
let auth: Auth | null = null;
let db: Firestore | null = null;

try {
  // Check if Firebase is already initialized
  if (!getApps().length) {
    // Validate required environment variables
    const requiredEnvVars = [
      'NEXT_PUBLIC_FIREBASE_API_KEY',
      'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
      'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
      'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
      'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
      'NEXT_PUBLIC_FIREBASE_APP_ID'
    ];

    const missingVars = requiredEnvVars.filter(
      (envVar) => !process.env[envVar]
    );

    if (missingVars.length > 0) {
      console.error('Missing Firebase environment variables:', missingVars);
      throw new Error('Missing required Firebase environment variables');
    }

    // Initialize Firebase
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }

  // Only initialize auth and firestore in the browser
  if (typeof window !== 'undefined') {
    auth = getAuth(app);
    db = getFirestore(app);
  }
} catch (error) {
  console.error('Firebase initialization error:', error);
  // Don't throw the error to prevent the app from crashing
  // Instead, we'll handle it gracefully in the components
}

export { auth, db };
