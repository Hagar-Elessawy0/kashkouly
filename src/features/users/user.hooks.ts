import bcrypt from 'bcrypt';
import { Schema } from 'mongoose';
import { IUser } from './user.interface';

export const setupUserHooks = (schema: Schema<IUser>) => {
  schema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (error: any) {
      next(error);
    }
  });

  schema.pre('find', function() {
    this.where({ deletedAt: null });
  });
};