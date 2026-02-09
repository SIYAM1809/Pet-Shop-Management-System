import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import connectDB from './config/db.js';

dotenv.config();

const checkAdmin = async () => {
    try {
        await connectDB();

        console.log('Checking for Admin user...');
        const admin = await User.findOne({ email: 'admin@petshop.com' });

        if (!admin) {
            console.log('Admin user NOT found!');
            // Only create if missing (or we can force reset)
            console.log('Creating Admin user...');
            await User.create({
                name: 'Admin User',
                email: 'admin@petshop.com',
                password: 'password123',
                role: 'admin'
            });
            console.log('Admin user created with password: password123');
        } else {
            console.log('Admin user found:', admin.email);
            console.log('Role:', admin.role);
            // Optional: Force reset password to be sure
            // admin.password = 'password123';
            // await admin.save();
            // console.log('Admin password reset to: password123');
        }

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkAdmin();
