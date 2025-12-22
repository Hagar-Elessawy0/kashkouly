import { Schema } from 'mongoose';
import { IAdmin, IAdminModel } from './admin.interface';
import { Permission } from '../../shared/constants';

export const setupAdminMethods = (schema: Schema<IAdmin, IAdminModel>) => {
  // Instance methods
  schema.methods.toSafeJSON = function (this: IAdmin) {
    const obj = this.toObject();
    
    const sensitiveFields = ['__v'];
    
    sensitiveFields.forEach(field => delete obj[field]);
    
    obj.id = obj._id?.toString();
    delete obj._id;
    
    return obj;
  };

  schema.methods.hasPermission = function (this: IAdmin, permission: Permission): boolean {
    return this.permissions.includes(permission);
  };

  schema.methods.addPermission = async function (this: IAdmin, permission: Permission): Promise<void> {
    if (!this.permissions.includes(permission)) {
      this.permissions.push(permission);
      await this.save();
    }
  };

  schema.methods.removePermission = async function (this: IAdmin, permission: Permission): Promise<void> {
    const index = this.permissions.indexOf(permission);
    if (index > -1) {
      this.permissions.splice(index, 1);
      await this.save();
    }
  };

  // Static methods
  schema.statics.findByUserId = async function (userId: string): Promise<IAdmin | null> {
    return this.findOne({ user: userId }).populate('user');
  };

  schema.statics.findByPermission = async function (permission: string): Promise<IAdmin[]> {
    return this.find({ permissions: { $in: [permission] } }).populate('user');
  };
};
