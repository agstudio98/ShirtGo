/**
 * @fileoverview Controller for Product-related operations.
 * Clean Code: Functions are small, single-purpose, and use catchAsync for error handling.
 */

import Product from '../models/Product.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';

/**
 * @desc    Fetch all products from the database
 * @route   GET /api/products
 * @access  Public
 */
export const getProducts = catchAsync(async (req, res, next) => {
  const products = await Product.find({});
  res.status(200).json({
    status: 'success',
    results: products.length,
    data: products
  });
});

/**
 * @desc    Fetch a single product by its ID
 * @route   GET /api/products/:id
 * @access  Public
 */
export const getProductById = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  
  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: product
  });
});

/**
 * @desc    Create a new product
 * @route   POST /api/products
 * @access  Private/Admin
 */
export const createProduct = catchAsync(async (req, res, next) => {
  const product = new Product(req.body);
  const createdProduct = await product.save();
  
  res.status(201).json({
    status: 'success',
    data: createdProduct
  });
});

/**
 * @desc    Update an existing product
 * @route   PUT /api/products/:id
 * @access  Private/Admin
 */
export const updateProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { 
    new: true,
    runValidators: true
  });
  
  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: product
  });
});

/**
 * @desc    Delete a product
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
export const deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  
  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});
