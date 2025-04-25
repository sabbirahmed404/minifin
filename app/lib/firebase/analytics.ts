'use client';

import { Analytics, getAnalytics, isSupported, logEvent } from 'firebase/analytics';
import { app } from './config';

// Initialize analytics only in the browser
let analytics: Analytics | null = null;

// Function to initialize analytics
export const initAnalytics = async (): Promise<Analytics | null> => {
  // Only run in browser
  if (typeof window === 'undefined') {
    return null;
  }
  
  try {
    // Check if analytics is supported
    const supported = await isSupported();
    
    if (supported) {
      analytics = getAnalytics(app);
      console.log('Firebase Analytics initialized');
      return analytics;
    } else {
      console.warn('Firebase Analytics is not supported in this environment');
      return null;
    }
  } catch (error) {
    console.error('Error initializing Firebase Analytics:', error);
    return null;
  }
};

// Log an event to analytics
export const logAnalyticsEvent = async (
  eventName: string, 
  eventParams?: Record<string, any>
): Promise<boolean> => {
  try {
    // Initialize analytics if not already initialized
    if (!analytics) {
      analytics = await initAnalytics();
    }
    
    // Only log if analytics is available
    if (analytics) {
      logEvent(analytics, eventName, eventParams);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error logging analytics event:', error);
    return false;
  }
};

// Export a preinitialized version when possible
export { analytics };

// Auto-initialize analytics when this module is imported on the client side
if (typeof window !== 'undefined') {
  initAnalytics().catch(console.error);
} 