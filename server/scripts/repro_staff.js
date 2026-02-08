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

const reproStaff = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);

        const email = 'newstaff@test.com';
        const password = 'password123';

        // 1. Cleanup
        await User.deleteOne({ email });

        // 2. Create staff
        console.log('Creating new staff user...');
        const user = await User.create({
            name: 'New Staff',
            email,
            password,
            role: 'staff' // Lowercase
        });
        console.log(`User created: ${user.email}, role: ${user.role}`);

        // 3. Simulate Login
        console.log('Simulating login...');
        const foundUser = await User.findOne({ email }).select('+password');
        if (!foundUser) throw new Error('User not found after creation');

        const isMatch = await foundUser.matchPassword(password);
        if (!isMatch) throw new Error('Password mismatch');

        console.log('Login successful!');
        console.log('User Role:', foundUser.role);

        // 4. Cleanup
        await User.deleteOne({ email });
        console.log('Cleanup done.');

        process.exit(0);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

reproStaff();
