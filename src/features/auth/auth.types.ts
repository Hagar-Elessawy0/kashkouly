import { UserRole } from '../../shared/enums/userRole';
import { IAvatar } from '../users/user.interface';
import { EducationStage } from '../../shared/enums/educationStage';
import { Subject } from '../../shared/enums/subjects';
import { Permission } from '../../shared/constants';

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface CreateStudentDTO {
  stage: EducationStage;
  parentPhone?: string;
}

export interface CreateInstructorDTO {
  bio: string;
  subjects: Subject[];
}

export interface CreateAdminDTO {
  permissions: Permission[];
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
  userId: string;
  accessToken?: string;
  refreshToken?: string;
}

export interface RegisterStudentResponse extends RegisterResponse {
  studentId: string;
  message: string;
}

export interface RegisterInstructorResponse {
  userId: string;
  instructorId: string;
  message: string;
}

export interface RegisterAdminResponse {
  userId: string;
  adminId: string;
  message: string;
}