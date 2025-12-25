import { UserRole } from '../../shared/enums/userRole';
import { IAvatar } from '../users/user.interface';

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface RefreshTokenDTO {
  refreshToken: string;
}

export interface VerifyEmailDTO {
  token: string;
}

export interface ForgotPasswordDTO {
  email: string;
}

export interface ResetPasswordDTO {
  token: string;
  newPassword: string;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    isEmailVerified: boolean;
    avatar?: IAvatar;
  };
  accessToken: string;
  refreshToken: string;
}

export interface RegisterResponse {
  message: string;
  userId: string;
  accessToken: string;
  refreshToken: string;
}
