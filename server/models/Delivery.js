import mongoose from 'mongoose';

/**
 * Delivery model — tracks the lifecycle of a home delivery.
 *
 * Status lifecycle:
 *   Pending  →  Accepted  →  Picked Up  →  In Transit  →  Delivered
 *                   ↓                                         ↑
 *                Failed  → → → → → → → → → → → → → → →  (terminal)
 *
 * - 'Pending'   : Order placed with home_delivery, no rider yet
 * - 'Accepted'  : A rider self-assigned (locked)
 * - 'Picked Up' : Rider confirmed pickup from shop
 * - 'In Transit': Package on the way
 * - 'Delivered' : Customer received it
 * - 'Failed'    : Could not deliver (wrong address, customer absent, etc.)
 */
const deliverySchema = new mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: [true, 'Please provide an order'],
        unique: true         // One delivery per order
    },
    rider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
        // Optional — null until a rider accepts
    },
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Picked Up', 'In Transit', 'Delivered', 'Failed'],
        default: 'Pending'
    },
    // Denormalised from Order for fast area filtering
    deliveryArea:    { type: String, trim: true },
    deliveryAddress: { type: String, trim: true },
    deliveryPhone:   { type: String, trim: true },
    deliveryCharge:  { type: Number, default: 0 },

    notes: { type: String, maxlength: [500, 'Notes cannot exceed 500 characters'], trim: true },

    // Timestamps per status change
    acceptedAt:  { type: Date },
    pickedUpAt:  { type: Date },
    deliveredAt: { type: Date },
    createdAt:   { type: Date, default: Date.now },
    updatedAt:   { type: Date, default: Date.now }
});

deliverySchema.pre('save', function (next) {
    this.updatedAt = Date.now();

    if (this.isModified('status')) {
        if (this.status === 'Accepted'   && !this.acceptedAt)  this.acceptedAt  = Date.now();
        if (this.status === 'Picked Up'  && !this.pickedUpAt)  this.pickedUpAt  = Date.now();
        if (this.status === 'Delivered'  && !this.deliveredAt) this.deliveredAt = Date.now();
    }
    next();
});

const Delivery = mongoose.model('Delivery', deliverySchema);
export default Delivery;
