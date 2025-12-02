import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "AIzaSyBZVeDfxV_zvemlV1kLOI7BQWh1ZWNdcNE",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "hooki-9925e.firebaseapp.com",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "hooki-9925e",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "hooki-9925e.firebasestorage.app",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "62393363024",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "1:62393363024:web:74b1e0ced3ea97e7b6ff55",
};

// Log to verify config is loaded (remove in production)
console.log('Firebase Config Loaded:', {
  apiKey: firebaseConfig.apiKey ? '✅ Loaded' : '❌ Missing',
  projectId: firebaseConfig.projectId,
});

// Initialize Firebase
let app;
let auth;

try {
  app = initializeApp(firebaseConfig);
  console.log('✅ Firebase App Initialized');
  
  // Initialize Firebase Authentication with React Native persistence
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
  console.log('✅ Firebase Auth Initialized');
} catch (error) {
  // If already initialized, get the existing instance
  console.log('Firebase already initialized, using existing instance');
  const { getApp } = require('firebase/app');
  app = getApp();
  auth = getAuth(app);
}

// Initialize Firestore
const db = getFirestore(app);
console.log('✅ Firestore Initialized');

// Initialize Storage
const storage = getStorage(app);
console.log('✅ Storage Initialized');

export { app, auth, db, storage };

