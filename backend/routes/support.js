/**
 * @fileoverview Support Domain Routes.
 * Facilitates customer support ticket submission and tracking.
 */

import express from 'express';
import { createSupportTicket, getTickets, getMyTickets } from '../controllers/supportController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * createSupportTicket: Handles both authenticated users and guests.
 * Clean Code: Conditional middleware usage.
 */
router.post('/', (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer')) {
    return protect(req, res, next);
  }
  next();
}, createSupportTicket);

// Tracking routes
router.get('/my', protect, getMyTickets);
router.get('/', protect, getTickets); // Note: Should restricted to admin role in future updates

export default router;
