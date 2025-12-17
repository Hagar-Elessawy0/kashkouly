import { Server } from 'http';
import mongoose from 'mongoose';
import { disconnectDatabase } from '../../config/database/connection';
import { logger } from './logger';

interface ShutdownOptions {
  server: Server;
  timeout?: number;
}

export const setupGracefulShutdown = ({ server, timeout = 10000 }: ShutdownOptions): void => {
  
  const shutdown = async (code: number, reason: string): Promise<void> => {
    try {
      logger.warn(`⚠️ Graceful Shutdown Triggered: ${reason}`);

      // 1) Stop receiving new requests
      await new Promise<void>((resolve, reject) => {
        server.close((err) => {
          if (err) {
            logger.error('❌ Error while closing HTTP server:', err);
            return reject(err);
          }
          logger.info('🛑 HTTP server closed');
          resolve();
        });
      });

      // 2) Close MongoDB
      if (mongoose.connection.readyState === 1) {
        logger.info('🔌 Closing MongoDB connection...');
        await disconnectDatabase();
      } else {
        logger.info('🤷🏻‍♀️ MongoDB was not connected');
      }

      // 3) Force shutdown after timeout if something hangs
      setTimeout(() => {
        logger.warn('⏳ Shutdown timeout reached. Forcing exit...');
        process.exit(code);
      }, timeout).unref();

      logger.info('👋 Graceful shutdown completed');
      process.exit(code);

    } catch (error) {
      logger.error('❌ Error during graceful shutdown:', error);
      process.exit(1);
    }
  };

  // Handle Unhandled Promise Rejections
  process.on('unhandledRejection', (err: any) => {
    logger.error(`💥 Unhandled Rejection: ${err?.message || err}`);
    shutdown(1, 'Unhandled Rejection');
  });

  // Handle Uncaught Exceptions
  process.on('uncaughtException', (err: any) => {
    logger.error(`💥 Uncaught Exception: ${err?.message || err}`);
    shutdown(1, 'Uncaught Exception');
  });

  // Handle Signals (Docker / PM2 / OS)
  ['SIGINT', 'SIGTERM'].forEach(signal => {
    process.on(signal, () => shutdown(0, `Received ${signal}`));
  });
};
