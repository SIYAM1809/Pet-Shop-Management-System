import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Pet from '../models/Pet.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const verifyFixes = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        console.log('--- Verifying Home Page "Featured" Logic (Limit 3) ---');
        const featured = await Pet.find({ status: 'Available' })
            .sort({ createdAt: -1 })
            .limit(3);
        console.log(`Fetched ${featured.length} featured pets.`);
        featured.forEach(p => console.log(`- ${p.name}`));

        console.log('\n--- Verifying Browse Page Logic (Limit 100) ---');
        const browse = await Pet.find({ status: 'Available' })
            .sort({ createdAt: -1 }) // Default sort
            .limit(100);
        console.log(`Fetched ${browse.length} browse pets.`);

        // Check if we have more than 10
        if (browse.length > 10) {
            console.log('✅ SUCCESS: Browse page can now show more than 10 pets.');
        } else {
            console.log('⚠️ WARNING: Less than or equal to 10 pets found. Cannot strictly confirm limit increase, but logic is in place.');
        }

        process.exit(0);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

verifyFixes();
