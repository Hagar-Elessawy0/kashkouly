import mongoose, { Schema } from 'mongoose';
import { ITeacher, ITeacherModel } from './teacher.interface';
import { setupTeacherMethods } from './teacher.methods';
import { setupTeacherHooks } from './teacher.hooks';
import { Subject } from '../../shared/enums/subjects';

const teacherSchema = new Schema<ITeacher, ITeacherModel>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      unique: true,
    },
    bio: {
      type: String,
      default: '',
    },
    taughtCourses: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Course',
      },
    ],
    subjects: {
      type: [{
        type: String,
        enum: Object.values(Subject),
      }],
      required: true,
      validate: {
        validator: function (value: string[]) {
          return Array.isArray(value) && value.length > 0;
        },
        message: 'Teacher must have at least one subject',
      },
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

teacherSchema.index({ user: 1 }, { unique: true });
teacherSchema.index({ subjects: 1 });

setupTeacherMethods(teacherSchema);
setupTeacherHooks(teacherSchema);

export const Teacher = mongoose.model<ITeacher, ITeacherModel>('Teacher', teacherSchema);
