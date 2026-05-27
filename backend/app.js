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

const app = express();

/**
 * Global Middlewares
 * - CORS: Enables Cross-Origin Resource Sharing for the frontend.
 * - JSON/Urlencoded: Body parsers with size limits for base64 image support.
 */
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

/**
 * Database Initialization
 * Open/Closed Principle: Connection logic is encapsulated in connectDB.
 */
connectDB();

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
  app.listen(PORT, () => {
    console.log(`[Server] Running on port ${PORT}`);
  });
}

export default app;
