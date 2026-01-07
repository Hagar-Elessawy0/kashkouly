import { Request, Response } from 'express';
import { UserService } from './user.service';
import { sendSuccessResponse } from '../../core/utils/response';
import { HTTP_STATUS } from '../../shared/constants';
import asyncHandler from 'express-async-handler';
import { uploadToCloudinary } from '../../core/utils/cloudinary';

const userService = new UserService();

export class UserController {

  static updateMyProfile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.id;

    if (req.file) {
      const result = await uploadToCloudinary(req.file, 'avatars');
      req.body.avatar = {
        secure_url: result.url,
        public_id: result.publicId,
      };
    }

    const user = await userService.updateUserProfile(userId, req.body);
    sendSuccessResponse(res, HTTP_STATUS.OK, 'User profile updated successfully', user);
  });

  static getUserById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const user = await userService.getUserById(id);
    sendSuccessResponse(res, HTTP_STATUS.OK, 'User retrieved successfully', user);
  });

  static getAllUsers = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const result = await userService.getAllUsers(req.query);
    sendSuccessResponse(res, HTTP_STATUS.OK, 'Users retrieved successfully', result.users, result.pagination);
  });

  static changeStatus = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const status : string = await userService.changeStatus(id);
    sendSuccessResponse(res, HTTP_STATUS.OK, `User status changed to ${status} successfully`);
  });
}
