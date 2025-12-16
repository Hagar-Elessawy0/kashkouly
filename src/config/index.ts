import dotenv from 'dotenv';

dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000'),
  apiVersion: process.env.API_VERSION || 'v1',

  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/educational-platform',
    uriTest: process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/educational-platform-test',
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    accessExpiration: process.env.JWT_ACCESS_EXPIRATION || '15m',
    refreshExpiration: process.env.JWT_REFRESH_EXPIRATION || '7d',
    emailVerificationExpiration: process.env.JWT_EMAIL_VERIFICATION_EXPIRATION || '24h',
  },

  email: {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    user: process.env.EMAIL_USER || '',
    password: process.env.EMAIL_PASSWORD || '',
    from: process.env.EMAIL_FROM || 'noreply@educational-platform.com',
  },

  backend: {
    url: process.env.BACKEND_URL || 'http://localhost',
  },

  frontend: {
    url: process.env.FRONTEND_URL || 'http://localhost:3000',
  },

  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
  },

  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  },

  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  },

  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },

  bodyLimit: {
    json: process.env.BODY_LIMIT_JSON || '10mb',
    urlencoded: process.env.BODY_LIMIT_URLENCODED || '10mb',
  },

  path:{
    default_avatar: 'https://res.cloudinary.com/dvlao566z/image/upload/v1760871735/default-user-avatar_wreuts.png',
  }
};
