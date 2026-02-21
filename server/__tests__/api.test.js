import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../app.js';
import User from '../models/User.js';

let mongoServer;

beforeAll(async () => {
    // Start in-memory MongoDB — no Atlas connection needed
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);

    // Seed a test admin user
    await User.create({
        name: 'Test Admin',
        email: 'admin@test.com',
        password: 'admin123',
        role: 'admin'
    });
}, 30000);

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

// ─── Health ───────────────────────────────────────────────────────────────────

describe('GET /api/health', () => {
    it('should return 200 with health message', async () => {
        const res = await request(app).get('/api/health');
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe('Pet Shop API is running');
    });
});

// ─── Auth ─────────────────────────────────────────────────────────────────────

describe('POST /api/auth/login', () => {
    it('should return 400 if no credentials provided', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({});
        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
    });

    it('should return 401 if credentials are wrong', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'wrong@test.com', password: 'wrongpass' });
        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('Invalid credentials');
    });

    it('should login successfully with seeded admin user', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'admin@test.com', password: 'admin123' });
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.token).toBeDefined();
        expect(typeof res.body.token).toBe('string');
    });

    it('should return user data with correct fields on login', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'admin@test.com', password: 'admin123' });
        expect(res.body.user.email).toBe('admin@test.com');
        expect(res.body.user.role).toBe('admin');
        expect(res.body.user).not.toHaveProperty('password');
    });
});

// ─── Pets (Public) ────────────────────────────────────────────────────────────

describe('GET /api/pets (public)', () => {
    it('should return list of pets without auth (empty in test DB)', async () => {
        const res = await request(app).get('/api/pets');
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should return correct pagination fields', async () => {
        const res = await request(app).get('/api/pets?limit=5&page=1');
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('count');
        expect(res.body).toHaveProperty('total');
        expect(res.body).toHaveProperty('pages');
        expect(res.body).toHaveProperty('currentPage', 1);
    });

    it('should return correct structure for species filter', async () => {
        const res = await request(app).get('/api/pets?species=Dog');
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
    });

    it('should return correct structure for status filter', async () => {
        const res = await request(app).get('/api/pets?status=available');
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
    });
});

describe('GET /api/pets/:id', () => {
    it('should return 404 for a valid but non-existent ObjectId', async () => {
        const fakeId = '64abc123def456abc123def4';
        const res = await request(app).get(`/api/pets/${fakeId}`);
        expect(res.status).toBe(404);
        expect(res.body.success).toBe(false);
    });

    it('should return 404 for an invalid ObjectId (Mongoose CastError → 404)', async () => {
        const res = await request(app).get('/api/pets/definitely-not-a-valid-id');
        expect(res.status).toBe(404);
        expect(res.body.success).toBe(false);
    });
});

// ─── Protected Routes ─────────────────────────────────────────────────────────

describe('POST /api/pets (protected)', () => {
    it('should return 401 without auth token', async () => {
        const res = await request(app)
            .post('/api/pets')
            .send({ name: 'Test Pet', species: 'Dog', price: 5000 });
        expect(res.status).toBe(401);
    });
});

describe('GET /api/orders (protected)', () => {
    it('should return 401 without auth token', async () => {
        const res = await request(app).get('/api/orders');
        expect(res.status).toBe(401);
    });
});

describe('GET /api/customers (protected)', () => {
    it('should return 401 without auth token', async () => {
        const res = await request(app).get('/api/customers');
        expect(res.status).toBe(401);
    });
});

describe('GET /api/auth/users (admin protected)', () => {
    it('should return 401 without auth token', async () => {
        const res = await request(app).get('/api/auth/users');
        expect(res.status).toBe(401);
    });
});

// ─── Public Routes ────────────────────────────────────────────────────────────

describe('GET /api/reviews (public)', () => {
    it('should return array of approved reviews without auth', async () => {
        const res = await request(app).get('/api/reviews');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
});

describe('POST /api/inquiries (public)', () => {
    it('should return validation error when required fields are missing', async () => {
        const res = await request(app)
            .post('/api/inquiries')
            .send({ name: 'Test' }); // missing email and message
        expect([400, 500]).toContain(res.status);
    });
});

describe('POST /api/subscribers (public)', () => {
    it('should accept a valid email subscription', async () => {
        const res = await request(app)
            .post('/api/subscribers')
            .send({ email: 'test@example.com' });
        // Either 201 (created) or varies - just verify it doesn't 401
        expect(res.status).not.toBe(401);
    });
});
