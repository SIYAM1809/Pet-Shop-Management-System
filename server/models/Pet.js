import mongoose from 'mongoose';

const petSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a pet name'],
        trim: true,
        maxlength: [50, 'Name cannot be more than 50 characters']
    },
    species: {
        type: String,
        required: [true, 'Please add a species'],
        enum: ['Dog', 'Cat', 'Bird', 'Fish', 'Rabbit', 'Hamster', 'Reptile', 'Other']
    },
    breed: {
        type: String,
        required: [true, 'Please add a breed'],
        trim: true
    },
    age: {
        value: {
            type: Number,
            required: [true, 'Please add age']
        },
        unit: {
            type: String,
            enum: ['days', 'weeks', 'months', 'years'],
            default: 'months'
        }
    },
    gender: {
        type: String,
        enum: ['Male', 'Female'],
        required: [true, 'Please specify gender']
    },
    price: {
        type: Number,
        required: [true, 'Please add a price']
    },
    status: {
        type: String,
        enum: ['Available', 'Sold', 'Reserved', 'Adopted'],
        default: 'Available'
    },
    description: {
        type: String,
        maxlength: [500, 'Description cannot be more than 500 characters']
    },
    image: {
        type: String,
        default: ''
    },
    health: {
        vaccinated: { type: Boolean, default: false },
        neutered: { type: Boolean, default: false },
        microchipped: { type: Boolean, default: false }
    },
    color: {
        type: String,
        trim: true
    },
    weight: {
        type: Number
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt timestamp before saving
petSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const Pet = mongoose.model('Pet', petSchema);
export default Pet;
