import mongoose from 'mongoose';

const ANIMAL_CATEGORIES = ['Dog', 'Cat', 'Bird', 'Fish', 'Rabbit', 'Small Animal', 'Reptile', 'All Pets'];
const PRODUCT_TYPES = [
    'Food & Treats', 'Grooming', 'Toys', 'Beds & Housing',
    'Collars & Harnesses', 'Health & Wellness', 'Clothing', 'Travel', 'Training', 'Other'
];

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a product name'],
        trim: true,
        maxlength: [100, 'Name cannot be more than 100 characters']
    },
    animalCategory: {
        type: String,
        required: [true, 'Please select an animal category'],
        enum: ANIMAL_CATEGORIES
    },
    productType: {
        type: String,
        required: [true, 'Please select a product type'],
        enum: PRODUCT_TYPES
    },
    brand: {
        type: String,
        trim: true,
        default: ''
    },
    description: {
        type: String,
        maxlength: [1000, 'Description cannot be more than 1000 characters'],
        default: ''
    },
    price: {
        type: Number,
        required: [true, 'Please add a price'],
        min: [0, 'Price cannot be negative']
    },
    salePrice: {
        type: Number,
        default: null,
        min: [0, 'Sale price cannot be negative']
    },
    stock: {
        type: Number,
        required: true,
        default: 0,
        min: [0, 'Stock cannot be negative']
    },
    // Multiple images: first one is the primary/thumbnail
    images: {
        type: [String],
        default: []
    },
    tags: {
        type: [String],
        default: []
    },
    status: {
        type: String,
        enum: ['Active', 'Out of Stock', 'Discontinued'],
        default: 'Active'
    },
    featured: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Auto-update status based on stock
productSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    if (this.stock === 0 && this.status === 'Active') {
        this.status = 'Out of Stock';
    }
    if (this.stock > 0 && this.status === 'Out of Stock') {
        this.status = 'Active';
    }
    next();
});

// Virtual: effective price (sale price if set)
productSchema.virtual('effectivePrice').get(function () {
    return this.salePrice && this.salePrice < this.price ? this.salePrice : this.price;
});

// Virtual: is on sale
productSchema.virtual('onSale').get(function () {
    return !!(this.salePrice && this.salePrice < this.price);
});

// Static export of valid values for controllers/frontend
productSchema.statics.ANIMAL_CATEGORIES = ANIMAL_CATEGORIES;
productSchema.statics.PRODUCT_TYPES = PRODUCT_TYPES;

const Product = mongoose.model('Product', productSchema);
export default Product;
