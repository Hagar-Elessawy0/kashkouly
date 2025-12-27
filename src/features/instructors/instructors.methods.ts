import { Schema, Types } from 'mongoose';
import { ITeacher, ITeacherModel } from './instructors.interface';
import { USER_EXCLUDED_FIELDS } from '../../shared/constants/selectedFields';
import { Subject } from '../../shared/enums/subjects';

export const setupTeacherMethods = (schema: Schema<ITeacher, ITeacherModel>) => {
  // Instance methods
  schema.methods.toSafeJSON = function (this: ITeacher) {
    const obj = this.toObject();
    
    const sensitiveFields = ['__v'];
    
    sensitiveFields.forEach(field => delete obj[field]);
    
    obj.id = obj._id?.toString();
    delete obj._id;
    
    return obj;
  };

  schema.methods.addCourse = async function (this: ITeacher, courseId: Types.ObjectId): Promise<void> {
    if (!this.taughtCourses.includes(courseId)) {
      this.taughtCourses.push(courseId);
      await this.save();
    }
  };

  // Static methods
  schema.statics.findByUserId = async function (userId: string): Promise<ITeacher | null> {
    return this.findOne({ user: userId }).populate('user', USER_EXCLUDED_FIELDS);
  };

  schema.statics.findBySubject = async function (subject: Subject): Promise<ITeacher[]> {
    return this.find({ subjects: { $in: [subject] } }).populate('user', USER_EXCLUDED_FIELDS);
  };
};
