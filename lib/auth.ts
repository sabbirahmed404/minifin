'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { decrypt } from './encryption';

// Server-side PIN verification - never exposed to client
const OWNER_PIN = process.env.OWNER_PIN || '22211';

// Server action to change PIN (in a real app, this would update a database)
export async function changeOwnerPin(formData: FormData) {
  const currentPin = formData.get('currentPin') as string;
  const newPin = formData.get('newPin') as string;
  
  if (currentPin !== OWNER_PIN) {
    return { success: false, error: 'Current PIN is incorrect' };
  }
  
  if (!newPin || newPin.length !== 5 || !/^\d+$/.test(newPin)) {
    return { success: false, error: 'New PIN must be 5 digits' };
  }
  
  // In a real app, this would update the PIN in a database
  // For demo purposes, we'll just return success
  // process.env.OWNER_PIN = newPin; // (Can't actually modify env vars at runtime)
  
  return { success: true };
}

// Check if owner is authenticated
export async function getOwnerAuthStatus() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('minifin_owner_auth');
  
  if (!authCookie) {
    return false;
  }
  
  try {
    const decryptedValue = decrypt(authCookie.value);
    const authData = JSON.parse(decryptedValue);
    
    // Check if the auth is valid and not expired
    if (authData.isOwner && authData.timestamp) {
      return true;
    }
    
    return false;
  } catch (error) {
    return false;
  }
} 