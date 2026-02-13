import Subscriber from '../models/Subscriber.js';
import { asyncHandler } from '../middleware/error.js';

// @desc    Subscribe to newsletter
// @route   POST /api/subscribers
// @access  Public
export const subscribe = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({
            success: false,
            message: 'Please provide an email address'
        });
    }

    // Check if already subscribed
    const existingSubscriber = await Subscriber.findOne({ email });

    if (existingSubscriber) {
        return res.status(400).json({
            success: false,
            message: 'Email already subscribed'
        });
    }

    const subscriber = await Subscriber.create({ email });

    res.status(201).json({
        success: true,
        data: subscriber,
        message: 'Successfully subscribed to newsletter!'
    });
});

// @desc    Get all subscribers
// @route   GET /api/subscribers
// @access  Private/Admin
export const getSubscribers = asyncHandler(async (req, res) => {
    const subscribers = await Subscriber.find().sort({ createdAt: -1 });

    res.json({
        success: true,
        count: subscribers.length,
        data: subscribers
    });
});
