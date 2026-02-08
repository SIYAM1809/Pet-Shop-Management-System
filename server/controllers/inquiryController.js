import Order from '../models/Order.js';
import Customer from '../models/Customer.js';
import Pet from '../models/Pet.js';
import { asyncHandler } from '../middleware/error.js';

// @desc    Submit a new inquiry (creates Customer + Order)
// @route   POST /api/inquiries
// @access  Public
export const createInquiry = asyncHandler(async (req, res) => {
    const { name, email, phone, message, petId } = req.body;

    // 1. Validate Input
    if (!name || !email || !phone || !petId) {
        return res.status(400).json({
            success: false,
            message: 'Please provide name, email, phone, and pet ID'
        });
    }

    // 2. Validate Pet
    const pet = await Pet.findById(petId);
    if (!pet) {
        return res.status(404).json({
            success: false,
            message: 'Pet not found'
        });
    }
    if (pet.status !== 'Available') {
        return res.status(400).json({
            success: false,
            message: 'This pet is no longer available'
        });
    }

    // 3. Find or Create Customer
    let customer = await Customer.findOne({ email: email.toLowerCase() });

    if (customer) {
        // Update phone/name if provided (optional, strategy: keep existing or update?)
        // For now, let's just use the existing customer record but maybe update phone if missing
        if (!customer.phone) {
            customer.phone = phone;
            await customer.save();
        }
    } else {
        customer = await Customer.create({
            name,
            email: email.toLowerCase(),
            phone,
            notes: 'Created via Inquiry' /* Optional initial note */
        });
    }

    // 4. Create Order (Inquiry Lead)
    // We treat this as a "Pending" order with "Pending" payment.
    // Admin will see this in the Orders list.

    const subtotal = pet.price;
    const tax = subtotal * 0.08;
    const totalAmount = subtotal + tax;

    const order = await Order.create({
        customer: customer._id,
        items: [{
            pet: pet._id,
            petName: pet.name,
            petSpecies: pet.species,
            price: pet.price
        }],
        subtotal,
        tax,
        totalAmount,
        paymentMethod: req.body.paymentMethod || 'Cash',
        paymentStatus: 'Pending',
        status: 'Pending',
        notes: message ? `Inquiry Message: ${message}` : 'Web Inquiry',
        // processedBy is left null/undefined for public inquiries
    });

    // 5. Update Customer Stats (Optional: maybe only update on completed orders?)
    // For now, we won't increment totalPurchases until the order is actually completed/paid.

    res.status(201).json({
        success: true,
        message: 'Inquiry received successfully!',
        data: {
            orderId: order._id,
            orderNumber: order.orderNumber
        }
    });
});
