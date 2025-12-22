import mongoose, { Schema } from 'mongoose';
import { IAdmin, IAdminModel } from './admin.interface';
import { setupAdminMethods } from './admin.methods';
import { setupAdminHooks } from './admin.hooks';
import { PERMISSIONS } from '../../shared/constants';

const adminSchema = new Schema<IAdmin, IAdminModel>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      unique: true,
    },
    permissions: {
      type: [{
        type: String,
        enum: Object.values(PERMISSIONS),
      }],
      default: [],
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: 'Admin must have at least one permission',
      }
    },
  },
  {
    timestamps: true,
    strict: true,
    toObject: {
      virtuals: true,
    },
  }
);

adminSchema.index({ user: 1 }, { unique: true });
adminSchema.index({ permissions: 1 });

setupAdminMethods(adminSchema);
setupAdminHooks(adminSchema);

export const Admin = mongoose.model<IAdmin, IAdminModel>('Admin', adminSchema);
