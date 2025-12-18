import { Schema } from 'mongoose';
import { IStudent, IStudentModel } from './student.interface';
import { logger } from '../../core/utils/logger';

export const setupStudentHooks = (schema: Schema<IStudent, IStudentModel>) => {
  schema.pre('save', async function (next) {
    if (this.isModified('grades') || this.isModified('enrolledCourses')) {
      const totalCourses = this.enrolledCourses.length;
      const completedCourses = this.grades.size;
      
      if (totalCourses > 0) {
        this.progress = Math.round((completedCourses / totalCourses) * 100);
        logger.info(`Updated progress for student ${this._id} to ${this.progress}%`);
      } else {
        this.progress = 0;
      }
    }
    
    next();
  });

  schema.post('save', function (doc) {
    logger.info(`Student ${doc._id} saved successfully`);
  });
};
