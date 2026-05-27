/**
 * @fileoverview Controller for Customer Support Tickets.
 * Handles ticket creation and retrieval for users and administrators.
 */

import Support from '../models/Support.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';

/**
 * @desc    Create a new support ticket
 * @route   POST /api/support
 * @access  Public/Private
 */
export const createSupportTicket = catchAsync(async (req, res, next) => {
  const { message } = req.body;
  
  // Clean Code: Fallback mechanisms for email identification
  const email = req.user ? req.user.email : req.body.email || 'guest@shirtgo.com';
  
  // Standard automated response template
  const automatedResponse = "¡Hola! Recibimos tu consulta. Nuestro equipo de soporte técnico la revisará y te responderá a la brevedad. Si tu consulta es sobre el estado de un pedido, recordá que podés seguirlo en tiempo real desde el mapa en la barra de navegación. ¡Muchas gracias por elegir ShirtGo!";

  const ticket = new Support({
    user: req.user ? req.user._id : null,
    email: email,
    message,
    response: automatedResponse,
  });

  const savedTicket = await ticket.save();

  res.status(201).json({
    status: 'success',
    data: savedTicket
  });
});

/**
 * @desc    Get support tickets for the logged-in user
 * @route   GET /api/support/mytickets
 * @access  Private
 */
export const getMyTickets = catchAsync(async (req, res, next) => {
  if (!req.user) {
    return next(new AppError('Unauthorized: Please log in to view your tickets', 401));
  }

  const tickets = await Support.find({ user: req.user._id }).sort({ createdAt: -1 });
  
  res.status(200).json({
    status: 'success',
    results: tickets.length,
    data: tickets
  });
});

/**
 * @desc    Fetch all tickets (Admin only view)
 * @route   GET /api/support
 * @access  Private/Admin
 */
export const getTickets = catchAsync(async (req, res, next) => {
  const tickets = await Support.find({}).populate('user', 'name email');
  
  res.status(200).json({
    status: 'success',
    results: tickets.length,
    data: tickets
  });
});
