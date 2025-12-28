import { Model, Types } from 'mongoose';
import { IBaseDocument } from '../../shared/interfaces';
import { Subject } from '../../shared/enums/subjects';

export interface IInstructor extends IBaseDocument {
  user: Types.ObjectId;
  bio: string;
  subjects: Subject[];
  taughtCourses: Types.ObjectId[];
  toSafeJSON(): Record<string, any>;
  addCourse(courseId: Types.ObjectId): Promise<void>;
}

export interface IInstructorModel extends Model<IInstructor> {
  findByUserId(userId: Types.ObjectId): Promise<IInstructor | null>;
  findBySubject(subject: Subject): Promise<IInstructor[]>;
}

export interface UpdateInstructorProfileDTO {
  bio?: string;
  subjects?: Subject[];
  taughtCourses?: Types.ObjectId[];
}

export interface InstructorQueryDTO {
  page?: number;
  limit?: number;
  subject?: Subject;
  search?: string;
}

export interface InstructorResponseDTO {
  id: string;
  userId: string;
  bio: string;
  subjects: Subject[];
  taughtCourses: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface InstructorsListResponse {
  instructors: InstructorResponseDTO[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}