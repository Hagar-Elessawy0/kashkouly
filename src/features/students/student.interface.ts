import { Model, Types } from 'mongoose';
import { IBaseDocument } from '../../shared/interfaces';
import { EducationStage } from '../../shared/enums/educationStage';

export interface IStudent extends IBaseDocument {
  user: Types.ObjectId;
  enrolledCourses: Types.ObjectId[];
  grades: Record<string, number>;
  progress: number;
  stage: EducationStage;
  toSafeJSON(): Record<string, any>;
  enrollInCourse(courseId: Types.ObjectId): Promise<void>;
}

export interface IStudentModel extends Model<IStudent> {
  findByUserId(userId: Types.ObjectId): Promise<IStudent | null>;
}