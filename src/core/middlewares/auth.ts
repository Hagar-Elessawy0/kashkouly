import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/appError';
import { ErrorCodes } from '../errors/errorCodes';
import { HTTP_STATUS } from '../../shared/constants';
import { verifyAccessToken } from '../utils/jwt';
import { UserRole } from '../../shared/enums/userRole';
import { User } from '../../features/users/user.model';

const extractToken = (req: Request): string => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader?.startsWith('Bearer ')) {
    throw new AppError(
      'Authorization header missing or malformed',
      HTTP_STATUS.UNAUTHORIZED,
      ErrorCodes.UNAUTHORIZED
    );
  }

  return authHeader.split(' ')[1].trim();
};

const validateUserState = (user: any, decoded: any): void => {
  // Check if account is deleted
  if (user.deletedAt) {
    throw new AppError(
      'User not found',
      HTTP_STATUS.UNAUTHORIZED,
      ErrorCodes.UNAUTHORIZED
    );
  }

  // Check if account is banned
  if (user.isBanned) {
    throw new AppError(
      'Account is banned',
      HTTP_STATUS.FORBIDDEN,
      ErrorCodes.ACCOUNT_BANNED
    );
  }

  // Check session exists
  if (!user.refreshToken) {
    throw new AppError(
      'Session expired. Please login again',
      HTTP_STATUS.UNAUTHORIZED,
      ErrorCodes.SESSION_EXPIRED
    );
  }

  // Check token version
  if (decoded.tokenVersion !== user.tokenVersion) {
    throw new AppError(
      'Session invalidated. Please login again',
      HTTP_STATUS.UNAUTHORIZED,
      ErrorCodes.TOKEN_INVALID
    );
  }
};

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = extractToken(req);

    const decoded = verifyAccessToken(token);

    const user = await User.findOne({ _id: decoded.id , deletedAt: { $exists: false }})
        .select('+refreshToken +tokenVersion +isBanned +deletedAt')
        .orFail(() => {
          throw new AppError(
            'User not found',
            HTTP_STATUS.UNAUTHORIZED,
            ErrorCodes.UNAUTHORIZED
          );
        });

    validateUserState(user, decoded);

    req.user = decoded;

    next();
  } catch (error) {
    next(error);
  }
};

export const authorize = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {

    if (!req.user) {
      throw new AppError('Unauthorized access', HTTP_STATUS.UNAUTHORIZED, ErrorCodes.UNAUTHORIZED);
    }

    if (!roles.includes(req.user.role)) {
      throw new AppError(
        'You do not have permission to perform this action',
        HTTP_STATUS.FORBIDDEN,
        ErrorCodes.FORBIDDEN
      );
    }

    next();
  };
};

export const requireEmailVerification = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {

  if (!req.user) {
    throw new AppError('Unauthorized access', HTTP_STATUS.UNAUTHORIZED, ErrorCodes.UNAUTHORIZED);
  }

  if (!req.user.isEmailVerified) {
    throw new AppError(
      'Please verify your email to access this resource',
      HTTP_STATUS.FORBIDDEN,
      ErrorCodes.EMAIL_NOT_VERIFIED
    );
  }

  next();
};
