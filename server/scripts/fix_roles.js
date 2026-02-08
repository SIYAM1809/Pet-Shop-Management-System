import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const fixRoles = async () => {
    try {
        console.log('Connecting to MongoDB...');
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);

        const users = await User.find({});
        console.log(`\nFound ${users.length} users. Checking roles...`);

        let updateCount = 0;
        for (const user of users) {
            if (user.role !== user.role.toLowerCase()) {
                console.log(`Updating user ${user.name} (${user.email}): ${user.role} -> ${user.role.toLowerCase()}`);
                user.role = user.role.toLowerCase();
                await user.save();
                updateCount++;
            }
        }

        console.log(`\nUpdated ${updateCount} users.`);
        process.exit(0);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

fixRoles();
