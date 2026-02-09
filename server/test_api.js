import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const API_URL = 'http://localhost:5001/api';

const testAPI = async () => {
    try {
        console.log('Generating synthetic token...');
        // Random ID, as we suspect protect middleware doesn't check for null user
        const syntheticToken = jwt.sign({ id: '507f1f77bcf86cd799439011' }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });

        console.log('Fetching Pets from API...');
        const petsRes = await fetch(`${API_URL}/pets`, {
            headers: { 'Authorization': `Bearer ${syntheticToken}` }
        });

        const petsData = await petsRes.json();
        console.log('Pets Response Status:', petsRes.status);
        console.log('Pets Response Body:', JSON.stringify(petsData, null, 2));

    } catch (error) {
        console.error('Test failed:', error);
    }
};

testAPI();
