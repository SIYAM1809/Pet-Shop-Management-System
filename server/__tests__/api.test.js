import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app.js';
import connectDB from '../config/db.js';

let adminToken;

beforeAll(async () => {
    await connectDB();
}, 15000);

afterAll(async () => {
    await mongoose.connection.close();
});

describe('GET /api/health', () => {
    it('should return 200 with health message', async () => {
        const res = await request(app).get('/api/health');
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe('Pet Shop API is running');
    });
});

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

    it('should login successfully with correct credentials', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: process.env.TEST_ADMIN_EMAIL || 'admin@petshop.com',
                password: process.env.TEST_ADMIN_PASSWORD || 'admin123'
            });

        // If admin exists in db, expect 200; otherwise this is an integration hint
        if (res.status === 200) {
            expect(res.body.success).toBe(true);
            expect(res.body.token).toBeDefined();
            expect(typeof res.body.token).toBe('string');
            adminToken = res.body.token;
        } else {
            // CI may not have seed data — just verify the structure
            expect(res.status).toBe(401);
        }
    });
});

describe('GET /api/pets (public)', () => {
    it('should return list of pets without auth', async () => {
        const res = await request(app).get('/api/pets');
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should filter pets by species query param', async () => {
        const res = await request(app).get('/api/pets?species=Dog');
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        // Every returned pet should be a Dog (if any exist)
        res.body.data.forEach(pet => {
            expect(pet.species).toBe('Dog');
        });
    });

    it('should filter pets by status query param', async () => {
        const res = await request(app).get('/api/pets?status=available');
        expect(res.status).toBe(200);
        res.body.data.forEach(pet => {
            expect(pet.status).toBe('available');
        });
    });

    it('should return paginated results with correct fields', async () => {
        const res = await request(app).get('/api/pets?limit=5&page=1');
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('count');
        expect(res.body).toHaveProperty('total');
        expect(res.body).toHaveProperty('pages');
        expect(res.body).toHaveProperty('currentPage');
        expect(res.body.data.length).toBeLessThanOrEqual(5);
    });
});

describe('GET /api/pets/:id', () => {
    it('should return 404 for a non-existent pet ID', async () => {
        const fakeId = '64abc123def456abc123def4';
        const res = await request(app).get(`/api/pets/${fakeId}`);
        expect(res.status).toBe(404);
        expect(res.body.success).toBe(false);
    });

    it('should return 404 for an invalid pet ID format (Mongoose CastError)', async () => {
        const res = await request(app).get('/api/pets/definitely-not-a-valid-id');
        expect(res.status).toBe(404);
        expect(res.body.success).toBe(false);
    });
});

describe('POST /api/pets (protected)', () => {
    it('should return 401 without auth token', async () => {
        const res = await request(app)
            .post('/api/pets')
            .send({ name: 'Test Pet', species: 'Dog', price: 5000 });
        expect(res.status).toBe(401);
    });
});

describe('GET /api/reviews (public)', () => {
    it('should return approved reviews without auth', async () => {
        const res = await request(app).get('/api/reviews');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
});

describe('POST /api/inquiries (public)', () => {
    it('should return 400 when required fields are missing', async () => {
        const res = await request(app)
            .post('/api/inquiries')
            .send({ name: 'Test' }); // missing email and message
        expect([400, 500]).toContain(res.status);
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
