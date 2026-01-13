import { Model, Types } from 'mongoose';
import { IBaseDocument } from '../../shared/interfaces';
import { EducationStage } from '../../shared/enums/educationStage';
import { IAvatar } from '../users/user.interface';

export interface IStudent extends IBaseDocument {
  user: Types.ObjectId;
  enrolledCourses: Types.ObjectId[];
  grades: Record<string, number>;
  progress: number;
  stage: EducationStage;
  parentPhone?: string;
  toSafeJSON(): Record<string, any>;
  enrollInCourse(courseId: Types.ObjectId): Promise<void>;
}

export interface IStudentModel extends Model<IStudent> {
  findByUserId(userId: string): Promise<IStudent | null>;
}

export interface UpdateStudentProfileDTO {
  stage?: EducationStage;
  enrolledCourses?: Types.ObjectId[];
  grades?: Record<string, number>;
  progress?: number;
  parentPhone?: string;
}

export interface StudentQueryDTO {
  page?: number;
  limit?: number;
  stage?: EducationStage;
  search?: string;
}

export interface StudentResponseDTO {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
    isEmailVerified: boolean;
    avatar: IAvatar;
  };
  stage: EducationStage;
  enrolledCourses: string[];
  grades: Record<string, number>;
  progress: number;
  parentPhone?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface StudentsListResponse {
  students: StudentResponseDTO[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}