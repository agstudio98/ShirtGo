/**
 * @fileoverview Main API Router Hub.
 * Adheres to the Interface Segregation Principle by splitting endpoints into
 * logical domains (users, products, orders, support).
 */

import express from 'express';
import productRoutes from './products.js';
import userRoutes from './users.js';
import orderRoutes from './orders.js';
import supportRoutes from './support.js';

const router = express.Router();

/**
 * Health check endpoint for monitoring API uptime.
 */
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'API is healthy' });
});

// Delegation to domain-specific routers
router.use('/products', productRoutes);
router.use('/users', userRoutes);
router.use('/orders', orderRoutes);
router.use('/support', supportRoutes);

export default router;
