/**
 * @fileoverview Main entry point for the ShirtGo Express application.
 * Adheres to SOLID principles by delegating concerns to specialized modules.
 * 
 * - Single Responsibility: This file handles application bootstrapping,
 *   middleware orchestration, and high-level routing.
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import apiRoutes from './routes/index.js';
import errorMiddleware from './middleware/errorMiddleware.js';
import AppError from './utils/AppError.js';

// Load environment variables as early as possible
dotenv.config();

// Verify required environment variables
const criticalEnvVars = ['MONGODB_URI', 'JWT_SECRET'];
criticalEnvVars.forEach(v => {
  if (!process.env[v]) {
    console.error(`[CRITICAL] Missing required environment variable: ${v}`);
    process.exit(1);
  }
});

if (!process.env.GOOGLE_CLIENT_ID) {
  console.warn('[WARNING] Missing GOOGLE_CLIENT_ID. Google Login will not function correctly.');
}

/**
 * Handle uncaught exceptions and unhandled rejections to prevent silent failures.
 */
process.on('uncaughtException', (err) => {
  console.error('[CRITICAL] Uncaught Exception:', err.name, err.message);
  console.error(err.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[CRITICAL] Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

const app = express();

/**
 * Global Middlewares
 * - CORS: Enables Cross-Origin Resource Sharing for the frontend.
 * - JSON/Urlencoded: Body parsers with size limits for base64 image support.
 */
const corsOptions = {
  origin: true, // Reflects the request origin, or use '*'
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

/**
 * Database Initialization
 * Open/Closed Principle: Connection logic is encapsulated in connectDB.
 */
connectDB();

/**
 * Root health check for Render/Deployment platforms.
 */
app.get('/', (req, res) => {
  res.status(200).json({ 
    status: 'success', 
    message: 'ShirtGo API is alive',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

/**
 * Route Orchestration
 * - API Prefixing: All backend endpoints are namespaced under /api.
 */
app.use('/api', apiRoutes);

/**
 * Catch-all for undefined routes.
 * Ensures the client receives a structured 404 error instead of HTML.
 */
app.all('/*path', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

/**
 * Global Error Handling Middleware
 * Clean Code: Centralized error handling avoids repetitive try-catch blocks in routes.
 */
app.use(errorMiddleware);

const PORT = process.env.PORT || 3001;

// Only start the server if not in test mode to facilitate unit testing.
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] Running on port ${PORT} (0.0.0.0)`);
    console.log(`[Server] Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

export default app;
