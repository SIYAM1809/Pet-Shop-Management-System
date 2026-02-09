import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add your name'],
        trim: true
    },
    petName: {
        type: String,
        required: [true, 'Please add your pet\'s name'],
        trim: true
    },
    rating: {
        type: Number,
        required: [true, 'Please add a rating'],
        min: 1,
        max: 5
    },
    review: {
        type: String,
        required: [true, 'Please add a review'],
        trim: true
    },
    image: {
        type: String, // URL or base64
        default: null
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Approved' // Auto-approve for now to see immediate results as requested
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;
