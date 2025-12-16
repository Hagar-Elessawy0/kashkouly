import mongoose from 'mongoose';
import { logger } from '../../core/utils/logger';
import { config } from '..';

let isConnected = false;
let retryCount = 0;
const maxRetries = 5;

export const connectDatabase = async (): Promise<void> => {
  
  if (isConnected) {
    logger.info('🤷🏻‍♀️ MongoDB is already connected');
    return;
  }
  
  try {
    const uri = config.env === 'test' ? config.database.uriTest : config.database.uri;

    const options: mongoose.ConnectOptions = {
      maxPoolSize: 100,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      autoIndex: config.env !== 'production',
    };

    await mongoose.connect(uri, options);
    isConnected = true;

    logger.info(`🔗 MongoDB connected successfully to ${config.env} database`);
    logger.info(`Database name: ${mongoose.connection.name}`);

    mongoose.connection.on('error', (error) => {
      logger.error('❌ MongoDB connection error: ', error);
      isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('⚠️ MongoDB disconnected');
      isConnected = false;
    });

  } catch (error) {
    logger.error('❌ MongoDB Connection failed, retrying ...', error);
    if (retryCount < maxRetries) {
      const delay = Math.min(1000 * (2 ** retryCount), 30000);
      retryCount++;
      setTimeout(connectDatabase, delay);
    }
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  if (!isConnected) {
    logger.info('🤷🏻‍♀️ MongoDB is already disconnected');
    return;
  }

  try {
    await mongoose.connection.close();
    isConnected = false;
    logger.info('✅ MongoDB disconnected successfully');
  } catch (error) {
    logger.error('❌ Failed to disconnect from MongoDB:', error);
  }
};