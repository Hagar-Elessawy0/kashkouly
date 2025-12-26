import http from 'http';
import { config } from './config';
import { createApp } from './app';
import { connectDatabase } from './config/database/connection';
import { logger } from './core/utils/logger';
import { setupGracefulShutdown } from './core/utils/gracefulShutDown';

const startServer = async (): Promise<void> => {
  try {
    // Connect to database
    await connectDatabase();

    // Create Express app
    const app = createApp();

    // Create HTTP server
    const server = http.createServer(app);

    // Start server
    server.listen(config.port, () => {
      logger.info(`🚀 Server running on port ${config.port} in ${config.env} mode`);
      logger.info(`📡 API available at ${config.backend.url}:${config.port}${config.apiVersion}`);
      logger.info(`📄 Swagger docs available at ${config.backend.url}:${config.port}/api-docs`);
    });

    // Graceful shutdown
    setupGracefulShutdown({ server });
    
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();