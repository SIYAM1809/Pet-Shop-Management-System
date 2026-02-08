import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Pet from '../models/Pet.js';

// Load env vars
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const checkPets = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        const pets = await Pet.find({});
        console.log(`Total Pets: ${pets.length}`);

        const available = pets.filter(p => p.status === 'Available');
        console.log(`Available Pets: ${available.length}`);

        if (available.length === 0) {
            console.log('No available pets found! This is why the section is empty.');
        } else {
            console.log('Available Pets:');
            available.forEach(p => console.log(`- ${p.name} (${p.species}, ${p.breed})`));
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
};

checkPets();
