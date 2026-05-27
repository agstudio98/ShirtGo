/**
 * @fileoverview Controller for Order management.
 * Implements logic for processing purchases and retrieving order history.
 */

import Order from '../models/Order.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';

/**
 * @desc    Create new order items
 * @route   POST /api/orders
 * @access  Private
 */
export const addOrderItems = catchAsync(async (req, res, next) => {
  const { orderItems, total } = req.body;

  // Validation: Guard clause for empty orders
  if (!orderItems || orderItems.length === 0) {
    return next(new AppError('No order items provided', 400));
  }

  const order = new Order({
    user: req.user._id, // Set automatically via protect middleware
    products: orderItems,
    total,
  });

  const createdOrder = await order.save();
  
  res.status(201).json({
    status: 'success',
    data: createdOrder
  });
});

/**
 * @desc    Get order by ID
 * @route   GET /api/orders/:id
 * @access  Private
 */
export const getOrderById = catchAsync(async (req, res, next) => {
  // populate() is used to join User data, adhering to normalized data patterns
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: order
  });
});

/**
 * @desc    Get logged in user orders
 * @route   GET /api/orders/myorders
 * @access  Private
 */
export const getMyOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });
  
  res.status(200).json({
    status: 'success',
    results: orders.length,
    data: orders
  });
});
