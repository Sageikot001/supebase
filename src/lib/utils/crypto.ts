import crypto from 'crypto';

export function generateApiKey(prefix: string = 'sb'): string {
  const randomBytes = crypto.randomBytes(32);
  const key = randomBytes.toString('base64url');
  return `${prefix}_${key}`;
}

export function generateProjectRef(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  let ref = '';
  for (let i = 0; i < 20; i++) {
    ref += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return ref;
}

export function hashApiKey(key: string): string {
  return crypto.createHash('sha256').update(key).digest('hex');
}
