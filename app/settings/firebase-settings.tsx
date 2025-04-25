'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useFinance } from '../lib/data/FinanceContext';
import { isMockMode, db } from '../lib/firebase/config';
import { collection, getDocs, limit, query } from 'firebase/firestore';
import { initAnalytics } from '../lib/firebase/analytics';
import { Check, X, RefreshCw, Database, Download, Info, ArrowUpDown } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';

export default function FirebaseSettings() {
  const { 
    syncWithFirestore,
    loadFromFirestore, 
    isFirestoreSynced,
    isLoading,
    transactions
  } = useFinance();
  
  const [syncMessage, setSyncMessage] = useState('');
  const [firestoreStatus, setFirestoreStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [firestoreErrorMessage, setFirestoreErrorMessage] = useState("");
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [connectionMessage, setConnectionMessage] = useState<string>('Checking Firebase connection...');

  // Check Firebase connection
  useEffect(() => {
    const checkFirebaseConnection = async () => {
      try {
        if (isMockMode) {
          setConnectionStatus('connected');
          setConnectionMessage('Using Firebase in mock mode (development only)');
          return;
        }

        // Try to initialize analytics
        await initAnalytics();

        // Try to query Firestore
        const testQuery = query(collection(db, 'transactions'), limit(1));
        await getDocs(testQuery);
        
        // If we get here, the connection is working
        setConnectionStatus('connected');
        setConnectionMessage('Connected to Firebase successfully');
      } catch (error: any) {
        console.error('Firebase connection error:', error);
        setConnectionStatus('error');
        setConnectionMessage(`Firebase connection error: ${error?.message || 'Unknown error'}`);
      }
    };

    checkFirebaseConnection();
  }, []);

  const handleSyncWithFirestore = async () => {
    setFirestoreStatus("loading");
    try {
      setSyncMessage('Syncing with Firestore...');
      const success = await syncWithFirestore();
      if (success) {
        setFirestoreStatus("success");
        setSyncMessage('Successfully synced with Firestore!');
        setTimeout(() => setFirestoreStatus("idle"), 3000);
      } else {
        setFirestoreStatus("error");
        setFirestoreErrorMessage("Failed to sync with Firestore. Check console for details.");
        setSyncMessage('Failed to sync with Firestore. Check console for details.');
      }
    } catch (error: any) {
      setFirestoreStatus("error");
      setFirestoreErrorMessage(error?.message || "An unknown error occurred");
      setSyncMessage('Error syncing with Firestore. Check console for details.');
    }
  };

  const handleLoadFromFirestore = async () => {
    setFirestoreStatus("loading");
    try {
      setSyncMessage('Loading from Firestore...');
      const success = await loadFromFirestore();
      if (success) {
        setFirestoreStatus("success");
        setSyncMessage('Successfully loaded data from Firestore!');
        setTimeout(() => setFirestoreStatus("idle"), 3000);
      } else {
        setFirestoreStatus("error");
        setFirestoreErrorMessage("Failed to load from Firestore. Check console for details.");
        setSyncMessage('Failed to load from Firestore. Check console for details.');
      }
    } catch (error: any) {
      setFirestoreStatus("error");
      setFirestoreErrorMessage(error?.message || "An unknown error occurred");
      setSyncMessage('Error loading from Firestore. Check console for details.');
    }
  };

  return (
    <Card className="bg-card border-[#BE3144]/30">
      <CardHeader>
        <CardTitle>Firebase Integration</CardTitle>
        <p className="text-sm text-muted-foreground">Manage your transaction data with Firebase Firestore</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Mode Indicator */}
        {isMockMode ? (
          <Alert variant="warning" className="bg-yellow-500/10 text-yellow-700 border-yellow-700/20">
            <Info className="h-4 w-4" />
            <AlertTitle>Development Mode</AlertTitle>
            <AlertDescription>
              Running in mock mode with simulated Firebase. Set up Firebase environment variables to use real Firebase.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert variant="default" className="bg-blue-500/10 text-blue-700 border-blue-700/20">
            <Info className="h-4 w-4" />
            <AlertTitle>Firebase Mode</AlertTitle>
            <AlertDescription>
              The app is configured to use Firebase Firestore as the primary data store. 
              All transactions are automatically synced with Firebase.
            </AlertDescription>
          </Alert>
        )}
        
        {/* Firebase Connection Status */}
        <div className="p-4 rounded-lg border">
          <h3 className="text-lg font-medium mb-2">Firebase Status</h3>
          <div className="flex items-center">
            <div 
              className={`w-3 h-3 rounded-full mr-2 ${
                connectionStatus === 'checking' ? 'bg-yellow-500' : 
                connectionStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'
              }`}
            />
            <p className={`text-sm ${
              connectionStatus === 'checking' ? 'text-yellow-700' : 
              connectionStatus === 'connected' ? 'text-green-700' : 'text-red-700'
            }`}>
              {connectionMessage}
            </p>
          </div>
          {connectionStatus === 'error' && (
            <p className="text-xs mt-2 text-gray-500">
              Check your Firebase configuration in the .env.local file.
            </p>
          )}
        </div>
        
        {/* Data Status */}
        <div className="p-4 rounded-lg border">
          <h3 className="text-lg font-medium mb-2">Data Status</h3>
          <div className="flex flex-col space-y-1">
            <p className="text-sm">
              <span className="font-medium">Local transactions:</span> {transactions.length}
            </p>
            <p className="text-sm">
              <span className="font-medium">Firestore sync:</span> {
                isFirestoreSynced 
                  ? <span className="text-green-700">Enabled</span> 
                  : <span className="text-amber-700">Not enabled</span>
              }
            </p>
          </div>
        </div>
        
        {/* Sync Controls */}
        <div className="flex flex-col space-y-4">
          <h3 className="text-lg font-medium">Sync Options</h3>
          
          <div className="grid gap-2">
            <div className="flex flex-col space-y-1">
              <h4 className="text-sm font-medium">Upload to Firebase</h4>
              <p className="text-xs text-muted-foreground mb-2">
                Upload any local transactions that don't exist in Firebase
              </p>
              <Button
                onClick={handleSyncWithFirestore}
                disabled={isLoading || firestoreStatus === "loading" || isMockMode}
                className="bg-[#BE3144] hover:bg-[#872341] justify-start"
              >
                {(isLoading || firestoreStatus === "loading") ? (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Database className="mr-2 h-4 w-4" />
                )}
                Sync to Firebase
              </Button>
            </div>
            
            <div className="flex flex-col space-y-1">
              <h4 className="text-sm font-medium">Download from Firebase</h4>
              <p className="text-xs text-muted-foreground mb-2">
                Replace local data with what's stored in Firebase
              </p>
              <Button
                onClick={handleLoadFromFirestore}
                disabled={isLoading || firestoreStatus === "loading" || isMockMode}
                className="bg-[#09122C] hover:bg-[#09122C]/80 justify-start"
              >
                {(isLoading || firestoreStatus === "loading") ? (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Download className="mr-2 h-4 w-4" />
                )}
                Load from Firebase
              </Button>
            </div>
          </div>
          
          {isFirestoreSynced && firestoreStatus !== "error" && (
            <div className="flex items-center p-2 bg-green-500/10 rounded text-green-500">
              <Check className="h-4 w-4 mr-2" />
              <span className="text-sm">Connected to Firebase</span>
            </div>
          )}
          
          {firestoreStatus === "success" && (
            <div className="flex items-center p-2 bg-green-500/10 rounded text-green-500">
              <Check className="h-4 w-4 mr-2" />
              <span className="text-sm">Operation completed successfully!</span>
            </div>
          )}
          
          {firestoreStatus === "error" && (
            <div className="flex items-center p-2 bg-red-500/10 rounded text-red-500">
              <X className="h-4 w-4 mr-2" />
              <span className="text-sm">{firestoreErrorMessage}</span>
            </div>
          )}
        </div>

        {/* Help Text */}
        <div className="text-sm text-muted-foreground mt-4 p-4 bg-gray-100 dark:bg-gray-800/50 rounded-lg">
          <h3 className="font-medium mb-2 flex items-center">
            <Info className="h-4 w-4 mr-2" /> 
            Firebase Configuration
          </h3>
          <p className="mb-2">
            Firebase Firestore is configured through environment variables in your <code>.env.local</code> file.
          </p>
          <p>
            For production use, create a <code>.env.local</code> file with proper Firebase credentials. 
            See the <code>FIREBASE_CONFIG.md</code> file for detailed instructions.
          </p>
        </div>
      </CardContent>
    </Card>
  );
} 