import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Pet from '../models/Pet.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Configure dotenv to read from server/.env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const newPets = [
    // --- DOGS ---
    {
        name: 'Shadow',
        species: 'Dog',
        breed: 'Siberian Husky',
        age: { value: 2, unit: 'years' },
        gender: 'Male',
        price: 1100,
        status: 'Available',
        description: 'Energetic and vocal Husky. Loves cold weather and running.',
        color: 'Black & White',
        weight: 27,
        health: { vaccinated: true, neutered: true, microchipped: true },
        image: 'https://images.unsplash.com/photo-1547407139-4c925d97437c?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80'
    },
    {
        name: 'Spot',
        species: 'Dog',
        breed: 'Dalmatian',
        age: { value: 1, unit: 'years' },
        gender: 'Male',
        price: 1300,
        status: 'Available',
        description: 'Active and friendly Dalmatian. Distinctive spots and high energy.',
        color: 'White & Black',
        weight: 25,
        health: { vaccinated: true, neutered: true, microchipped: true },
        image: 'https://images.unsplash.com/photo-1554693192-3c35b81467bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80'
    },

    // --- CATS ---
    {
        name: 'Yoda',
        species: 'Cat',
        breed: 'Sphynx',
        age: { value: 3, unit: 'years' },
        gender: 'Male',
        price: 1800,
        status: 'Available',
        description: 'Unique hairless cat. Very warm and affectionate companion.',
        color: 'Pink',
        weight: 4,
        health: { vaccinated: true, neutered: true, microchipped: true },
        image: 'https://images.unsplash.com/photo-1606214174585-fe31582dc6ee?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80'
    },

    // --- BIRDS ---
    {
        name: 'Snowball',
        species: 'Bird',
        breed: 'Cockatoo',
        age: { value: 10, unit: 'years' },
        gender: 'Female',
        price: 2200,
        status: 'Available',
        description: 'Very intelligent and affectionate Cockatoo. Requires a lot of attention.',
        color: 'White',
        weight: 0.8,
        health: { vaccinated: true, neutered: false, microchipped: true },
        image: 'https://images.unsplash.com/photo-1620662763628-863a358c9735?ixlib=rb-4.0.3&auto=format&fit=crop&w=766&q=80'
    },

    // --- RABBITS ---
    {
        name: 'Leo',
        species: 'Rabbit',
        breed: 'Lionhead',
        age: { value: 8, unit: 'months' },
        gender: 'Male',
        price: 95,
        status: 'Available',
        description: 'Fluffy mane around the head. Gentle temperament.',
        color: 'Tan',
        weight: 1.6,
        health: { vaccinated: false, neutered: true, microchipped: false },
        image: 'https://images.unsplash.com/photo-1591382386627-e49c7192994d?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80'
    },

    // --- FISH ---
    {
        name: 'Flash',
        species: 'Fish',
        breed: 'Betta',
        age: { value: 4, unit: 'months' },
        gender: 'Male',
        price: 20,
        status: 'Available',
        description: 'Vibrant red Betta fish. Beautiful flowing fins.',
        color: 'Red',
        weight: 0.02,
        health: { vaccinated: false, neutered: false, microchipped: false },
        image: 'https://images.unsplash.com/photo-1534575180408-b7d7c0136ee8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'
    },

    // --- REPTILES ---
    {
        name: 'Pascal',
        species: 'Reptile',
        breed: 'Chameleon',
        age: { value: 1, unit: 'years' },
        gender: 'Male',
        price: 200,
        status: 'Available',
        description: 'Fascinating color-changing reptile. Needs specific humidity.',
        color: 'Green',
        weight: 0.15,
        health: { vaccinated: false, neutered: false, microchipped: false },
        image: 'https://images.unsplash.com/photo-1570326065744-88fdaa1f4c78?ixlib=rb-4.0.3&auto=format&fit=crop&w=735&q=80'
    },
    {
        name: 'Sticky',
        species: 'Reptile',
        breed: 'Leopard Gecko',
        age: { value: 2, unit: 'years' },
        gender: 'Female',
        price: 120,
        status: 'Available',
        description: 'Easy to handle and cute. Distinctive leopard spots.',
        color: 'Yellow & Black',
        weight: 0.08,
        health: { vaccinated: false, neutered: false, microchipped: false },
        image: 'https://images.unsplash.com/photo-1590740669352-841808605dfa?ixlib=rb-4.0.3&auto=format&fit=crop&w=735&q=80'
    },
    {
        name: 'Slinky',
        species: 'Reptile',
        breed: 'Corn Snake',
        age: { value: 2, unit: 'years' },
        gender: 'Male',
        price: 80,
        status: 'Available',
        description: 'Docile and hardy snake. Great for beginners.',
        color: 'Orange & Red',
        weight: 0.3,
        health: { vaccinated: false, neutered: false, microchipped: false },
        image: 'https://images.unsplash.com/photo-1560706739-160de47702aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=735&q=80'
    },
    {
        name: 'Shelly',
        species: 'Reptile',
        breed: 'Red-Eared Slider',
        age: { value: 1, unit: 'years' },
        gender: 'Female',
        price: 40,
        status: 'Available',
        description: 'Aquatic turtle. Loves to bask in the sun.',
        color: 'Green',
        weight: 0.5,
        health: { vaccinated: false, neutered: false, microchipped: false },
        image: 'https://images.unsplash.com/photo-1551699745-f09d4240751e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'
    },

    // --- HAMSTERS ---
    {
        name: 'Pip',
        species: 'Hamster',
        breed: 'Dwarf Hamster',
        age: { value: 3, unit: 'months' },
        gender: 'Female',
        price: 18,
        status: 'Available',
        description: 'Small, fast, and incredibly cute. Needs a secure cage.',
        color: 'Grey',
        weight: 0.05,
        health: { vaccinated: false, neutered: false, microchipped: false },
        image: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?ixlib=rb-4.0.3&auto=format&fit=crop&w=1476&q=80'
    },

    // --- OTHER ---
    {
        name: 'Squeaky',
        species: 'Other',
        breed: 'Guinea Pig',
        age: { value: 5, unit: 'months' },
        gender: 'Male',
        price: 40,
        status: 'Available',
        description: 'Social and vocal. Loves fresh veggies.',
        color: 'Tri-color',
        weight: 0.9,
        health: { vaccinated: false, neutered: false, microchipped: false },
        image: 'https://images.unsplash.com/photo-1533285789178-0243405b583f?ixlib=rb-4.0.3&auto=format&fit=crop&w=764&q=80'
    }
];

const addMorePets = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined in .env file');
        }

        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Check for existing pets to avoid duplicates (optional but good practice)
        for (const pet of newPets) {
            const exists = await Pet.findOne({ name: pet.name, species: pet.species });
            if (!exists) {
                await Pet.create(pet);
                console.log(`Added: ${pet.name} (${pet.species})`);
            } else {
                console.log(`Skipped: ${pet.name} (Already exists)`);
            }
        }

        console.log('✅ process completed!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error adding pets:', error);
        process.exit(1);
    }
};

addMorePets();
