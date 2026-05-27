/**
 * @fileoverview Product Domain Routes.
 * Provides endpoints for catalog browsing and administration.
 */

import express from 'express';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js';

const router = express.Router();

/**
 * Clean Code: Use router.route() to group multiple methods for the same path.
 */
router.route('/')
  .get(getProducts)
  .post(createProduct);

router.route('/:id')
  .get(getProductById)
  .put(updateProduct)
  .delete(deleteProduct);

export default router;
