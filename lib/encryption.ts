import crypto from 'crypto';

// Use environment variables for encryption keys
// In a real app, these would be set in environment variables
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'minifin-super-secure-key-32chars';
const ENCRYPTION_IV = process.env.ENCRYPTION_IV || 'minifiniv16chars';

// Encrypt data
export function encrypt(text: string): string {
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    Buffer.from(ENCRYPTION_KEY),
    Buffer.from(ENCRYPTION_IV)
  );
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return encrypted;
}

// Decrypt data
export function decrypt(encrypted: string): string {
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    Buffer.from(ENCRYPTION_KEY),
    Buffer.from(ENCRYPTION_IV)
  );
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
} 