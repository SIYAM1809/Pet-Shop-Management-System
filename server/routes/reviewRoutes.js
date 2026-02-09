import express from 'express';
import Review from '../models/Review.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get all reviews (Public - Approved only)
// @route   GET /api/reviews
// @access  Public
router.get('/', async (req, res) => {
    try {
        const reviews = await Review.find({ status: 'Approved' }).sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Get all reviews (Admin - All statuses)
// @route   GET /api/reviews/admin/all
// @access  Private/Admin/Staff
router.get('/admin/all', protect, authorize('admin', 'staff'), async (req, res) => {
    try {
        const reviews = await Review.find({}).sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        console.error('Error fetching admin reviews:', error);
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
            image, // This will be the base64 string or URL sent from frontend
            status: 'Pending' // Default to pending
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

// @desc    Update review status
// @route   PUT /api/reviews/:id/status
// @access  Private/Admin/Staff
router.put('/:id/status', protect, authorize('admin', 'staff'), async (req, res) => {
    try {
        const { status } = req.body;
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        review.status = status;
        await review.save();

        res.json(review);
    } catch (error) {
        console.error('Error updating review status:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private/Admin/Staff
router.delete('/:id', protect, authorize('admin', 'staff'), async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        await review.deleteOne();
        res.json({ message: 'Review removed' });
    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

export default router;
