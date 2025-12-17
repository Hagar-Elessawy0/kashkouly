import { IBaseDocument } from '../../shared/interfaces';
import { UserRole } from '../../shared/enums/userRole';

export interface IUser extends IBaseDocument {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  isEmailVerified: boolean;
  isBanned: boolean;
  avatar?: IAvatar;
  refreshToken?: string;
  tokenVersion: number;
  passwordReset?: IResetPassword;
  lastLogin?: Date;
  deletedAt?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  toSafeJSON(): Record<string, any>;
  isActive(): boolean;
}

export interface IAvatar {
  secure_url: string;
  public_id?: string;
}

export interface IResetPassword {
  token: string;
  expires: Date;
}