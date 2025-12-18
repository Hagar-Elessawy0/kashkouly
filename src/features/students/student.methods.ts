import { Schema, Types } from 'mongoose';
import { IStudent, IStudentModel } from './student.interface';

export const setupStudentMethods = (schema: Schema<IStudent, IStudentModel>) => {
  schema.methods.toSafeJSON = function (this: IStudent) {
    const obj = this.toObject();
    
    const sensitiveFields = ['__v'];
    
    sensitiveFields.forEach(field => delete obj[field]);
    
    obj.id = obj._id?.toString();
    delete obj._id;

    if (obj.grades instanceof Map) {
      obj.grades = Object.fromEntries(obj.grades);
    }
    
    return obj;
  };

  schema.methods.enrollInCourse = async function (this: IStudent, courseId: Types.ObjectId): Promise<void> {
    if (!this.enrolledCourses.includes(courseId)) {
      this.enrolledCourses.push(courseId);
      await this.save();
    }
  };

  schema.statics.findByUserId = async function (userId: string): Promise<IStudent | null> {
    return this.findOne({ user: userId }).populate('user');
  };
};
