import { Schema } from 'mongoose';
import { IInstructor, IInstructorModel } from './instructor.interface';
import logger from '../../core/utils/logger';

export const setupInstructorHooks = (schema: Schema<IInstructor, IInstructorModel>) => {
  schema.pre('save', async function (next) {
    if (this.isModified('subjects')) {
      this.subjects = [...new Set(this.subjects)];
    }
    
    next();
  });

  schema.post('save', function (doc) {
    logger.info(`Instructor ${doc._id} saved successfully`);
  });
};
