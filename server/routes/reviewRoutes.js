import express from 'express';
import Review from '../models/Review.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * /api/reviews:
 *   get:
 *     summary: Get all approved reviews (public)
 *     tags: [Reviews]
 *     responses:
 *       200:
 *         description: List of approved reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 *   post:
 *     summary: Submit a new review (public)
 *     tags: [Reviews]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, rating, review]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Jane Doe
 *               petName:
 *                 type: string
 *                 example: Max
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               review:
 *                 type: string
 *                 example: Excellent service, very happy with our new pet!
 *               image:
 *                 type: string
 *                 description: Optional base64 image or URL
 *     responses:
 *       201:
 *         description: Review submitted (pending approval)
 */
// @desc    Get all reviews (Public - Approved only)
router.get('/', async (req, res) => {
    try {
        const reviews = await Review.find({ status: 'Approved' }).sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

/**
 * @swagger
 * /api/reviews/admin/all:
 *   get:
 *     summary: Get all reviews with any status (Admin/Staff)
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All reviews including pending and rejected
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 */
// @desc    Get all reviews (Admin - All statuses)
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
router.post('/', async (req, res) => {
    try {
        const { name, petName, rating, review, image } = req.body;

        const newReview = await Review.create({
            name,
            petName,
            rating,
            review,
            image,
            status: 'Pending'
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

/**
 * @swagger
 * /api/reviews/{id}/status:
 *   put:
 *     summary: Approve or reject a review (Admin/Staff)
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Approved, Rejected, Pending]
 *                 example: Approved
 *     responses:
 *       200:
 *         description: Review status updated
 *       404:
 *         description: Review not found
 */
// @desc    Update review status
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

/**
 * @swagger
 * /api/reviews/{id}:
 *   delete:
 *     summary: Delete a review (Admin/Staff)
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review deleted
 *       404:
 *         description: Review not found
 */
// @desc    Delete review
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
