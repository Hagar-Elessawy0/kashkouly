import crypto from 'crypto';

export const generateSecureToken = (bytes: number = 32): string => {
  return crypto.randomBytes(bytes).toString('hex');
};

export const hashToken = (token: string): string => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

export const compareTokens = (plainToken: string, hashedToken: string): boolean => {
  const hashedPlainToken = hashToken(plainToken);
  return hashedPlainToken === hashedToken;
};