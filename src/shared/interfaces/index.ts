import { Document } from 'mongoose';

export interface ITimestamps {
  createdAt: Date;
  updatedAt: Date;
}

export interface IBaseDocument extends Document, ITimestamps {}
