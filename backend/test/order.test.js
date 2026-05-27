/**
 * @fileoverview Unit tests for the Order API.
 * Verifies order creation and history retrieval.
 */

import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import app from '../app.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

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
  await User.deleteMany({});
  await Product.deleteMany({});
  await Order.deleteMany({});
});

describe('Order API Endpoints', () => {
  const testUser = { name: 'Order Test', email: 'order@test.com', password: 'Password123!' };
  
  /**
   * Setup: Helper to get a token and a product ID
   */
  const setupOrderContext = async () => {
    await request(app).post('/api/users/register').send(testUser);
    const loginRes = await request(app).post('/api/users/login').send({ email: testUser.email, password: testUser.password });
    
    const product = await Product.create({
      name: 'Order Product',
      description: 'Test description',
      price: 1000,
      category: 'Test',
      imageUrl: 'test-icon',
      stock: 10
    });

    return { token: loginRes.body.data.token, productId: product._id };
  };

  /**
   * Test Order Creation
   */
  describe('POST /api/orders', () => {
    it('should create an order for an authenticated user', async () => {
      const { token, productId } = await setupOrderContext();

      const res = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${token}`)
        .send({
          orderItems: [{ product: productId, quantity: 2 }],
          total: 2000
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.data.total).toBe(2000);
      expect(res.body.data.products.length).toBe(1);
    });

    it('should fail to create an order if items are empty', async () => {
      const { token } = await setupOrderContext();

      const res = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${token}`)
        .send({ orderItems: [], total: 0 });

      expect(res.statusCode).toBe(400);
    });
  });

  /**
   * Test My Orders Retrieval
   */
  describe('GET /api/orders', () => {
    it('should return my order history', async () => {
      const { token, productId } = await setupOrderContext();

      // Create an order first
      await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${token}`)
        .send({ orderItems: [{ product: productId, quantity: 1 }], total: 1000 });

      const res = await request(app)
        .get('/api/orders')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.results).toBe(1);
    });
  });
});
