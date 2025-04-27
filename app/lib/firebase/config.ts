// Firebase configuration
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Check if we're in development mode and use mock values if no API keys are provided
const isMockMode = 
  !process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY === 'your_firebase_api_key';

// Create development mock config if needed
const firebaseConfig = isMockMode 
  ? {
    apiKey: "mock-api-key-for-development",
    authDomain: "mock-project.firebaseapp.com",
    projectId: "mock-project-id",
    storageBucket: "mock-project.appspot.com",
    messagingSenderId: "000000000000",
    appId: "1:000000000000:web:0000000000000000000000",
    measurementId: "G-00000000",
  }
  : {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };

// Print a warning if using mock config in development
if (isMockMode && process.env.NODE_ENV !== 'production') {
  console.warn('Using mock Firebase configuration for development. Please set up proper environment variables for production.');
}

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);
const auth = getAuth(app);

// Helper function to check if in demo mode (will be used to prevent Firebase operations)
const isInDemoMode = () => {
  try {
    // In client-side code, check localStorage
    if (typeof window !== 'undefined') {
      // Check for demo_mode in localStorage
      const isDemoMode = localStorage.getItem('demo_mode') === 'true';
      
      // Check URL for demo indicator as fallback (useful for direct links to other pages)
      const isOnDemoPage = typeof window !== 'undefined' && 
        (window.location.pathname.includes('/demo') || 
         window.location.search.includes('demo=true'));
      
      return isDemoMode || isOnDemoPage;
    }
    return false;
  } catch (error) {
    console.error('Error checking demo mode:', error);
    return false;
  }
};

export { app, db, auth, isMockMode, isInDemoMode }; 