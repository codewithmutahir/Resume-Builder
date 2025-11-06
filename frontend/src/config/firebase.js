import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Firebase configuration (Firestore and Authentication)
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
let auth = null;

if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    
    // Set language code for auth
    auth.languageCode = 'en';
    
    console.log('Firebase initialized successfully');
    console.log('Auth domain:', firebaseConfig.authDomain);
    console.log('Project ID:', firebaseConfig.projectId);
    // Log first and last 10 chars of API key for debugging (don't log full key)
    if (firebaseConfig.apiKey) {
      const apiKeyPreview = `${firebaseConfig.apiKey.substring(0, 10)}...${firebaseConfig.apiKey.substring(firebaseConfig.apiKey.length - 10)}`;
      console.log('API Key (preview):', apiKeyPreview);
      console.log('API Key length:', firebaseConfig.apiKey.length);
    }
  } catch (error) {
    console.error('Error initializing Firebase:', error);
    console.error('Please check your Firebase configuration and ensure all environment variables are set correctly.');
  }
} else {
  console.error('Firebase configuration is incomplete. Please check your .env file.');
}

export { db, auth };
export default app;

