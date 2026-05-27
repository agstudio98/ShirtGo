/**
 * @fileoverview Unit tests for the Product API.
 * Ensures the catalog can be retrieved and products managed correctly.
 */

import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import app from '../app.js';
import Product from '../models/Product.js';

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Product.deleteMany({});
});

describe('Product API Endpoints', () => {
  const sampleProduct = {
    name: 'Brutalist T-Shirt',
    description: 'High contrast design',
    price: 15000,
    category: 'Shirts',
    imageUrl: 'shirt-icon',
    stock: 50
  };

  /**
   * Test Get All Products
   */
  describe('GET /api/products', () => {
    it('should return an empty list if no products exist', async () => {
      const res = await request(app).get('/api/products');
      expect(res.statusCode).toBe(200);
      expect(res.body.data).toEqual([]);
    });

    it('should return all products in the database', async () => {
      // Arrange
      await Product.create(sampleProduct);

      // Act
      const res = await request(app).get('/api/products');

      // Assert
      expect(res.statusCode).toBe(200);
      expect(res.body.results).toBe(1);
      expect(res.body.data[0].name).toBe(sampleProduct.name);
    });
  });

  /**
   * Test Get Single Product
   */
  describe('GET /api/products/:id', () => {
    it('should return 404 for a non-existent product ID', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app).get(`/api/products/${fakeId}`);
      expect(res.statusCode).toBe(404);
    });

    it('should return product details for a valid ID', async () => {
      const product = await Product.create(sampleProduct);
      const res = await request(app).get(`/api/products/${product._id}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.data.name).toBe(sampleProduct.name);
    });
  });

  /**
   * Test Product Creation
   */
  describe('POST /api/products', () => {
    it('should create a new product', async () => {
      const res = await request(app)
        .post('/api/products')
        .send(sampleProduct);

      expect(res.statusCode).toBe(201);
      expect(res.body.data.name).toBe(sampleProduct.name);
    });
  });
});
