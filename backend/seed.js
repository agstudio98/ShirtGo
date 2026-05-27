/**
 * @fileoverview Database Seeding Script for ShirtGo.
 * This script initializes the database with sample products and branch locations.
 * 
 * Clean Code Principles:
 * - Idempotency: The script clears existing data before inserting new data to ensure a consistent state.
 * - Separation of Concerns: Data definitions are separated from the execution logic.
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import Branch from './models/Branch.js';

// Load environment variables for DB connection URI
dotenv.config();

/**
 * Sample Branch Data
 * Represents physical locations of partner stores.
 */
const branches = [
  { name: 'Alto Rosario', address: 'Junín 385', city: 'Rosario', chain: 'Tejano' },
  { name: 'Abasto Shopping', address: 'Av. Corrientes 3247', city: 'CABA', chain: 'Equus' },
  { name: 'Florida St.', address: 'Florida 329', city: 'CABA', chain: 'Macowens' },
  { name: 'Unicenter', address: 'Paraná 3745', city: 'Martínez', chain: 'Cristobal Colon' },
  { name: 'Paseo Alcorta', address: 'Jerónimo Salguero 3172', city: 'CABA', chain: 'Key Biscayne' },
  { name: 'Galerías Pacífico', address: 'Florida 737', city: 'CABA', chain: 'Prototype' },
];

/**
 * Sample Product Data
 * Represents items available in the catalog.
 */
const products = [
  {
    name: 'Remera "Urbana"',
    description: 'Remera de algodón premium con calce oversize.',
    price: 18500,
    category: 'Shirts',
    stock: 100,
    imageUrl: 'shirt-icon',
  },
  {
    name: 'Jean "Slim Fit"',
    description: 'Jean elastizado de alta calidad.',
    price: 45200,
    category: 'Pants',
    stock: 50,
    imageUrl: 'pants-icon',
  },
  {
    name: 'Camisa "Noche"',
    description: 'Camisa formal ideal para eventos.',
    price: 32000,
    category: 'Shirts',
    stock: 30,
    imageUrl: 'dress-shirt-icon',
  },
  {
    name: 'Hoodie "Graffiti"',
    description: 'Buzo con capucha y estampa exclusiva.',
    price: 58000,
    category: 'Hoodies',
    stock: 20,
    imageUrl: 'hoodie-icon',
  },
  {
    name: 'Chomba "Classic"',
    description: 'Chomba piqué con logo bordado.',
    price: 28500,
    category: 'Shirts',
    stock: 40,
    imageUrl: 'shirt-icon',
  },
  {
    name: 'Bermuda "Cargo"',
    description: 'Bermuda con bolsillos laterales.',
    price: 35000,
    category: 'Pants',
    stock: 25,
    imageUrl: 'pants-icon',
  },
];

/**
 * Core Seeding Function
 * orchestrates the connection, cleanup, and data insertion.
 * 
 * @returns {Promise<void>}
 */
const seedDB = async () => {
  try {
    // Establish connection to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27012/dbShirtGo');
    console.log('[Seed] Database connected successfully.');
    
    // 1) Clean up existing data to avoid duplicates and ensure a fresh start
    console.log('[Seed] Cleaning up existing collections...');
    await Product.deleteMany({});
    await Branch.deleteMany({});
    
    // 2) Insert sample data using Mongoose models
    console.log('[Seed] Seeding branches...');
    await Branch.insertMany(branches);
    console.log('[Seed] Branches seeded successfully.');
    
    console.log('[Seed] Seeding products...');
    await Product.insertMany(products);
    console.log('[Seed] Products seeded successfully.');
    
    // 3) Graceful shutdown
    console.log('[Seed] Seeding process completed.');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('[Seed] Error during seeding process:', error.message);
    // Exit with failure code
    process.exit(1);
  }
};

// Execute the seeding process
seedDB();
