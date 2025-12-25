import { User } from '../users/user.model';
import { AppError } from '../../core/errors/appError';
import { ErrorCodes } from '../../core/errors/errorCodes';
import {
  generateAccessToken,
  generateRefreshToken,
  generateEmailVerificationToken,
  verifyRefreshToken,
  verifyEmailVerificationToken,
} from '../../core/utils/jwt';
import { sendVerificationEmail, sendPasswordResetEmail, sendWelcomeEmail } from '../../core/utils/email';
import { AuthResponse, RegisterDTO, LoginDTO, RegisterResponse } from './auth.types';
import { HTTP_STATUS } from '../../shared/constants';
import { IUser } from '../users/user.interface';
import { generateSecureToken, hashToken } from '../../core/utils/crypto';

export class AuthService {
  private async generateTokens(user: IUser): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = generateAccessToken({
      id: user.id.toString(),
      email: user.email,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      isBanned: user.isBanned,
      tokenVersion: user.tokenVersion,
    });

    const refreshToken = generateRefreshToken({
      id: user.id.toString(),
      tokenVersion: user.tokenVersion,
    });

    return { accessToken, refreshToken };
  }

  async register(data: RegisterDTO): Promise<RegisterResponse> {
    if (await User.exists({ email: data.email, deletedAt: null })) {
      throw new AppError('User with this email already exists', HTTP_STATUS.CONFLICT, ErrorCodes.USER_ALREADY_EXISTS);
    }

    const user = await User.create(data);

    const verificationToken = generateEmailVerificationToken(user.id.toString());
    await sendVerificationEmail(user.email, verificationToken);

    const { accessToken, refreshToken } = await this.generateTokens(user);
    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    await user.save();

    return {
      message: 'Registration successful. Please check your email to verify your account.',
      userId: user.id.toString(),
      accessToken,
      refreshToken,
    };
  }

  async login(data: LoginDTO): Promise<AuthResponse> {
    const user = await User.findOne({ email: data.email, deletedAt: null }).select('+password +refreshToken');

    if (!user) {
      throw new AppError('Invalid email or password', HTTP_STATUS.UNAUTHORIZED, ErrorCodes.INVALID_CREDENTIALS);
    }

    if (user.isBanned) {
      throw new AppError('Your account has been banned', HTTP_STATUS.FORBIDDEN, ErrorCodes.ACCOUNT_BANNED);
    }

    const isPasswordValid = await user.comparePassword(data.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', HTTP_STATUS.UNAUTHORIZED, ErrorCodes.INVALID_CREDENTIALS);
    }

    if (user.refreshToken) {
      throw new AppError(
        'Your account is already logged in on another device. Please logout first.',
        HTTP_STATUS.CONFLICT,
        ErrorCodes.ALREADY_LOGGED_IN
      );
    }

    const { accessToken, refreshToken } = await this.generateTokens(user);
    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    await user.save();

    return {
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        avatar: user.avatar,
      },
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(token: string): Promise<{ accessToken: string }> {
    const decoded = verifyRefreshToken(token);

    const user = await User.findById(decoded.id).select('+refreshToken');

    if (user!.refreshToken !== token) {
      throw new AppError('Invalid refresh token', HTTP_STATUS.UNAUTHORIZED, ErrorCodes.TOKEN_INVALID);
    }

    const accessToken = await generateAccessToken({
      id: user!.id.toString(),
      email: user!.email,
      role: user!.role,
      isEmailVerified: user!.isEmailVerified,
      isBanned: user!.isBanned,
      tokenVersion: user!.tokenVersion,
    });

    return { accessToken };
  }

  async verifyEmail(token: string): Promise<{ message: string }> {
    const decoded = verifyEmailVerificationToken(token);

    const user = await User.findById(decoded.id);
    if (!user) {
      throw new AppError('User not found', HTTP_STATUS.NOT_FOUND, ErrorCodes.USER_NOT_FOUND);
    }

    if (user.isEmailVerified) {
      throw new AppError('Email already verified', HTTP_STATUS.BAD_REQUEST, ErrorCodes.EMAIL_ALREADY_VERIFIED);
    }

    user.isEmailVerified = true;
    await user.save();

    await sendWelcomeEmail(user.email, user.name);

    return { message: 'Email verified successfully' };
  }

  async resendVerificationEmail(email: string): Promise<{ message: string }> {
    const user = await User.findOne({ email, deletedAt: null });

    if (user!.isEmailVerified) {
      throw new AppError('Email already verified', HTTP_STATUS.BAD_REQUEST, ErrorCodes.EMAIL_ALREADY_VERIFIED);
    }

    const verificationToken = generateEmailVerificationToken(user!.id.toString());
    await sendVerificationEmail(user!.email, verificationToken);

    return { message: 'Verification email sent successfully' };
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await User.findOne({ email, deletedAt: null }).select('+passwordReset');
    if (user) {
      const resetToken = generateSecureToken();
      const hashedToken = hashToken(resetToken);
      const expiry = Date.now() + 60 * 60 * 1000; 

      user.passwordReset = {
        token: hashedToken,
        expires: new Date(expiry)
      };
      await user.save();

      await sendPasswordResetEmail(user.email, resetToken);
    }

    return { message: 'If the email exists, a password reset link has been sent' };
  }

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    const hashedToken = hashToken(token);

    const user = await User.findOne({ 'passwordReset.token': hashedToken, deletedAt: null }).select('+passwordReset');
    if (!user) {
      throw new AppError('Invalid or expired token', HTTP_STATUS.BAD_REQUEST, ErrorCodes.TOKEN_INVALID);
    }


    if (!user.passwordReset?.expires || user.passwordReset.expires < new Date()) {
      throw new AppError('Reset token has expired', 400, ErrorCodes.TOKEN_EXPIRED);
    }

    user.password = newPassword;
    user.passwordReset = undefined;
    user.tokenVersion += 1;
    user.refreshToken = undefined;
    await user.save();

    return { message: 'Password reset successfully' };
  }

  async logout(userId: string): Promise<{ message: string }> {
    const user = await User.findById(userId);

    user!.refreshToken = undefined;
    await user!.save();

    return { message: 'Logged out successfully' };
  }
}
