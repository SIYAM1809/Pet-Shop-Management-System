import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const require = createRequire(import.meta.url);
const swaggerJsdoc = require('swagger-jsdoc');

// Get __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: "🐾 Pet Shop Management System API",
            version: '1.0.0',
            description: `
## Pet Shop Management System - REST API

A comprehensive backend API for managing a pet shop business, including pets, customers, orders, reviews, appointments, and more.

### Authentication
This API uses **JWT (Bearer Token)** authentication. To access protected endpoints:
1. Login via \`POST /api/auth/login\`
2. Copy the \`token\` from the response
3. Click **Authorize** above and enter: \`Bearer <your-token>\`

### Default Credentials
- **Admin:** admin@petshop.com / admin123
- **Staff:** staff@petshop.com / staff123
            `,
            contact: {
                name: 'Pet Shop API Support',
                email: 'admin@petshop.com'
            },
            license: {
                name: 'MIT',
                url: 'https://opensource.org/licenses/MIT'
            }
        },
        servers: [
            {
                url: 'http://localhost:5001',
                description: 'Development Server'
            },
            {
                url: 'http://localhost:3000',
                description: 'Docker Server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Enter your JWT token obtained from /api/auth/login'
                }
            },
            schemas: {
                // Auth schemas
                LoginRequest: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                        email: { type: 'string', format: 'email', example: 'admin@petshop.com' },
                        password: { type: 'string', example: 'admin123' }
                    }
                },
                AuthResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: true },
                        token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
                        user: { $ref: '#/components/schemas/User' }
                    }
                },
                User: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string', example: '64abc123def456' },
                        name: { type: 'string', example: 'Admin User' },
                        email: { type: 'string', example: 'admin@petshop.com' },
                        role: { type: 'string', enum: ['admin', 'staff'], example: 'admin' },
                        createdAt: { type: 'string', format: 'date-time' }
                    }
                },
                // Pet schemas
                Pet: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string', example: '64abc123def456' },
                        name: { type: 'string', example: 'Max' },
                        species: { type: 'string', example: 'Dog' },
                        breed: { type: 'string', example: 'Golden Retriever' },
                        age: { type: 'number', example: 2 },
                        price: { type: 'number', example: 15000 },
                        description: { type: 'string', example: 'Friendly and playful dog' },
                        status: { type: 'string', enum: ['available', 'sold', 'reserved'], example: 'available' },
                        image: { type: 'string', example: 'https://...' },
                        createdAt: { type: 'string', format: 'date-time' }
                    }
                },
                PetInput: {
                    type: 'object',
                    required: ['name', 'species', 'price'],
                    properties: {
                        name: { type: 'string', example: 'Max' },
                        species: { type: 'string', example: 'Dog' },
                        breed: { type: 'string', example: 'Golden Retriever' },
                        age: { type: 'number', example: 2 },
                        price: { type: 'number', example: 15000 },
                        description: { type: 'string', example: 'Friendly and playful dog' },
                        status: { type: 'string', enum: ['available', 'sold', 'reserved'] },
                        image: { type: 'string', example: 'base64 or URL' }
                    }
                },
                // Order schemas
                Order: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        orderNumber: { type: 'string', example: 'ORD-2024-001' },
                        customer: { $ref: '#/components/schemas/Customer' },
                        pet: { $ref: '#/components/schemas/Pet' },
                        totalAmount: { type: 'number', example: 15000 },
                        status: { type: 'string', enum: ['pending', 'processing', 'completed', 'cancelled'], example: 'pending' },
                        paymentMethod: { type: 'string', example: 'cash' },
                        createdAt: { type: 'string', format: 'date-time' }
                    }
                },
                // Customer schemas
                Customer: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        name: { type: 'string', example: 'John Doe' },
                        email: { type: 'string', example: 'john@example.com' },
                        phone: { type: 'string', example: '01700000000' },
                        address: { type: 'string', example: 'Dhaka, Bangladesh' },
                        createdAt: { type: 'string', format: 'date-time' }
                    }
                },
                // Error schema
                Error: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: false },
                        error: { type: 'string', example: 'Resource not found' }
                    }
                },
                // Success schema
                Success: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: true },
                        data: { type: 'object' }
                    }
                },
                // Review schema
                Review: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        name: { type: 'string', example: 'Jane Doe' },
                        rating: { type: 'number', minimum: 1, maximum: 5, example: 5 },
                        comment: { type: 'string', example: 'Great service!' },
                        status: { type: 'string', enum: ['pending', 'approved', 'rejected'], example: 'pending' },
                        createdAt: { type: 'string', format: 'date-time' }
                    }
                },
                // Appointment schema
                Appointment: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        customerName: { type: 'string', example: 'John Doe' },
                        customerEmail: { type: 'string', example: 'john@example.com' },
                        customerPhone: { type: 'string', example: '01700000000' },
                        petName: { type: 'string', example: 'Max' },
                        service: { type: 'string', example: 'Grooming' },
                        date: { type: 'string', format: 'date', example: '2024-12-01' },
                        time: { type: 'string', example: '10:00 AM' },
                        status: { type: 'string', enum: ['pending', 'confirmed', 'cancelled'], example: 'pending' },
                        createdAt: { type: 'string', format: 'date-time' }
                    }
                }
            }
        },
        tags: [
            { name: 'Auth', description: 'Authentication & user management' },
            { name: 'Pets', description: 'Pet CRUD operations' },
            { name: 'Orders', description: 'Order management' },
            { name: 'Customers', description: 'Customer management' },
            { name: 'Reviews', description: 'Customer reviews' },
            { name: 'Appointments', description: 'Appointment booking' },
            { name: 'Inquiries', description: 'Customer inquiries' },
            { name: 'Subscribers', description: 'Newsletter subscribers' },
            { name: 'Dashboard', description: 'Dashboard stats' },
            { name: 'Health', description: 'System health check' }
        ]
    },
    apis: [
        join(__dirname, '../routes/*.js'),
        join(__dirname, '../server.js')
    ]
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
