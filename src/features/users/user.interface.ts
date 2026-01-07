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
  recordLogin(): Promise<void>;
}

export interface IAvatar {
  secure_url: string;
  public_id?: string;
}

export interface IResetPassword {
  token: string;
  expires: Date;
}

export interface UpdateUserDTO {
  name?: string;
  avatar?: IAvatar;
  email?: string;
}

export interface UserQueryDTO {
  page?: number;
  limit?: number;
  role?: UserRole;
  isEmailVerified?: boolean;
  isBanned?: boolean;
  search?: string;
}

export interface UserResponseDTO {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isEmailVerified: boolean;
  isBanned: boolean;
  avatar: IAvatar;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UsersListResponse {
  users: UserResponseDTO[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
