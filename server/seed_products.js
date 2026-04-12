import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import Product from './models/Product.js';

const products = [
    {
        name: 'Royal Canin Adult Dog Food (2kg)',
        animalCategory: 'Dog',
        productType: 'Food & Treats',
        brand: 'Royal Canin',
        description: 'Complete nutritional food for adult dogs. Tailored for everyday vitality with high-quality proteins and essential minerals. Supports healthy digestion and immune function.',
        price: 45.99,
        salePrice: null,
        stock: 50,
        images: ['/images/accessories/dog_food.png'],
        tags: ['premium', 'nutrition', 'adult'],
        status: 'Active',
        featured: true
    },
    {
        name: 'Interactive Rope Toy Set (3-Pack)',
        animalCategory: 'Dog',
        productType: 'Toys',
        brand: 'PetPlay',
        description: 'Durable braided rope toy set perfect for fetch, tug-of-war and chewing. Helps clean teeth and massage gums. Suitable for medium to large dogs.',
        price: 12.99,
        salePrice: 9.99,
        stock: 120,
        images: ['/images/accessories/dog_toy.png'],
        tags: ['toys', 'chew', 'interactive'],
        status: 'Active',
        featured: false
    },
    {
        name: 'Adjustable Dog Harness (No-Pull)',
        animalCategory: 'Dog',
        productType: 'Collars & Harnesses',
        brand: 'PawSafe',
        description: 'Ergonomic no-pull harness with padded chest plate and reflective stitching for nighttime safety. Fully adjustable for a perfect, comfortable fit on any dog size.',
        price: 28.50,
        salePrice: null,
        stock: 35,
        images: ['/images/accessories/dog_harness.png'],
        tags: ['harness', 'no-pull', 'reflective', 'safety'],
        status: 'Active',
        featured: true
    },
    {
        name: 'Dog Training Clicker Kit',
        animalCategory: 'Dog',
        productType: 'Training',
        brand: 'TrainRight',
        description: 'Complete training kit includes a clicker, 30-page guide booklet, and a treat pouch. Positive reinforcement system for teaching basic commands to dogs of any age.',
        price: 6.99,
        salePrice: null,
        stock: 80,
        images: ['/images/accessories/dog_toy.png'],
        tags: ['training', 'clicker', 'beginner'],
        status: 'Active',
        featured: false
    },
    {
        name: 'Whiskas Temptations Cat Treats',
        animalCategory: 'Cat',
        productType: 'Food & Treats',
        brand: 'Whiskas',
        description: 'Irresistibly crunchy on the outside and soft on the inside. Made with real chicken. Less than 2 calories per treat — a guilt-free reward your cat will go crazy for.',
        price: 8.99,
        salePrice: 6.99,
        stock: 200,
        images: ['/images/accessories/dog_food.png'],
        tags: ['treats', 'chicken', 'low-calorie'],
        status: 'Active',
        featured: false
    },
    {
        name: 'Self-Cleaning Slicker Brush',
        animalCategory: 'Cat',
        productType: 'Grooming',
        brand: 'GroomPro',
        description: 'One-click cleaning button releases trapped fur instantly. Fine stainless steel pins detangle and smooth coats without scratching skin. Works for both cats and small dogs.',
        price: 18.99,
        salePrice: null,
        stock: 60,
        images: ['/images/accessories/cat_brush.png'],
        tags: ['grooming', 'brush', 'self-cleaning'],
        status: 'Active',
        featured: true
    },
    {
        name: 'Cat Tunnel Play & Hide Set',
        animalCategory: 'Cat',
        productType: 'Toys',
        brand: 'FelineFun',
        description: 'Three-section collapsible tunnel with crinkle walls and a dangling feather toy inside. Provides exercise, play, and a cozy hiding spot. Folds flat for easy storage.',
        price: 22.00,
        salePrice: null,
        stock: 45,
        images: ['/images/accessories/dog_toy.png'],
        tags: ['toys', 'tunnel', 'exercise'],
        status: 'Active',
        featured: false
    },
    {
        name: 'Cozy Cave Cat Bed',
        animalCategory: 'Cat',
        productType: 'Beds & Housing',
        brand: 'DreamPet',
        description: 'Fully enclosed hooded bed with ultra-soft plush interior. Provides warmth, security and comfort. Machine washable cover. Non-slip base. Ideal for cats who love to burrow.',
        price: 34.99,
        salePrice: 27.99,
        stock: 25,
        images: ['/images/accessories/cat_bed.png'],
        tags: ['bed', 'cozy', 'cave', 'washable'],
        status: 'Active',
        featured: false
    },
    {
        name: 'Adjustable Cat Collar with Bell',
        animalCategory: 'Cat',
        productType: 'Collars & Harnesses',
        brand: 'PetStyle',
        description: 'Soft breakaway safety collar with quick-release buckle. Adjustable from 18–30cm. Includes a small bell and ID tag loop. Available in multiple colors.',
        price: 7.50,
        salePrice: null,
        stock: 150,
        images: ['/images/accessories/dog_harness.png'],
        tags: ['collar', 'safety', 'bell', 'breakaway'],
        status: 'Active',
        featured: false
    },
    {
        name: 'Budgie & Parakeet Seed Mix (1kg)',
        animalCategory: 'Bird',
        productType: 'Food & Treats',
        brand: 'AviGold',
        description: 'Premium blend of millet, canary grass seed, red millet and oats. Specially balanced for budgerigars and parakeets. Free from artificial preservatives and colourants.',
        price: 9.50,
        salePrice: null,
        stock: 90,
        images: ['/images/accessories/dog_food.png'],
        tags: ['birdfood', 'millet', 'natural'],
        status: 'Active',
        featured: false
    },
    {
        name: 'Bird Swing & Perch Activity Set',
        animalCategory: 'Bird',
        productType: 'Toys',
        brand: 'WingPlay',
        description: 'Set of 5 cage accessories including a wooden swing, two perches of different widths, a mirror and a bell toy. Promotes exercise and mental stimulation.',
        price: 15.99,
        salePrice: 11.99,
        stock: 70,
        images: ['/images/accessories/dog_toy.png'],
        tags: ['perch', 'swing', 'cage', 'activity'],
        status: 'Active',
        featured: true
    },
    {
        name: 'Aquarium Starter Kit (20L)',
        animalCategory: 'Fish',
        productType: 'Beds & Housing',
        brand: 'AquaWorld',
        description: 'Complete 20-litre glass tank with LED lighting, quiet internal filter, a thermometer, fish net and water conditioner sachet. Perfect starter setup for tropical fish.',
        price: 79.99,
        salePrice: null,
        stock: 15,
        images: ['/images/accessories/cat_bed.png'], // Using the cozy housing/bed icon
        tags: ['aquarium', 'tank', 'starter', 'tropical'],
        status: 'Active',
        featured: true
    },
    {
        name: 'Rabbit Premium Pellet Feed (1.5kg)',
        animalCategory: 'Rabbit',
        productType: 'Food & Treats',
        brand: 'BunnyBest',
        description: 'High-fibre balanced pellet formula fortified with vitamins A, D and E. Supports healthy digestion, dental wear and coat quality. Suitable for rabbits 6 weeks and older.',
        price: 11.00,
        salePrice: null,
        stock: 40,
        images: ['/images/accessories/dog_food.png'],
        tags: ['rabbit', 'pellets', 'high-fibre'],
        status: 'Active',
        featured: false
    },
    {
        name: 'Pet Travel Carrier Bag (Airline Approved)',
        animalCategory: 'All Pets',
        productType: 'Travel',
        brand: 'TravelPaws',
        description: 'Soft-sided carrier with mesh windows for ventilation, a fleece-lined base, and multiple zippered compartments. Fits under most aircraft seats. Up to 6kg pets.',
        price: 42.00,
        salePrice: 35.00,
        stock: 20,
        images: ['/images/accessories/cat_bed.png'],
        tags: ['travel', 'airline', 'carrier', 'soft'],
        status: 'Active',
        featured: true
    },
    {
        name: "Vet's Formula Flea & Tick Spray",
        animalCategory: 'All Pets',
        productType: 'Health & Wellness',
        brand: "Vet's Best",
        description: 'Plant-based formula using certified natural oils — peppermint and eugenol. Safe for cats and dogs 12 weeks+. Kills fleas on contact and repels ticks for up to 1 week.',
        price: 19.99,
        salePrice: null,
        stock: 55,
        images: ['/images/accessories/cat_brush.png'],
        tags: ['flea', 'tick', 'natural', 'vet-approved'],
        status: 'Active',
        featured: false
    }
];

