import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const reproFailure = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        // Login as admin to get token
        const adminEmail = 'amansiyam44@gmail.com'; // From previous check_users output
        const admin = await User.findOne({ email: adminEmail });
        if (!admin) {
            console.log('Admin not found, cannot test register endpoint auth');
            process.exit(1);
        }

        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        // Test 1: Short password
        console.log('\n--- Test 1: Short Password (5 chars) ---');
        const res1 = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                name: 'Short Pass User',
                email: 'shortpass@test.com',
                password: '12345', // 5 chars
                role: 'staff'
            })
        });

        const data1 = await res1.json();
        console.log(`Status: ${res1.status}`);
        console.log('Response:', JSON.stringify(data1, null, 2));

        // Test 2: Valid password
        console.log('\n--- Test 2: Valid Password (6 chars) ---');
        const res2 = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                name: 'Valid Pass User',
                email: 'validpass@test.com',
                password: '123456', // 6 chars
                role: 'staff'
            })
        });

        const data2 = await res2.json();
        console.log(`Status: ${res2.status}`);
        console.log('Response:', JSON.stringify(data2, null, 2));

        // Cleanup
        await User.deleteOne({ email: 'shortpass@test.com' });
        await User.deleteOne({ email: 'validpass@test.com' });

        process.exit(0);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

reproFailure();
