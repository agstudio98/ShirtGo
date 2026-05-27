/**
 * @fileoverview Order Domain Routes.
 * Manages shopping carts, order creation, and purchase history.
 */

import express from 'express';
import { addOrderItems, getOrderById, getMyOrders } from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All order routes are protected by default
router.route('/')
  .post(protect, addOrderItems)
  .get(protect, getMyOrders);

router.route('/:id').get(protect, getOrderById);

export default router;
