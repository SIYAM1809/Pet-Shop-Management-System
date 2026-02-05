import Pet from '../models/Pet.js';
import { asyncHandler } from '../middleware/error.js';

// @desc    Get all pets
// @route   GET /api/pets
// @access  Private
export const getPets = asyncHandler(async (req, res) => {
    const { species, status, search, sort, page = 1, limit = 10 } = req.query;

    // Build query
    let query = {};

    if (species) query.species = species;
    if (status) query.status = status;
    if (search) {
        query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { breed: { $regex: search, $options: 'i' } }
        ];
    }

    // Sorting
    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    if (sort === 'price_desc') sortOption = { price: -1 };
    if (sort === 'name') sortOption = { name: 1 };

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Pet.countDocuments(query);

    const pets = await Pet.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(parseInt(limit));

    res.json({
        success: true,
        count: pets.length,
        total,
        pages: Math.ceil(total / limit),
        currentPage: parseInt(page),
        data: pets
    });
});

// @desc    Get single pet
// @route   GET /api/pets/:id
// @access  Private
export const getPet = asyncHandler(async (req, res) => {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
        return res.status(404).json({
            success: false,
            message: 'Pet not found'
        });
    }

    res.json({
        success: true,
        data: pet
    });
});

// @desc    Create new pet
// @route   POST /api/pets
// @access  Private
export const createPet = asyncHandler(async (req, res) => {
    const pet = await Pet.create(req.body);

    res.status(201).json({
        success: true,
        data: pet
    });
});

// @desc    Update pet
// @route   PUT /api/pets/:id
// @access  Private
export const updatePet = asyncHandler(async (req, res) => {
    let pet = await Pet.findById(req.params.id);

    if (!pet) {
        return res.status(404).json({
            success: false,
            message: 'Pet not found'
        });
    }

    pet = await Pet.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.json({
        success: true,
        data: pet
    });
});

// @desc    Delete pet
// @route   DELETE /api/pets/:id
// @access  Private
export const deletePet = asyncHandler(async (req, res) => {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
        return res.status(404).json({
            success: false,
            message: 'Pet not found'
        });
    }

    await pet.deleteOne();

    res.json({
        success: true,
        data: {}
    });
});

// @desc    Get pet statistics
// @route   GET /api/pets/stats
// @access  Private
export const getPetStats = asyncHandler(async (req, res) => {
    const totalPets = await Pet.countDocuments();
    const availablePets = await Pet.countDocuments({ status: 'Available' });
    const soldPets = await Pet.countDocuments({ status: 'Sold' });

    const speciesCount = await Pet.aggregate([
        { $group: { _id: '$species', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
    ]);

    res.json({
        success: true,
        data: {
            total: totalPets,
            available: availablePets,
            sold: soldPets,
            bySpecies: speciesCount
        }
    });
});
