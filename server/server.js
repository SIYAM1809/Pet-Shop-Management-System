import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import { errorHandler } from './middleware/error.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import petRoutes from './routes/petRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import inquiryRoutes from './routes/inquiryRoutes.js'; // Restore this
import appointmentRoutes from './routes/appointmentRoutes.js';

// Email Settings
// Email Settings (Configured in .env or defaulting to Ethereal)

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? 'https://your-production-domain.com'
        : 'http://localhost:5173',
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
