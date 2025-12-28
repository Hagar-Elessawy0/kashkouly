import mongoose, { Schema } from 'mongoose';
import { IStudent, IStudentModel } from './student.interface';
import { setupStudentMethods } from './student.methods';
import { setupStudentHooks } from './student.hooks';
import { EducationStage } from '../../shared/enums/educationStage';

const studentSchema = new Schema<IStudent, IStudentModel>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
    },
    enrolledCourses: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Course',
      },
    ],
    grades: {
      type: Map,
      of: Number,
      default: (): Map<string, number> => new Map(),
    },
    progress: {
      type: Number,
      default: 0,
      min: [0, 'Progress cannot be negative'],
      max: [100, 'Progress cannot exceed 100'],
    },
    stage: {
      type: String,
      required: [true, 'Stage is required'],
      enum: EducationStage,
    },
    parentPhone: {
      Type: String,
    }
  },
  {
    timestamps: true,
    strict: true,
    toObject: {
      virtuals: true,
    },
  }
);

studentSchema.index({ user: 1 }, { unique: true });
studentSchema.index({ enrolledCourses: 1 });

setupStudentMethods(studentSchema);
setupStudentHooks(studentSchema);

export const Student = mongoose.model<IStudent, IStudentModel>('Student', studentSchema);
