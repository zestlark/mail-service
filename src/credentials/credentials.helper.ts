import * as crypto from 'node:crypto';

const ALGORITHM = 'aes-256-ctr';
const IV = Buffer.alloc(16);

export function encrypt(text: string, secretKey: string): string {
  const key = crypto.createHash('sha256').update(secretKey).digest();
  const cipher = crypto.createCipheriv(ALGORITHM, key, IV);
  return cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
}

export function decrypt(encryptedText: string, secretKey: string): string {
  const key = crypto.createHash('sha256').update(secretKey).digest();
  const decipher = crypto.createDecipheriv(ALGORITHM, key, IV);
  return decipher.update(encryptedText, 'hex', 'utf8') + decipher.final('utf8');
}
