import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const swaggerUi = require('swagger-ui-express');

import swaggerSpec from './config/swagger.js';
import connectDB from './config/db.js';
import { errorHandler } from './middleware/error.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import petRoutes from './routes/petRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import inquiryRoutes from './routes/inquiryRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import subscriberRoutes from './routes/subscriberRoutes.js';

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json({ limit: '10mb' })); // Increased to 10mb for base64 images

// Enable CORS - Support both Docker (port 3000) and dev server (port 5173)
const allowedOrigins = [
    'http://localhost:3000',  // Docker frontend (Nginx)
    'http://localhost:5173',  // Vite dev server
    'http://localhost:5001',  // Swagger UI (same server)
    process.env.FRONTEND_URL  // Production URL (if set)
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, Postman, or same-origin)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/subscribers', subscriberRoutes);

// Swagger API Docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { background-color: #1a1a2e; }',
    customSiteTitle: '🐾 Pet Shop API Docs',
    swaggerOptions: {
        persistAuthorization: true
    }
}));

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Check if the API is running
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Pet Shop API is running
 */
// Health check
app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'Pet Shop API is running' });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📦 Environment: ${process.env.NODE_ENV}`);
});
