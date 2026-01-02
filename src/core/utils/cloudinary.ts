import { v2 as cloudinary } from 'cloudinary';
import { AppError } from '../errors/appError';
import { ErrorCodes } from '../errors/errorCodes';
import { logger } from './logger';
import { HTTP_STATUS } from '../../shared/constants';
import { config } from '../../config';

cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

export interface UploadResult {
  url: string;
  publicId: string;
  format: string;
  resourceType: string;
}

export const uploadToCloudinary = async (
  file: Express.Multer.File,
  folder: string
): Promise<UploadResult> => {
  try {
    const result = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      uploadStream.end(file.buffer);
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      resourceType: result.resource_type,
    };
  } catch (error) {
    logger.error('Cloudinary upload failed: ', error);
    throw new AppError('File upload failed', HTTP_STATUS.INTERNAL_SERVER_ERROR, ErrorCodes.UPLOAD_FAILED);
  }
};

export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId);
    logger.info(`File deleted from Cloudinary: ${publicId}`);
  } catch (error) {
    logger.error('Cloudinary deletion failed:', error);
    throw new AppError('File deletion failed', 500, ErrorCodes.UPLOAD_FAILED);
  }
};
