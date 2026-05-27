/**
 * @fileoverview Unit tests for the Support API.
 * Verifies ticket creation for both guests and authenticated users.
 */

import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import app from '../app.js';
import User from '../models/User.js';
import Support from '../models/Support.js';

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
  await Support.deleteMany({});
});

describe('Support API Endpoints', () => {
  const testUser = { name: 'Support Test', email: 'support@test.com', password: 'Password123!' };
  
  /**
   * Test Ticket Creation
   */
  describe('POST /api/support', () => {
    it('should allow a guest to create a ticket', async () => {
      const res = await request(app)
        .post('/api/support')
        .send({ email: 'guest@example.com', message: 'I need help' });

      expect(res.statusCode).toBe(201);
      expect(res.body.data.email).toBe('guest@example.com');
      expect(res.body.data.response).toBeDefined(); // Automated response check
    });

    it('should link a ticket to a logged-in user', async () => {
      // 1) Register and login
      await request(app).post('/api/users/register').send(testUser);
      const loginRes = await request(app).post('/api/users/login').send({ email: testUser.email, password: testUser.password });
      const token = loginRes.body.data.token;

      // 2) Create ticket with auth
      const res = await request(app)
        .post('/api/support')
        .set('Authorization', `Bearer ${token}`)
        .send({ message: 'Help with my account' });

      expect(res.statusCode).toBe(201);
      expect(res.body.data.user).toBeDefined();
    });
  });

  /**
   * Test My Tickets Retrieval
   */
  describe('GET /api/support/my', () => {
    it('should return all tickets for the authenticated user', async () => {
      // Setup: register, login, and create ticket
      await request(app).post('/api/users/register').send(testUser);
      const loginRes = await request(app).post('/api/users/login').send({ email: testUser.email, password: testUser.password });
      const token = loginRes.body.data.token;

      await request(app).post('/api/support').set('Authorization', `Bearer ${token}`).send({ message: 'Ticket 1' });

      const res = await request(app)
        .get('/api/support/my')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.results).toBe(1);
    });
  });
});
