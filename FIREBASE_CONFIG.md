# Firebase Configuration for MiniFin

This document explains how to set up Firebase for the MiniFin application.

## Setting up Firebase

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use an existing one
3. Add a web app to your project
4. Get your Firebase configuration

## Environment Variables

Create a `.env.local` file in the root of your project with the following content:

```
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-measurement_id
```

Replace the placeholder values with your actual Firebase configuration.

## Setting up Firestore Database

1. In the Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in production mode" or "Start in test mode" (for development)
4. Select a location for your database
5. Click "Enable"

## Security Rules

For development, you can use the following security rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

For production, you should set up proper authentication and use more restrictive rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /transactions/{transactionId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Deployment on Vercel

When deploying to Vercel, add these environment variables in the Vercel dashboard:

1. Go to your project in the Vercel dashboard
2. Navigate to Settings > Environment Variables
3. Add each Firebase environment variable with its corresponding value
4. Deploy your application

## Firestore Collections Structure

The application uses the following Firestore collections:

### transactions

Fields:
- amount (number)
- description (string)
- date (string - ISO date format)
- type (string - "income" or "expense")
- category (string)
- createdAt (timestamp)
- updatedAt (timestamp)

## Testing the Setup

After setting up Firebase:

1. Go to the Settings page in the application
2. Navigate to the "Integrations" tab
3. Click "Sync to Firebase" to initialize the connection
4. Add some transactions to test the integration

## Troubleshooting

If you encounter issues with the Firebase integration:

1. Check that your environment variables are correctly set
2. Make sure your Firebase project is properly configured
3. Check the console for any error messages
4. Verify that your Firestore database is created and accessible 