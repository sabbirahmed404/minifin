// firebase-test.js
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, limit, query } = require('firebase/firestore');
const { getAnalytics, isSupported } = require('firebase/analytics');
require('dotenv').config(); // Load environment variables from .env.local

// Check if we have Firebase config
const isMockMode = 
  !process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY === 'your_firebase_api_key';

// Create config from env vars or use mock
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

// Print config status
console.log('Using Firebase config:', isMockMode ? 'MOCK MODE' : 'REAL CONFIG');

async function testFirebase() {
  try {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    console.log('✅ Firebase app initialized successfully');
    
    // Initialize Firestore
    const db = getFirestore(app);
    console.log('✅ Firestore initialized successfully');
    
    // Test Firestore query
    try {
      const testQuery = query(collection(db, 'transactions'), limit(1));
      const snapshot = await getDocs(testQuery);
      console.log(`✅ Firestore query successful. Found ${snapshot.size} documents.`);
    } catch (error) {
      console.error('❌ Firestore query failed:', error.message);
    }
    
    // Analytics can't be tested in Node.js environment
    console.log('ℹ️ Note: Firebase Analytics cannot be tested in Node.js environment');
    
    console.log('\n🔍 Firebase Config Summary:');
    console.log(`Project ID: ${firebaseConfig.projectId}`);
    console.log(`Auth Domain: ${firebaseConfig.authDomain}`);
    
    return true;
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error);
    return false;
  }
}

// Run the test
testFirebase()
  .then(success => {
    if (success) {
      console.log('\n✅ Firebase connection test completed successfully');
    } else {
      console.log('\n❌ Firebase connection test failed');
    }
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Unexpected error during test:', error);
    process.exit(1);
  });