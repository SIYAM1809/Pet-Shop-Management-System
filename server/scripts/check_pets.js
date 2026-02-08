import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Pet from '../models/Pet.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const checkPets = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        const count = await Pet.countDocuments();
        const available = await Pet.countDocuments({ status: 'Available' });

        console.log(`Total Pets: ${count}`);
        console.log(`Available Pets: ${available}`);

        const pets = await Pet.find().sort({ createdAt: -1 }).limit(10);
        console.log('Most recent 10 pets:');
        pets.forEach(p => console.log(`- ${p.name} (${p.status})`));

        process.exit(0);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

checkPets();
