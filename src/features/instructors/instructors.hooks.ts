import { Schema } from 'mongoose';
import { ITeacher, ITeacherModel } from './instructors.interface';
import logger from '../../core/utils/logger';

export const setupTeacherHooks = (schema: Schema<ITeacher, ITeacherModel>) => {
  schema.pre('save', async function (next) {
    if (this.isModified('subjects')) {
      this.subjects = [...new Set(this.subjects)];
    }
    
    next();
  });

  schema.post('save', function (doc) {
    logger.info(`Teacher ${doc._id} saved successfully`);
  });
};
