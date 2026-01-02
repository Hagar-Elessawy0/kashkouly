import multer from 'multer';
import { AppError } from '../errors/appError';
import { ErrorCodes } from '../errors/errorCodes';
import { HTTP_STATUS } from '../../shared/constants';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

const storage = multer.memoryStorage();

const imageFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('Invalid file type. Only JPEG, and PNG are allowed', HTTP_STATUS.BAD_REQUEST, ErrorCodes.INVALID_FILE_TYPE));
  }
};

export const uploadImage = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: imageFilter,
}).single('file');

export const uploadAny = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
});
