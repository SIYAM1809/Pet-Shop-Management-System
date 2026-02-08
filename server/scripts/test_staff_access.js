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

const testStaffAccess = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        const email = 'newstaff_access@test.com';
        const password = 'password123';

        // 1. Cleanup
        await User.deleteOne({ email });

        // 2. Create staff
        const user = await User.create({
            name: 'Access Test Staff',
            email,
            password,
            role: 'staff'
        });

        // 3. Login directly (generate token)
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        console.log('Generated token for staff user');

        // 4. Test API access (using fetch)
        // We need to run the server for this. Assuming server is running on 5000.
        const testEndpoint = async (url, name) => {
            try {
                const res = await fetch(url, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    console.log(`✅ [${name}] Access GRANTED (${res.status})`);
                } else {
                    console.log(`❌ [${name}] Access DENIED (${res.status})`);
                    const txt = await res.text();
                    console.log(`   Response: ${txt}`);
                }
            } catch (e) {
                console.log(`⚠️ [${name}] Error: ${e.message}`);
            }
        };

        await testEndpoint('http://localhost:5000/api/dashboard', 'Dashboard Stats');
        await testEndpoint('http://localhost:5000/api/pets', 'Get Pets');
        await testEndpoint('http://localhost:5000/api/customers', 'Get Customers');
        await testEndpoint('http://localhost:5000/api/orders', 'Get Orders');

        // Test Create Pet
        console.log('Testing Create Pet as Staff...');
        const petRes = await fetch('http://localhost:5000/api/pets', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: 'TestPet',
                species: 'Dog',
                breed: 'TestBreed',
                age: { value: 1, unit: 'years' },
                gender: 'Male',
                price: 100,
                status: 'Available',
                color: 'Black',
                health: { vaccinated: true, neutered: true, microchipped: true }
            })
        });

        if (petRes.ok) {
            console.log('✅ [Create Pet] Access GRANTED');
            const data = await petRes.json();
            // Cleanup pet
            await fetch(`http://localhost:5000/api/pets/${data.data._id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            console.log('   (Cleaned up created pet)');
        } else {
            console.log(`❌ [Create Pet] Access DENIED (${petRes.status})`);
            const txt = await petRes.text();
            console.log(`   Response: ${txt}`);
        }

        // 5. Cleanup
        await User.deleteOne({ email });
        process.exit(0);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

testStaffAccess();
