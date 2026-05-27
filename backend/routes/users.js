/**
 * @fileoverview User Domain Routes.
 * Handles authentication, registration, and profile management.
 */

import express from 'express';
import { registerUser, loginUser, googleLogin, getUserProfile, updateUserProfile } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google-login', googleLogin);

// Protected routes (Authentication required)
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.put('/profile/image', protect, updateUserProfile);

export default router;
