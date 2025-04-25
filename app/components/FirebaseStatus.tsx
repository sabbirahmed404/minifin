'use client';

import { useEffect, useState } from 'react';
import { isMockMode } from '../lib/firebase/config';
import { db } from '../lib/firebase/config';
import { collection, getDocs, limit, query } from 'firebase/firestore';
import { initAnalytics } from '../lib/firebase/analytics';

export default function FirebaseStatus() {
  const [status, setStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [message, setMessage] = useState<string>('Checking Firebase connection...');

  useEffect(() => {
    const checkFirebaseConnection = async () => {
      try {
        if (isMockMode) {
          setStatus('connected');
          setMessage('Using Firebase in mock mode (development only)');
          return;
        }

        // Try to initialize analytics
        await initAnalytics();

        // Try to query Firestore
        const testQuery = query(collection(db, 'transactions'), limit(1));
        await getDocs(testQuery);
        
        // If we get here, the connection is working
        setStatus('connected');
        setMessage('Connected to Firebase successfully');
      } catch (error: unknown) {
        console.error('Firebase connection error:', error);
        setStatus('error');
        setMessage(`Firebase connection error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    };

    checkFirebaseConnection();
  }, []);

  return (
    <div className="p-4 mb-4 rounded-lg border">
      <h3 className="text-lg font-medium mb-2">Firebase Status</h3>
      <div className="flex items-center">
        <div 
          className={`w-3 h-3 rounded-full mr-2 ${
            status === 'checking' ? 'bg-yellow-500' : 
            status === 'connected' ? 'bg-green-500' : 'bg-red-500'
          }`}
        />
        <p className={`text-sm ${
          status === 'checking' ? 'text-yellow-700' : 
          status === 'connected' ? 'text-green-700' : 'text-red-700'
        }`}>
          {message}
        </p>
      </div>
      {status === 'error' && (
        <p className="text-xs mt-2 text-gray-500">
          Check your Firebase configuration in the .env.local file.
        </p>
      )}
    </div>
  );
} 