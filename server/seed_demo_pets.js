import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Pet from './models/Pet.js';

dotenv.config();

const demoPets = [
    // --- DOGS ---
    {
        name: 'Bella',
        species: 'Dog',
        breed: 'Golden Retriever',
        age: { value: 2, unit: 'years' },
        gender: 'Female',
        price: 1200,
        status: 'Available',
        description: 'A loving and gentle Golden Retriever looking for a forever home. Great with kids!',
        color: 'Golden',
        weight: 28,
        health: { vaccinated: true, neutered: true, microchipped: true },
        image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&auto=format&fit=crop&w=662&q=80'
    },
    {
        name: 'Max',
        species: 'Dog',
        breed: 'German Shepherd',
        age: { value: 3, unit: 'years' },
        gender: 'Male',
        price: 950,
        status: 'Available',
        description: 'Loyal and intelligent German Shepherd. Perfect for active families.',
        color: 'Black & Tan',
        weight: 35,
        health: { vaccinated: true, neutered: true, microchipped: true },
        image: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?ixlib=rb-4.0.3&auto=format&fit=crop&w=651&q=80'
    },
    {
        name: 'Daisy',
        species: 'Dog',
        breed: 'Poodle',
        age: { value: 2, unit: 'years' },
        gender: 'Female',
        price: 1500,
        status: 'Available',
        description: 'Smart and hypoallergenic Poodle. Loves detailed grooming.',
        color: 'White',
        weight: 20,
        health: { vaccinated: true, neutered: true, microchipped: true },
        image: 'https://images.unsplash.com/photo-1616149562385-1d84e79478bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80'
    },
    {
        name: 'Rocky',
        species: 'Dog',
        breed: 'Bulldog',
        age: { value: 4, unit: 'years' },
        gender: 'Male',
        price: 2000,
        status: 'Available',
        description: 'Friendly and calm Bulldog. Loves short walks and naps.',
        color: 'Fawn',
        weight: 45,
        health: { vaccinated: true, neutered: true, microchipped: true },
        image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?ixlib=rb-4.0.3&auto=format&fit=crop&w=735&q=80'
    },
    {
        name: 'Coco',
        species: 'Dog',
        breed: 'Labrador Retriever',
        age: { value: 1, unit: 'years' },
        gender: 'Female',
        price: 800,
        status: 'Available',
        description: 'Energetic and playful Lab. Loves water and fetch.',
        color: 'Chocolate',
        weight: 25,
        health: { vaccinated: true, neutered: true, microchipped: true },
        image: 'https://images.unsplash.com/photo-1591769225440-811ad7d6eca6?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80'
    },

    // --- CATS ---
    {
        name: 'Luna',
        species: 'Cat',
        breed: 'Siamese',
        age: { value: 1, unit: 'years' },
        gender: 'Female',
        price: 450,
        status: 'Available',
        description: 'Vocal and affectionate Siamese cat. Loves attention.',
        color: 'Cream',
        weight: 4,
        health: { vaccinated: true, neutered: true, microchipped: false },
        image: 'https://images.unsplash.com/photo-1513245543132-31f507417b26?ixlib=rb-4.0.3&auto=format&fit=crop&w=735&q=80'
    },
    {
        name: 'Oliver',
        species: 'Cat',
        breed: 'Maine Coon',
        age: { value: 4, unit: 'years' },
        gender: 'Male',
        price: 800,
        status: 'Available',
        description: 'Large, gentle giant. Loves to cuddle and play.',
        color: 'Tabby',
        weight: 8,
        health: { vaccinated: true, neutered: true, microchipped: true },
        image: 'https://images.unsplash.com/photo-1620023428983-4927b2c05001?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80'
    },
    {
        name: 'Milo',
        species: 'Cat',
        breed: 'British Shorthair',
        age: { value: 2, unit: 'years' },
        gender: 'Male',
        price: 900,
        status: 'Available',
        description: 'Calm and easygoing with a dense, plush coat.',
        color: 'Grey',
        weight: 6,
        health: { vaccinated: true, neutered: true, microchipped: true },
        image: 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80'
    },
    {
        name: 'Chloe',
        species: 'Cat',
        breed: 'Ragdoll',
        age: { value: 3, unit: 'years' },
        gender: 'Female',
        price: 1100,
        status: 'Available',
        description: 'Affectionate and docile. Known for going limp when held.',
        color: 'Bicolor',
        weight: 5,
        health: { vaccinated: true, neutered: true, microchipped: true },
        image: 'https://images.unsplash.com/photo-1610301049581-229f3c751d38?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'
    },
    {
        name: 'Simba',
        species: 'Cat',
        breed: 'Bengal',
        age: { value: 1, unit: 'years' },
        gender: 'Male',
        price: 1500,
        status: 'Available',
        description: 'Active and playful. Loves to climb and explore.',
        color: 'Spotted',
        weight: 5.5,
        health: { vaccinated: true, neutered: true, microchipped: true },
        image: 'https://images.unsplash.com/photo-1558550212-32a2295a6393?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'
    },

    // --- BIRDS ---
    {
        name: 'Tweety',
        species: 'Bird',
        breed: 'Parakeet',
        age: { value: 1, unit: 'years' },
        gender: 'Male',
        price: 45,
        status: 'Available',
        description: 'Colorful and cheerful parakeet. Loves to sing.',
        color: 'Blue & White',
        weight: 0.1,
        health: { vaccinated: false, neutered: false, microchipped: false },
        image: 'https://images.unsplash.com/photo-1552728089-57bdde30ebd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80'
    },
    {
        name: 'Rio',
        species: 'Bird',
        breed: 'Macaw',
        age: { value: 5, unit: 'years' },
        gender: 'Female',
        price: 2500,
        status: 'Available',
        description: 'Stunning Blue-and-Gold Macaw. Highly intelligent.',
        color: 'Blue & Gold',
        weight: 1.2,
        health: { vaccinated: true, neutered: false, microchipped: true },
        image: 'https://images.unsplash.com/photo-1452570053594-1b985d6ea218?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'
    },
    {
        name: 'Sunny',
        species: 'Bird',
        breed: 'Cockatiel',
        age: { value: 2, unit: 'years' },
        gender: 'Male',
        price: 150,
        status: 'Available',
        description: 'Friendly and easy to train. Famous for their crests.',
        color: 'Yellow & Grey',
        weight: 0.3,
        health: { vaccinated: false, neutered: false, microchipped: false },
        image: 'https://images.unsplash.com/photo-1616035043864-32b57ac682fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80'
    },
    {
        name: 'Kiwi',
        species: 'Bird',
        breed: 'Lovebird',
        age: { value: 1, unit: 'years' },
        gender: 'Female',
        price: 80,
        status: 'Available',
        description: 'Social and affectionate. Loves being in pairs.',
        color: 'Green',
        weight: 0.15,
        health: { vaccinated: false, neutered: false, microchipped: false },
        image: 'https://images.unsplash.com/photo-1582260273574-8b0933748259?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'
    },

    // --- OTHERS ---
    {
        name: 'Thumper',
        species: 'Rabbit',
        breed: 'Holland Lop',
        age: { value: 6, unit: 'months' },
        gender: 'Male',
        price: 85,
        status: 'Available',
        description: 'Adorable lop-eared rabbit. Very friendly.',
        color: 'Grey',
        weight: 1.5,
        health: { vaccinated: false, neutered: true, microchipped: false },
        image: 'https://images.unsplash.com/photo-1585110396065-88b74a3ea75c?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80'
    },
    {
        name: 'Cotton',
        species: 'Rabbit',
        breed: 'Angora',
        age: { value: 1, unit: 'years' },
        gender: 'Female',
        price: 120,
        status: 'Available',
        description: 'Fluffy Angora rabbit known for its soft wool.',
        color: 'White',
        weight: 2,
        health: { vaccinated: false, neutered: false, microchipped: false },
        image: 'https://images.unsplash.com/photo-1518796745738-41048802f99a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1469&q=80'
    },
    {
        name: 'Goldie',
        species: 'Fish',
        breed: 'Goldfish',
        age: { value: 3, unit: 'months' },
        gender: 'Female',
        price: 15,
        status: 'Available',
        description: 'Classic goldfish. Easy to care for.',
        color: 'Gold',
        weight: 0.05,
        health: { vaccinated: false, neutered: false, microchipped: false },
        image: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?ixlib=rb-4.0.3&auto=format&fit=crop&w=712&q=80'
    },
    {
        name: 'Spike',
        species: 'Reptile',
        breed: 'Bearded Dragon',
        age: { value: 1, unit: 'years' },
        gender: 'Male',
        price: 150,
        status: 'Available',
        description: 'Chill bearded dragon. Loves crickets.',
        color: 'Tan',
        weight: 0.4,
        health: { vaccinated: false, neutered: false, microchipped: false },
        image: 'https://images.unsplash.com/photo-1533758487779-158c5f59069d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1285&q=80'
    },
    {
        name: 'Nibbles',
        species: 'Hamster',
        breed: 'Syrian Hamster',
        age: { value: 2, unit: 'months' },
        gender: 'Male',
        price: 25,
        status: 'Available',
        description: 'Cute and active hamster. Great first pet.',
        color: 'Orange',
        weight: 0.1,
        health: { vaccinated: false, neutered: false, microchipped: false },
        image: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80'
    }
];

const seedDemoPets = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Optional: clear existing pets before seeding
        // await Pet.deleteMany({});

        await Pet.insertMany(demoPets);
        console.log('✅ Successfully added ' + demoPets.length + ' new demo pets!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding pets:', error);
        process.exit(1);
    }
};

seedDemoPets();
