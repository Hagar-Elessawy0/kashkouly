import { randomUUID } from 'crypto';
import { nanoid } from 'nanoid';

export const generateShortId = (length: number = 21): string => {
  try {
    return nanoid(length);
  } catch {
    return randomUUID();
  }
};

export const validateRequestId = (id: string, maxLength: number = 128): string | null => {
  if (!id || typeof id !== 'string') {
    return null;
  }

  const trimmed = id.trim();
  if (trimmed.length === 0 || trimmed.length > maxLength) {
    return null;
  }

  const safePattern = /^[a-zA-Z0-9_-]+$/;

  return safePattern.test(trimmed) ? trimmed : null;
};

export const generateRequestId = (): string => generateShortId(21);
