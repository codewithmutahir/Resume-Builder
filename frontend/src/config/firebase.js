import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration (Firestore only - using Cloudinary for storage)
// These values should be set in your .env file
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Check if Firebase config is provided
const isFirebaseConfigured = Object.values(firebaseConfig).every(value => value && value !== 'your_api_key_here');

if (!isFirebaseConfigured) {
  console.warn(
    'Firebase is not configured. Please set up Firebase environment variables in your .env file.\n' +
    'See FIREBASE_SETUP.md for instructions.'
  );
}

// Initialize Firebase only if configured
let app = null;
let db = null;

if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
  } catch (error) {
    console.error('Error initializing Firebase:', error);
  }
}

export { db };
export default app;

