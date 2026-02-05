import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Pet from './models/Pet.js';

dotenv.config();

const checkDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const count = await Pet.countDocuments();
        console.log(`Total Pets in DB: ${count}`);

        const pets = await Pet.find({});
        console.log('Pets:', JSON.stringify(pets, null, 2));

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkDB();
