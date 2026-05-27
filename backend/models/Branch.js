/**
 * @fileoverview Branch Model representing physical supermarket locations.
 */

import mongoose from 'mongoose';

const branchSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  chain: { type: String, required: true }, // e.g., Tejano, Fabrizzi, Renner
  
  /**
   * location: Geospatial coordinates for mapping purposes.
   */
  location: {
    lat: Number,
    lng: Number
  }
}, { timestamps: true });

const Branch = mongoose.model('Branch', branchSchema);
export default Branch;
