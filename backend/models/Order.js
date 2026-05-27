/**
 * @fileoverview Order Model representing a transaction and its delivery status.
 */

import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  /**
   * user: Reference to the User who placed the order.
   * Adheres to Liskov Substitution Principle if we were to use sub-types of Users.
   */
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  /**
   * products: Array of product references with quantities.
   */
  products: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
  }],
  
  total: { type: Number, required: true },
  branch: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch' },
  paymentMethod: { type: String, required: true, default: 'Visa' }, // Mastercard, Visa, Mercado Pago, Cash
  deliveryMode: { type: String, enum: ['standard', 'express', 'pickup'], default: 'express' },
  
  /**
   * tracking: Dynamic data for real-time delivery monitoring.
   */
  tracking: {
    riderId: String,
    currentLocation: { lat: Number, lng: Number },
    history: [String]
  },
  
  status: { type: String, enum: ['pending', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
export default Order;
