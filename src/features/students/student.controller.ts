import { Request, Response } from 'express';
import { StudentService } from './student.service';
import { sendSuccessResponse } from '../../core/utils/response';
import { HTTP_STATUS } from '../../shared/constants';
import asyncHandler from 'express-async-handler';

const studentService = new StudentService();

export class StudentController {

  static getMyProfile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.id;
    const student = await studentService.getStudentProfile(userId);
    sendSuccessResponse(res, HTTP_STATUS.OK, 'Student profile retrieved successfully', student);
  });

  static updateMyProfile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.id;
    const student = await studentService.updateStudentProfile(userId, req.body);
    sendSuccessResponse(res, HTTP_STATUS.OK, 'Student profile updated successfully', student);
  });

  static getStudentById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const student = await studentService.getStudentById(id);
    sendSuccessResponse(res, HTTP_STATUS.OK, 'Student retrieved successfully', student);
  });

  static getAllStudents = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const result = await studentService.getAllStudents(req.query);
    sendSuccessResponse(res, HTTP_STATUS.OK, 'Students retrieved successfully', result.students, result.pagination);
  });
}
