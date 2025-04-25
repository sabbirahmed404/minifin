'use server';

import { cookies } from 'next/headers';
import { encrypt } from '@/lib/encryption';

// Server-side PIN verification - never exposed to client
const OWNER_PIN = process.env.OWNER_PIN || '22211';

// Set secure HTTP-only cookies with encryption
async function setOwnerAuthCookie() {
  try {
    const cookieStore = await cookies();
    const authData = { isOwner: true, timestamp: Date.now() };
    const encryptedValue = encrypt(JSON.stringify(authData));
    
    // Set the cookie with appropriate options
    cookieStore.set('minifin_owner_auth', encryptedValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
      sameSite: 'lax', // Changed from 'strict' to 'lax' for better compatibility
    });
    
    // For debugging
    console.log('Auth cookie set successfully');
    return true;
  } catch (error) {
    console.error('Error setting auth cookie:', error);
    return false;
  }
}

// Server action to verify PIN
export async function verifyPin(formData: FormData) {
  const enteredPin = formData.get('pin') as string;
  
  if (enteredPin === OWNER_PIN) {
    const cookieSet = await setOwnerAuthCookie();
    
    if (!cookieSet) {
      return { 
        success: false, 
        error: 'Failed to set authentication cookie. Please try again.' 
      };
    }
    
    return { success: true };
  }
  
  return { success: false, error: 'Incorrect PIN' };
} 