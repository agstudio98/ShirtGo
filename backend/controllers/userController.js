/**
 * @fileoverview Controller for User authentication and profile management.
 * Adheres to SRP by focusing exclusively on user-related business logic.
 */

import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';

/**
 * Helper function to generate JWT tokens.
 * Clean Code: Encapsulated logic for token creation.
 * 
 * @param {string} id - User ID
 * @returns {string} - Signed JWT token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

/**
 * @desc    Register a new user
 * @route   POST /api/users
 * @access  Public
 */
export const registerUser = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return next(new AppError('User already exists', 400));
  }

  const user = await User.create({ name, email, password });

  if (!user) {
    return next(new AppError('Invalid user data', 400));
  }

  res.status(201).json({
    status: 'success',
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
      address: user.address,
      paymentCard: user.paymentCard,
      token: generateToken(user._id),
    }
  });
});

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/users/login
 * @access  Public
 */
export const loginUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  // verify existence and password validity
  if (!user || !(await user.matchPassword(password))) {
    return next(new AppError('Invalid email or password', 401));
  }

  res.status(200).json({
    status: 'success',
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage || '',
      address: user.address || '',
      paymentCard: user.paymentCard || { number: '', expiry: '', cvv: '', type: 'Visa' },
      token: generateToken(user._id),
    }
  });
});

/**
 * @desc    Handle Google Authentication
 * @route   POST /api/users/google
 * @access  Public
 */
export const googleLogin = catchAsync(async (req, res, next) => {
  const { idToken } = req.body;

  if (!idToken) {
    return next(new AppError('Google ID Token is required', 400));
  }

  // Verify token with Google's API
  const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
  const payload = await response.json();

  if (payload.error) {
    return next(new AppError('Invalid Google Token', 401));
  }

  // Verify audience (Client ID) ensures the token was intended for our app
  if (payload.aud !== process.env.GOOGLE_CLIENT_ID) {
    return next(new AppError('Invalid Google Client ID', 401));
  }

  const { email, name, picture, sub: googleId } = payload;

  let user = await User.findOne({ email });

  if (user) {
    // Sync profile image if missing
    if (!user.profileImage && picture) {
      user.profileImage = picture;
      await user.save();
    }
  } else {
    // JIT (Just-In-Time) User creation for OAuth users
    const randomPassword = Math.random().toString(36).slice(-12);
    user = await User.create({
      name,
      email,
      password: randomPassword,
      profileImage: picture,
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage || '',
      address: user.address || '',
      paymentCard: user.paymentCard || { number: '', expiry: '', cvv: '', type: 'Visa' },
      token: generateToken(user._id),
    }
  });
});

/**
 * @desc    Update user profile data
 * @route   PUT /api/users/profile
 * @access  Private
 */
export const updateUserProfile = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // Nullish coalescing for selective updates
  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  user.address = req.body.address !== undefined ? req.body.address : user.address;
  
  if (req.body.paymentCard) {
    user.paymentCard = {
      number: req.body.paymentCard.number || user.paymentCard.number,
      expiry: req.body.paymentCard.expiry || user.paymentCard.expiry,
      cvv: req.body.paymentCard.cvv || user.paymentCard.cvv,
      type: req.body.paymentCard.type || user.paymentCard.type,
    };
  }
  
  if (req.body.profileImage !== undefined) {
    user.profileImage = req.body.profileImage;
  }
  
  if (req.body.password) {
    user.password = req.body.password;
  }

  const updatedUser = await user.save();

  res.status(200).json({
    status: 'success',
    data: {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      profileImage: updatedUser.profileImage,
      address: updatedUser.address,
      paymentCard: updatedUser.paymentCard,
      token: generateToken(updatedUser._id),
    }
  });
});

/**
 * @desc    Get current user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
export const getUserProfile = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
      address: user.address,
      paymentCard: user.paymentCard,
    }
  });
});
