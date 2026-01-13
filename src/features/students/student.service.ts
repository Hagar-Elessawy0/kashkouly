import { Student } from './student.model';
import { User } from '../users/user.model';
import { AppError } from '../../core/errors/appError';
import { ErrorCodes } from '../../core/errors/errorCodes';
import { HTTP_STATUS } from '../../shared/constants';
import { UserRole } from '../../shared/enums/userRole';
import { UpdateStudentProfileDTO, StudentQueryDTO, StudentResponseDTO, StudentsListResponse } from './student.interface';
import { USER_SELECTED_FIELDS } from '../../shared/constants/selectedFields';

export class StudentService {
  private formatStudentResponse(student: any): StudentResponseDTO {
    return {
      id: student!._id.toString(),
      user: student!.user,
      stage: student!.stage,
      enrolledCourses: student!.enrolledCourses.map((id : any) => id.toString()),
      grades: student!.grades instanceof Map ? Object.fromEntries(student!.grades) : student!.grades,
      progress: student!.progress,
      createdAt: student!.createdAt,
      updatedAt: student!.updatedAt,
    };
  }

  async getStudentProfile(userId: string): Promise<StudentResponseDTO> {
    const student = await Student.findOne({ user: userId, deletedAt: null }).populate('user', USER_SELECTED_FIELDS);
    return this.formatStudentResponse(student);
  }

  async updateStudentProfile(userId: string, data: UpdateStudentProfileDTO): Promise<StudentResponseDTO> {
    const student = await Student.findOne({ user: userId, deletedAt: null });

    if (data.stage !== undefined) {
      student!.stage = data.stage;
    }

    if (data.parentPhone !== undefined) {
      student!.parentPhone = data.parentPhone;
    }

    await student!.save();

    return this.getStudentProfile(userId);
  }

  async getStudentById(studentId: string): Promise<StudentResponseDTO> {
    const student = await Student.findById(studentId).populate('user', USER_SELECTED_FIELDS);

    if (!student) {
      throw new AppError('Student not found', HTTP_STATUS.NOT_FOUND, ErrorCodes.USER_NOT_FOUND);
    }

    return this.formatStudentResponse(student);
  }

  async getAllStudents(query: StudentQueryDTO): Promise<StudentsListResponse> {

    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const filter: any = {};

    if (query.stage) {
      filter.stage = query.stage;
    }

    if (query.search) {
      const users = await User.find({
        $or: [
          { name: { $regex: query.search, $options: 'i' } },
          { email: { $regex: query.search, $options: 'i' } },
        ],
        deletedAt: null,
        role: UserRole.STUDENT,
      }).select('_id');

      filter.user = { $in: users.map((u) => u._id) };
    }

    const [students, total] = await Promise.all([
      Student.find(filter).populate('user', USER_SELECTED_FIELDS).skip(skip).limit(limit).sort({ createdAt: -1 }),
      Student.countDocuments(filter),
    ]);

    return {
      students: students.map((student) => this.formatStudentResponse(student)),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
