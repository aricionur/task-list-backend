import dotenv from 'dotenv';

dotenv.config();

// API
export const PORT = process.env.PORT;
export const NODE_ENV = process.env.NODE_ENV;

// DB
export const POSTGRES_USER = process.env.POSTGRES_USER;
export const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD;
export const POSTGRES_DB = process.env.POSTGRES_DB;
export const POSTGRES_HOST = process.env.POSTGRES_HOST;
export const POSTGRES_PORT = process.env.POSTGRES_PORT;

// Monitoring
export const SENTRY_DSN = process.env.SENTRY_DSN;
export const DD_API_KEY = process.env.DD_API_KEY;
export const DD_APP_KEY = process.env.DD_APP_KEY;
