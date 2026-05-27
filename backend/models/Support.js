/**
 * @fileoverview Support Model representing customer inquiries and automated responses.
 */

import mongoose from 'mongoose';

const supportSchema = new mongoose.Schema({
  /**
   * user: Optional reference for registered users.
   */
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  email: { type: String, required: true },
  message: { type: String, required: true },
  response: { type: String },
  status: { type: String, enum: ['open', 'closed'], default: 'open' },
}, { timestamps: true });

const Support = mongoose.model('Support', supportSchema);
export default Support;
