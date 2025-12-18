import bcrypt from 'bcrypt';
import { Schema } from 'mongoose';
import { IUser } from './user.interface';

export const setupUserMethods = (schema: Schema<IUser>) => {
  schema.methods.comparePassword = async function (
    this: IUser,
    candidatePassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, this.password);
  };

  schema.methods.toSafeJSON = function (this: IUser) {
    const obj = this.toObject();
    
    const sensitiveFields = [
      'password',
      'refreshToken',
      'passwordReset',
      'tokenVersion',
      '__v',
    ];
    
    sensitiveFields.forEach(field => delete obj[field]);
    
    obj.id = obj._id?.toString();
    delete obj._id;
    
    return obj;
  };

  schema.methods.isActive = function (this: IUser): boolean {
    return !this.isBanned && this.isEmailVerified && !this.deletedAt;
  };

  schema.methods.recordLogin = async function (this: IUser): Promise<void> {
    this.lastLogin = new Date();
    await this.save();
  };
};