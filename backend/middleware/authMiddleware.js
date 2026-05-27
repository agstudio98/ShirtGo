/**
 * @fileoverview Authentication Middleware for protecting private routes.
 * Implements the Middleware Pattern to decouple security from business logic.
 */

import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';

/**
 * Protects routes by verifying the JWT token in the Authorization header.
 * 
 * Clean Code: Uses guard clauses to exit early and reduce nesting.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
export const protect = catchAsync(async (req, res, next) => {
  let token;

  // Check for 'Bearer <token>' in the Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('Unauthorized: Please log in to access this resource.', 401));
  }

  // 1) Verify token integrity
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // 2) Verify user still exists in the database
  const currentUser = await User.findById(decoded.id).select('-password');
  if (!currentUser) {
    return next(new AppError('The user belonging to this token no longer exists.', 401));
  }

  // Grant access and store user in the request object for subsequent controllers
  req.user = currentUser;
  next();
});
