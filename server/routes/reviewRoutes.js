import express from 'express';
import Review from '../models/Review.js';

const router = express.Router();

// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Public
router.get('/', async (req, res) => {
    try {
        // Only fetch approved reviews (or all if you want to moderate later)
        // Sort by newest first
        const reviews = await Review.find({ status: 'Approved' }).sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Create a review
// @route   POST /api/reviews
// @access  Public
router.post('/', async (req, res) => {
    try {
        const { name, petName, rating, review, image } = req.body;

        const newReview = await Review.create({
            name,
            petName,
            rating,
            review,
            image // This will be the base64 string or URL sent from frontend
        });

        res.status(201).json(newReview);
    } catch (error) {
        console.error('Error creating review:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: 'Server Error' });
    }
});

export default router;
