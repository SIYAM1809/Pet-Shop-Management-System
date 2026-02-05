import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Pet from './models/Pet.js';
import Customer from './models/Customer.js';
import Order from './models/Order.js';

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing data
        await User.deleteMany();
        await Pet.deleteMany();
        await Customer.deleteMany();
        await Order.deleteMany();
        console.log('Cleared existing data');

        // Create admin user
        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@petshop.com',
            password: 'admin123',
            role: 'admin'
        });

        // Create staff user
        await User.create({
            name: 'Staff Member',
            email: 'staff@petshop.com',
            password: 'staff123',
            role: 'staff'
        });

        console.log('Created users');

        // Create pets
        const pets = await Pet.insertMany([
            {
                name: 'Max',
                species: 'Dog',
                breed: 'Golden Retriever',
                age: { value: 2, unit: 'years' },
                gender: 'Male',
                price: 850,
                status: 'Available',
                description: 'Friendly and energetic golden retriever, great with kids.',
                color: 'Golden',
                weight: 30,
                health: { vaccinated: true, neutered: true, microchipped: true }
            },
            {
                name: 'Luna',
                species: 'Cat',
                breed: 'Persian',
                age: { value: 1, unit: 'years' },
                gender: 'Female',
                price: 650,
                status: 'Available',
                description: 'Beautiful white Persian cat with blue eyes.',
                color: 'White',
                weight: 4,
                health: { vaccinated: true, neutered: false, microchipped: true }
            },
            {
                name: 'Charlie',
                species: 'Dog',
                breed: 'French Bulldog',
                age: { value: 8, unit: 'months' },
                gender: 'Male',
                price: 1200,
                status: 'Available',
                description: 'Adorable Frenchie with a playful personality.',
                color: 'Brindle',
                weight: 10,
                health: { vaccinated: true, neutered: false, microchipped: false }
            },
            {
                name: 'Bella',
                species: 'Cat',
                breed: 'Siamese',
                age: { value: 3, unit: 'years' },
                gender: 'Female',
                price: 550,
                status: 'Available',
                description: 'Elegant Siamese with striking blue eyes.',
                color: 'Seal Point',
                weight: 3.5,
                health: { vaccinated: true, neutered: true, microchipped: true }
            },
            {
                name: 'Tweety',
                species: 'Bird',
                breed: 'Canary',
                age: { value: 6, unit: 'months' },
                gender: 'Male',
                price: 120,
                status: 'Available',
                description: 'Beautiful yellow canary with a melodious song.',
                color: 'Yellow',
                health: { vaccinated: false, neutered: false, microchipped: false }
            },
            {
                name: 'Nemo',
                species: 'Fish',
                breed: 'Clownfish',
                age: { value: 4, unit: 'months' },
                gender: 'Male',
                price: 45,
                status: 'Available',
                description: 'Vibrant orange clownfish, perfect for saltwater tanks.',
                color: 'Orange/White',
                health: { vaccinated: false, neutered: false, microchipped: false }
            },
            {
                name: 'Coco',
                species: 'Rabbit',
                breed: 'Holland Lop',
                age: { value: 5, unit: 'months' },
                gender: 'Female',
                price: 180,
                status: 'Available',
                description: 'Fluffy Holland Lop with floppy ears.',
                color: 'Brown/White',
                weight: 1.5,
                health: { vaccinated: true, neutered: false, microchipped: false }
            },
            {
                name: 'Rocky',
                species: 'Dog',
                breed: 'German Shepherd',
                age: { value: 1, unit: 'years' },
                gender: 'Male',
                price: 950,
                status: 'Available',
                description: 'Intelligent and loyal German Shepherd.',
                color: 'Black/Tan',
                weight: 35,
                health: { vaccinated: true, neutered: true, microchipped: true }
            }
        ]);

        console.log('Created pets');

        // Create customers
        const customers = await Customer.insertMany([
            {
                name: 'John Smith',
                email: 'john.smith@email.com',
                phone: '(555) 123-4567',
                address: {
                    street: '123 Main St',
                    city: 'New York',
                    state: 'NY',
                    zipCode: '10001'
                }
            },
            {
                name: 'Sarah Johnson',
                email: 'sarah.j@email.com',
                phone: '(555) 234-5678',
                address: {
                    street: '456 Oak Ave',
                    city: 'Los Angeles',
                    state: 'CA',
                    zipCode: '90001'
                }
            },
            {
                name: 'Mike Wilson',
                email: 'mike.wilson@email.com',
                phone: '(555) 345-6789',
                address: {
                    street: '789 Pine Rd',
                    city: 'Chicago',
                    state: 'IL',
                    zipCode: '60601'
                }
            }
        ]);

        console.log('Created customers');

        // Create sample orders
        const soldPet1 = await Pet.create({
            name: 'Buddy',
            species: 'Dog',
            breed: 'Labrador',
            age: { value: 1, unit: 'years' },
            gender: 'Male',
            price: 750,
            status: 'Sold',
            color: 'Black',
            health: { vaccinated: true, neutered: true, microchipped: true }
        });

        await Order.create({
            customer: customers[0]._id,
            items: [{
                pet: soldPet1._id,
                petName: soldPet1.name,
                petSpecies: soldPet1.species,
                price: soldPet1.price
            }],
            subtotal: 750,
            tax: 60,
            totalAmount: 810,
            paymentMethod: 'Credit Card',
            paymentStatus: 'Paid',
            status: 'Completed',
            processedBy: admin._id
        });

        // Update customer stats
        await Customer.findByIdAndUpdate(customers[0]._id, {
            totalPurchases: 1,
            totalSpent: 810
        });

        console.log('Created sample orders');
        console.log('\n✅ Seed data created successfully!');
        console.log('\n📧 Login credentials:');
        console.log('   Admin: admin@petshop.com / admin123');
        console.log('   Staff: staff@petshop.com / staff123');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
