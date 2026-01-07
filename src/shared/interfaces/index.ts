import { Document } from 'mongoose';

export interface ITimestamps {
  createdAt: Date;
  updatedAt: Date;
}

export interface IBaseDocument extends Document, ITimestamps {}

export interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination?: string;
  filename?: string;
  path?: string;
  buffer?: Buffer;
  secure_url?: string;
  public_id?: string;
  uploadResult?: any;
}
