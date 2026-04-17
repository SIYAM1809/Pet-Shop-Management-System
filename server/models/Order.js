import mongoose from 'mongoose';

export const INSIDE_DHAKA = [
    'Uttara', 'Mirpur', 'Dhanmondi', 'Mohammadpur', 'Gulshan',
    'Banani', 'Motijheel', 'Rampura', 'Badda', 'Khilgaon',
    'Bashundhara', 'Wari', 'Lalbagh', 'Jatrabari'
];

const orderSchema = new mongoose.Schema({
    orderNumber: { type: String, unique: true },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: [true, 'Please add a customer']
    },
    items: [{
        pet:      { type: mongoose.Schema.Types.ObjectId, ref: 'Pet' },
        product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        itemName: String,
        itemType: { type: String, enum: ['pet', 'accessory'], default: 'pet' },
        price:    { type: Number, required: true },
        quantity: { type: Number, default: 1 }
    }],
    subtotal:       { type: Number, required: true },
    tax:            { type: Number, default: 0 },
    discount:       { type: Number, default: 0 },
    deliveryCharge: { type: Number, default: 0 },
    totalAmount:    { type: Number, required: true },
    paymentMethod: {
        type: String,
        enum: ['Cash', 'Credit Card', 'Debit Card', 'PayPal', 'Bank Transfer', 'Bkash', 'Nagad', 'Rocket'],
        default: 'Cash'
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Paid', 'Refunded', 'Failed'],
        default: 'Pending'
    },
    status: {
        type: String,
        enum: ['Pending', 'Processing', 'Completed', 'Cancelled'],
        default: 'Pending'
    },
    // ── Home Delivery ───────────────────────────────────────
    deliveryType: {
        type: String,
        enum: ['store_pickup', 'home_delivery'],
        default: 'store_pickup'
    },
    deliveryArea:    { type: String, trim: true },
    deliveryAddress: { type: String, trim: true },
    deliveryPhone:   { type: String, trim: true },
    // ────────────────────────────────────────────────────────
    notes:   { type: String, maxlength: [500, 'Notes cannot exceed 500 characters'] },
    processedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

orderSchema.pre('save', async function (next) {
    if (!this.orderNumber) {
        const date = new Date();
        const yy  = date.getFullYear().toString().slice(-2);
        const mm  = String(date.getMonth() + 1).padStart(2, '0');
        const dd  = String(date.getDate()).padStart(2, '0');
        const rnd = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        this.orderNumber = `ORD-${yy}${mm}${dd}-${rnd}`;
    }
    this.updatedAt = Date.now();
    next();
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