const seedProducts = async () => {
    try {
        await connectDB();
        console.log('🔗 Connected to MongoDB');

        const existing = await Product.countDocuments();
        if (existing > 0) {
            console.log(`ℹ️  Found ${existing} existing products. Clearing and re-seeding...`);
            await Product.deleteMany({});
        }

        const inserted = await Product.insertMany(products);
        console.log(`✅ Successfully seeded ${inserted.length} products with locally generated real accessory images!`);

        // Summary
        const featured = inserted.filter(p => p.featured).length;
        const onSale = inserted.filter(p => p.salePrice).length;
        console.log(`   ⭐ Featured: ${featured}`);
        console.log(`   🏷️  On Sale: ${onSale}`);
        console.log(`   🐕 Dog products: ${inserted.filter(p => p.animalCategory === 'Dog').length}`);
        console.log(`   🐈 Cat products: ${inserted.filter(p => p.animalCategory === 'Cat').length}`);
        console.log(`   🦜 Bird products: ${inserted.filter(p => p.animalCategory === 'Bird').length}`);
        console.log(`   🐠 Fish products: ${inserted.filter(p => p.animalCategory === 'Fish').length}`);
        console.log(`   🐇 Rabbit products: ${inserted.filter(p => p.animalCategory === 'Rabbit').length}`);
        console.log(`   🐾 All Pets products: ${inserted.filter(p => p.animalCategory === 'All Pets').length}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error.message);
        process.exit(1);
    }
};

seedProducts();
