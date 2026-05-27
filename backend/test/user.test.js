/**
 * @fileoverview Unit tests for the User API.
 * Uses mongodb-memory-server for isolated and fast testing.
 * 
 * Clean Code: Tests are descriptive, use shared setup, and follow the 
 * Arrange-Act-Assert (AAA) pattern.
 */

import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import app from '../app.js';
import User from '../models/User.js';

let mongoServer;

/**
 * Global Setup: Initializes the in-memory database before running tests.
 */
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

/**
 * Global Teardown: Closes the connection and stops the server.
 */
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

/**
 * Individual Test Cleanup: Clears users between test cases to ensure idempotency.
 */
afterEach(async () => {
  await User.deleteMany({});
});

describe('User API Endpoints', () => {
  const testUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'Password123!',
  };

  /**
   * Test Registration Flow
   */
  describe('POST /api/users/register', () => {
    it('should successfully register a new user and return a token', async () => {
      const res = await request(app)
        .post('/api/users/register')
        .send(testUser);

      expect(res.statusCode).toBe(201);
      expect(res.body.status).toBe('success');
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data.email).toBe(testUser.email);
    });

    it('should fail if the email is already registered', async () => {
      // Arrange: Create a user first
      await User.create(testUser);

      // Act: Try to register the same user
      const res = await request(app)
        .post('/api/users/register')
        .send(testUser);

      // Assert
      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe('fail');
    });
  });

  /**
   * Test Login Flow
   */
  describe('POST /api/users/login', () => {
    beforeEach(async () => {
      await User.create(testUser);
    });

    it('should successfully log in and return a JWT token', async () => {
      const res = await request(app)
        .post('/api/users/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.data).toHaveProperty('token');
    });

    it('should fail with incorrect credentials', async () => {
      const res = await request(app)
        .post('/api/users/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword',
        });

      expect(res.statusCode).toBe(401);
    });
  });

  /**
   * Test Profile Management (Protected Routes)
   */
  describe('GET /api/users/profile', () => {
    let token;

    beforeEach(async () => {
      const user = await User.create(testUser);
      // Simulate JWT generation logic (or use the one from the controller if preferred)
      const res = await request(app)
        .post('/api/users/login')
        .send({ email: testUser.email, password: testUser.password });
      token = res.body.data.token;
    });

    it('should fetch the user profile when authenticated', async () => {
      const res = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.email).toBe(testUser.email);
    });

    it('should return 401 if no token is provided', async () => {
      const res = await request(app).get('/api/users/profile');
      expect(res.statusCode).toBe(401);
    });
  });
});
