/**
 * @fileoverview MongoDB connection management using Mongoose.
 * Implements retry logic and environment-aware configuration.
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MAX_RETRIES = 5;
const RETRY_INTERVAL = 5000; // 5 seconds

/**
 * Establishes a connection to the MongoDB database.
 * 
 * @param {number} retryCount - Current attempt number for recursive retries.
 * @returns {Promise<void>}
 * 
 * Clean Code Principle: Encapsulated connection logic with clear error reporting
 * and graceful retry mechanism.
 */
const connectDB = async (retryCount = 0) => {
  // Skip DB connection during unit tests to use mocks or avoid overhead
  if (process.env.NODE_ENV === 'test') return;

  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27012/dbShirtGo';

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000, // 5 seconds
    });
    console.log(`[Database] Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[Database] Connection Error: ${error.message}`);
    
    // Recursive retry logic
    if (retryCount < MAX_RETRIES) {
      console.log(`[Database] Retrying connection (${retryCount + 1}/${MAX_RETRIES}) in ${RETRY_INTERVAL / 1000}s...`);
      setTimeout(() => connectDB(retryCount + 1), RETRY_INTERVAL);
    } else {
      console.error('[Database] Max retries reached. Shutting down...');
      process.exit(1);
    }
  }
};

export default connectDB;
