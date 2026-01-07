import { User } from './user.model';
import { AppError } from '../../core/errors/appError';
import { ErrorCodes } from '../../core/errors/errorCodes';
import { HTTP_STATUS } from '../../shared/constants';
import { UpdateUserDTO, UserQueryDTO, UserResponseDTO, UsersListResponse } from './user.interface';
import { sendVerificationEmail } from '../../core/utils/email';
import { generateEmailVerificationToken } from '../../core/utils/jwt';
import { deleteFromCloudinary } from '../../core/utils/cloudinary';

export class UserService {
  private formatUserResponse(user: any): UserResponseDTO {
    return {
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      isBanned: user.isBanned,
      avatar: user.avatar,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async updateUserProfile(userId: string, data: UpdateUserDTO): Promise<UserResponseDTO> {
    const user = await User.findOne({ _id: userId, deletedAt: null });

    if (data.name !== undefined) {
      user!.name = data.name;
    }

    if (data.avatar !== undefined) {
      if (user!.avatar!.public_id) {
        await deleteFromCloudinary(user!.avatar!.public_id);
      }
      user!.avatar = data.avatar;
    }

    if (data.email !== undefined) {
      user!.email = data.email;
      const verificationToken = generateEmailVerificationToken(user!.id.toString());
      await sendVerificationEmail(user!.email, verificationToken);
    } 

    await user!.save();

    return this.formatUserResponse(user);
  }

  async getUserById(userId: string): Promise<UserResponseDTO> {
    const user = await User.findOne({ _id: userId, deletedAt: null });

    if (!user) {
      throw new AppError('User not found', HTTP_STATUS.NOT_FOUND, ErrorCodes.USER_NOT_FOUND);
    }

    return this.formatUserResponse(user);
  }

  async getAllUsers(query: UserQueryDTO): Promise<UsersListResponse> {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const filter: any = { deletedAt: null };

    if (query.role) {
      filter.role = query.role;
    }

    if (query.isEmailVerified !== undefined) {
      filter.isEmailVerified = query.isEmailVerified;
    }

    if (query.isBanned !== undefined) {
      filter.isBanned = query.isBanned;
    }

    if (query.search) {
      filter.$or = [
        { name: { $regex: query.search, $options: 'i' } },
        { email: { $regex: query.search, $options: 'i' } },
      ];
    }

    const [users, total] = await Promise.all([
      User.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
      User.countDocuments(filter),
    ]);

    return {
      users: users.map(user => this.formatUserResponse(user)),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async changeStatus(userId: string): Promise<string> {
    const user = await User.findOne({ _id: userId, deletedAt: null });

    user!.isBanned = !user!.isBanned;
    await user!.save();

    const status = user!.isBanned ? 'banned' : 'unbanned';
    return status;
  }

  async deleteUser(userId: string, softDelete: boolean = true): Promise<void> {
    const user = await User.findOne({ _id: userId, deletedAt: null });

    if (!softDelete) {
      if (user!.avatar!.public_id) await deleteFromCloudinary(user!.avatar!.public_id);
      await User.deleteOne({ _id: userId });
    }

    user!.deletedAt = new Date();
    await user!.save();

  }
}
