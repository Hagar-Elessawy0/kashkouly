import { Model, Types } from 'mongoose';
import { IBaseDocument } from '../../shared/interfaces';
import { Permission } from '../../shared/constants';

export interface IAdmin extends IBaseDocument {
  user: Types.ObjectId;
  permissions: Permission[];
  toSafeJSON(): Record<string, any>;
  hasPermission(permission: Permission): boolean;
  addPermission(permission: Permission): Promise<void>;
  removePermission(permission: Permission): Promise<void>;
}

export interface IAdminModel extends Model<IAdmin> {
  findByUserId(userId: Types.ObjectId): Promise<IAdmin | null>;
  findByPermission(permission: Permission): Promise<IAdmin[]>;
}
