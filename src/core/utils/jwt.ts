import jwt, { SignOptions } from 'jsonwebtoken';
import { AppError } from '../errors/appError';
import { ErrorCodes } from '../errors/errorCodes';
import { UserRole } from '../../shared/enums/userRole';
import { config } from '../../config';

export interface TokenPayload {
  id: string;
  email: string;
  role: UserRole;
  isEmailVerified: boolean;
  isBanned: boolean;
}

export interface RefreshTokenPayload {
  id: string;
  tokenVersion?: number;
}

const JWT_SECRET = config.jwt.secret;
const JWT_ACCESS_EXPIRATION = config.jwt.accessExpiration;
const JWT_REFRESH_EXPIRATION = config.jwt.refreshExpiration;
const JWT_EMAIL_VERIFICATION_EXPIRATION = config.jwt.emailVerificationExpiration;

export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_ACCESS_EXPIRATION,
  } as SignOptions);
};

export const generateRefreshToken = (payload: RefreshTokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRATION,
  } as SignOptions);
};

export const generateEmailVerificationToken = (userId: string): string => {
  return jwt.sign({ id: userId, type: 'email-verification' }, JWT_SECRET, {
    expiresIn: JWT_EMAIL_VERIFICATION_EXPIRATION,
  } as SignOptions);
};

export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
};

export const verifyRefreshToken = (token: string): RefreshTokenPayload => {
  return jwt.verify(token, JWT_SECRET) as RefreshTokenPayload;
};

export const verifyEmailVerificationToken = (token: string): { id: string } => {
  const decoded = jwt.verify(token, JWT_SECRET) as { id: string; type: string };
  if (decoded.type !== 'email-verification') {
    throw new AppError('Invalid token type', 400, ErrorCodes.TOKEN_INVALID);
  }
  return { id: decoded.id };
};
