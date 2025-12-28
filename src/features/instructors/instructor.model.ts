import mongoose, { Schema } from 'mongoose';
import { IInstructor, IInstructorModel } from './instructor.interface';
import { setupInstructorMethods } from './instructor.methods';
import { setupInstructorHooks } from './instructor.hooks';
import { Subject } from '../../shared/enums/subjects';

const instructorSchema = new Schema<IInstructor, IInstructorModel>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
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
        message: 'Instructor must have at least one subject',
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

instructorSchema.index({ user: 1 }, { unique: true });
instructorSchema.index({ subjects: 1 });

setupInstructorMethods(instructorSchema);
setupInstructorHooks(instructorSchema);

export const Instructor = mongoose.model<IInstructor, IInstructorModel>('Instructor', instructorSchema);
