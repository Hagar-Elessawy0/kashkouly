import { Schema } from 'mongoose';
import { IAdmin, IAdminModel } from './admin.interface';
import logger from '../../core/utils/logger';

export const setupAdminHooks = (schema: Schema<IAdmin, IAdminModel>) => {
  schema.pre('save', async function (next) {
    if (this.isModified('permissions')) {
      this.permissions = [...new Set(this.permissions)];
    }
    
    next();
  });

  schema.post('save', function (doc) {
    logger.info(`Admin ${doc._id} saved successfully`);
  });
};
