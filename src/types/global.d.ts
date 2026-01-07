import 'express';
import { UserRole } from '../shared/enums/userRole';

declare global {
  namespace Express {
    interface Request {
      requestId: string;
      user?: {
        id: string;
        email: string;
        role: UserRole;
        isEmailVerified: boolean;
        isBanned: boolean;
      };
      file?: UploadedFile;
      files?: UploadedFile[] | { [fieldname: string]: UploadedFile[] };
    }
  }
}
