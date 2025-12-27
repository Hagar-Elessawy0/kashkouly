import { Model, Types } from 'mongoose';
import { IBaseDocument } from '../../shared/interfaces';
import { Subject } from '../../shared/enums/subjects';

export interface ITeacher extends IBaseDocument {
  user: Types.ObjectId;
  bio: string;
  subjects: Subject[];
  taughtCourses: Types.ObjectId[];
  toSafeJSON(): Record<string, any>;
  addCourse(courseId: Types.ObjectId): Promise<void>;
}

export interface ITeacherModel extends Model<ITeacher> {
  findByUserId(userId: Types.ObjectId): Promise<ITeacher | null>;
  findBySubject(subject: Subject): Promise<ITeacher[]>;
}
