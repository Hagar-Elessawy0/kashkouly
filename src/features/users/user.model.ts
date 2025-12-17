import mongoose, { Schema } from 'mongoose';
import { UserRole } from '../../shared/enums/userRole';
import { IUser, IAvatar, IResetPassword } from './user.interface';
import { config } from '../../config';

const AvatarSchema = new Schema<IAvatar>(
  {
    secure_url: { type: String, required: true },
    public_id: { type: String, required: false },
  },
  { _id: false }
);

const ResetPasswordSchema = new Schema<IResetPassword>(
  {
    token: String,
    expires: Date,
  },
  { _id: false }
);

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      match: [
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number',
      ],
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.STUDENT,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: AvatarSchema,
      default: {
        secure_url: config.path.default_avatar,
        public_id: null
      }
    },
    refreshToken: {
      type: String,
      select: false,
    },
    tokenVersion: {
      type: Number,
      default: 0,
    },
    passwordReset: {
      type: ResetPasswordSchema,
      select: false,
    },
    lastLogin: {
      type: Date,
    },
    deletedAt: {
      type: Date,
    }
  },
  {
    timestamps: true,
  }
);

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ 'deletedAt': 1 }, { sparse: true });

import './user.hooks';
import './user.methods';

export const User = mongoose.model<IUser>('User', userSchema);
