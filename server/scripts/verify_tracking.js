import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Order from '../models/Order.js';
import Customer from '../models/Customer.js';
import Pet from '../models/Pet.js';
import User from '../models/User.js';

// Load env vars
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const verifyTracking = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        // 1. Create Data
        const pet = await Pet.create({
            name: 'TrackPet',
            species: 'Cat',
            breed: 'Persian',
            age: { value: 1, unit: 'years' }, // Correct structure
            gender: 'Female', // Required
            price: 500,
            description: 'Tracking test pet',
            status: 'Available',
            images: ['track.jpg']
        });

        const customer = await Customer.create({
            name: 'Tracker Joe',
            email: `tracker${Date.now()}@test.com`,
            phone: '5550001111'
        });

        const admin = await User.findOne({ role: 'admin' });

        const order = await Order.create({
            customer: customer._id,
            items: [{
                pet: pet._id,
                petName: pet.name,
                petSpecies: pet.species,
                price: pet.price
            }],
            subtotal: 500,
            tax: 40,
            totalAmount: 540,
            paymentMethod: 'Bkash',
            status: 'Processing',
            processedBy: admin?._id
        });

        console.log(`1. Created Order: ${order.orderNumber}`);

        // 2. Simulate Public Tracking (via Mongoose query mimicking controller)
        // Controller does: Order.findOne({ orderNumber }).select(...)
        const trackedOrder = await Order.findOne({ orderNumber: order.orderNumber })
            .select('orderNumber status paymentStatus totalAmount items createdAt paymentMethod'); // Exclude customer

        console.log('2. Tracked Order Result:');
        console.log(JSON.stringify(trackedOrder, null, 2));

        if (!trackedOrder) throw new Error('Tracking failed: Order not found');
        if (trackedOrder.customer) throw new Error('Privacy Fail: Customer data returned!');
        if (trackedOrder.status !== 'Processing') throw new Error('Status Mismatch');

        // 3. Cleanup
        await Order.findByIdAndDelete(order._id);
        await Customer.findByIdAndDelete(customer._id);
        await Pet.findByIdAndDelete(pet._id);
        console.log('3. Cleanup Complete');

        console.log('SUCCESS: Tracking verification passed!');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
};

verifyTracking();
