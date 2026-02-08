import Order from '../models/Order.js';
import Customer from '../models/Customer.js';
import Pet from '../models/Pet.js';
import { asyncHandler } from '../middleware/error.js';
import sendEmail from '../utils/sendEmail.js';

// @desc    Submit a new inquiry (creates Customer + Order)
// @route   POST /api/inquiries
// @access  Public
export const createInquiry = asyncHandler(async (req, res) => {
    const { name, email, phone, message, petId, paymentMethod, street, city, state, zipCode, type, date, time, purpose, notes } = req.body;

    // === HANDLE APPOINTMENT ===
    if (type === 'Appointment') {
        if (!name || !email || !phone || !date || !time) {
            return res.status(400).json({
                success: false,
                message: 'Please provide name, email, phone, date, and time'
            });
        }

        // Find or Create Customer
        let customer = await Customer.findOne({ email: email.toLowerCase() });
        if (customer) {
            if (!customer.phone) {
                customer.phone = phone;
                await customer.save();
            }
        } else {
            customer = await Customer.create({
                name,
                email: email.toLowerCase(),
                phone,
                notes: 'Created via Appointment Booking'
            });
        }

        // Send Confirmation Email
        try {
            await sendEmail({
                email: customer.email,
                subject: 'Appointment Confirmed - Siyam\'s Praniseba',
                html: `
                    <h1>Appointment Confirmed!</h1>
                    <p>Hi ${customer.name},</p>
                    <p>We are excited to see you at our store.</p>
                    <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <p><strong>Date:</strong> ${date}</p>
                        <p><strong>Time:</strong> ${time}</p>
                        <p><strong>Purpose:</strong> ${purpose || 'General Visit'}</p>
                        <p><strong>Address:</strong> Prembagan, kosaibari, Uttrar, Dhaka-1230</p>
                    </div>
                    <p>If you need to reschedule, please call us at 01304054566.</p>
                    <br>
                    <p>Regards,<br>Siyam's Praniseba Team</p>
                `
            });
        } catch (err) {
            console.error('Appointment email failed:', err);
        }

        return res.status(201).json({
            success: true,
            message: 'Appointment request sent successfully!'
        });
    }

    // === EXISTING PET INQUIRY ===
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

    const addressData = {
        street: street || '',
        city: city || '',
        state: state || '',
        zipCode: zipCode || '',
        country: 'USA'
    };

    if (customer) {
        // Update phone/name if provided (optional, strategy: keep existing or update?)
        // For now, let's just use the existing customer record but maybe update phone if missing
        let updated = false;
        if (!customer.phone) {
            customer.phone = phone;
            updated = true;
        }
        // Update address if provided and currently empty
        if (street || city) {
            customer.address = { ...customer.address, ...addressData };
            updated = true;
        }

        if (updated) await customer.save();
    } else {
        customer = await Customer.create({
            name,
            email: email.toLowerCase(),
            phone,
            address: addressData,
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

    // 6. Send Email Confirmation
    try {
        await sendEmail({
            email: customer.email,
            subject: 'Order Received - Siyam\'s Praniseba',
            html: `
                <h1>Thank you for your Order!</h1>
                <p>Hi ${customer.name},</p>
                <p>We have received your order for <strong>${pet.name}</strong> (${pet.species}).</p>
                <p><strong>Order ID:</strong> ${order.orderNumber}</p>
                <p>We will contact you shortly at ${customer.phone} to confirm details.</p>
                <br>
                <p>Regards,<br>Siyam's Praniseba Team</p>
            `
        });
    } catch (err) {
        console.error('Email send failed:', err);
        // Do not fail the request if email fails
    }

    res.status(201).json({
        success: true,
        message: 'Inquiry received successfully!',
        data: {
            orderId: order._id,
            orderNumber: order.orderNumber
        }
    });
});
