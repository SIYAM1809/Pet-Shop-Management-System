import Order, { INSIDE_DHAKA } from '../models/Order.js';
import Pet from '../models/Pet.js';
import Product from '../models/Product.js';
import Customer from '../models/Customer.js';
import Delivery from '../models/Delivery.js';
import { asyncHandler } from '../middleware/error.js';
import sendEmail from '../utils/sendEmail.js';

// ─────────────────────────────────────────────────────────────────
// Helper: compute delivery charge
// ─────────────────────────────────────────────────────────────────
export const calcDeliveryCharge = (area) => {
    if (!area) return 0;
    return INSIDE_DHAKA.includes(area) ? 70 : 120;
};

// @desc    Get all orders (admin)
// @route   GET /api/orders
// @access  Private
export const getOrders = asyncHandler(async (req, res) => {
    const { status, paymentStatus, search, page = 1, limit = 10 } = req.query;

    let query = {};
    if (status) query.status = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;
    if (search) query.orderNumber = { $regex: search, $options: 'i' };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Order.countDocuments(query);

    const orders = await Order.find(query)
        .populate('customer', 'name email phone')
        .populate('processedBy', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

    res.json({ success: true, count: orders.length, total, pages: Math.ceil(total / limit), currentPage: parseInt(page), data: orders });
});

// @desc    Get single order (admin)
// @route   GET /api/orders/:id
// @access  Private
export const getOrder = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)
        .populate('customer')
        .populate('items.pet')
        .populate('items.product')
        .populate('processedBy', 'name');

    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, data: order });
});

// @desc    Create order (admin — for in-store / walk-in)
// @route   POST /api/orders
// @access  Private (admin)
export const createOrder = asyncHandler(async (req, res) => {
    const { customer, items, paymentMethod, discount = 0, notes } = req.body;

    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
        const pet = await Pet.findById(item.petId);
        if (!pet) return res.status(404).json({ success: false, message: `Pet not found: ${item.petId}` });
        if (pet.status !== 'Available') return res.status(400).json({ success: false, message: `Pet ${pet.name} is not available` });

        subtotal += pet.price;
        orderItems.push({ pet: pet._id, itemName: pet.name, itemType: 'pet', price: pet.price, quantity: 1 });
        pet.status = 'Sold';
        await pet.save();
    }

    const tax = subtotal * 0.08;
    const totalAmount = subtotal + tax - discount;

    const order = await Order.create({
        customer, items: orderItems, subtotal, tax, discount,
        totalAmount, paymentMethod, notes,
        processedBy: req.user.id,
        deliveryType: 'store_pickup'
    });

    const populated = await Order.findById(order._id)
        .populate('customer', 'name email phone')
        .populate('processedBy', 'name');

    res.status(201).json({ success: true, data: populated });
});

// ─────────────────────────────────────────────────────────────────
// @desc    PUBLIC checkout — customer places order with home delivery option
// @route   POST /api/orders/checkout
// @access  Private (customer)
// ─────────────────────────────────────────────────────────────────
export const checkout = asyncHandler(async (req, res) => {
    const {
        customerId,
        items,               // [{ productId, quantity }] — accessories only, no pets
        paymentMethod = 'Cash',
        deliveryType = 'store_pickup',
        deliveryArea,
        deliveryAddress,
        deliveryPhone,
        notes
    } = req.body;

    // Reject home delivery for pets
    if (deliveryType === 'home_delivery') {
        for (const item of items) {
            if (item.petId) {
                return res.status(400).json({
                    success: false,
                    message: 'Home delivery is only available for accessories, not pets.'
                });
            }
        }
        if (!deliveryArea || !deliveryAddress || !deliveryPhone) {
            return res.status(400).json({
                success: false,
                message: 'Delivery area, address and phone are required for home delivery.'
            });
        }
    }

    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
        const product = await Product.findById(item.productId);
        if (!product) return res.status(404).json({ success: false, message: `Product not found: ${item.productId}` });
        if (product.status === 'Out of Stock') return res.status(400).json({ success: false, message: `${product.name} is out of stock` });

        const qty = item.quantity || 1;
        const price = product.salePrice || product.price;
        subtotal += price * qty;
        orderItems.push({
            product: product._id,
            itemName: product.name,
            itemType: 'accessory',
            price,
            quantity: qty
        });
    }

    const deliveryCharge = deliveryType === 'home_delivery' ? calcDeliveryCharge(deliveryArea) : 0;
    const totalAmount = subtotal + deliveryCharge;

    const order = await Order.create({
        customer: customerId,
        items: orderItems,
        subtotal,
        tax: 0,
        discount: 0,
        deliveryCharge,
        totalAmount,
        paymentMethod,
        notes,
        deliveryType,
        deliveryArea: deliveryType === 'home_delivery' ? deliveryArea : undefined,
        deliveryAddress: deliveryType === 'home_delivery' ? deliveryAddress : undefined,
        deliveryPhone: deliveryType === 'home_delivery' ? deliveryPhone : undefined,
        status: 'Processing'
    });

    // Auto-create a Delivery record in the pool if home delivery
    if (deliveryType === 'home_delivery') {
        await Delivery.create({
            order: order._id,
            status: 'Pending',
            deliveryArea,
            deliveryAddress,
            deliveryPhone,
            deliveryCharge
        });
    }

    const populated = await Order.findById(order._id)
        .populate('customer', 'name email phone');

    res.status(201).json({ success: true, data: populated });
});

// @desc    Update order (admin)
// @route   PUT /api/orders/:id
// @access  Private
export const updateOrder = asyncHandler(async (req, res) => {
    let order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    const { status, paymentStatus, notes } = req.body;
    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    if (notes !== undefined) order.notes = notes;

    if (status === 'Completed') {
        const customer = await Customer.findById(order.customer);
        if (customer) {
            customer.totalOrders = (customer.totalOrders || 0) + 1;
            customer.totalSpent = (customer.totalSpent || 0) + order.totalAmount;
            await customer.save();
        }
    }

    await order.save();
    const populated = await Order.findById(order._id)
        .populate('customer', 'name email phone')
        .populate('processedBy', 'name');

    res.json({ success: true, data: populated });
});

// @desc    Delete order (admin)
// @route   DELETE /api/orders/:id
// @access  Private (admin)
export const deleteOrder = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    await order.deleteOne();
    res.json({ success: true, data: {} });
});

// @desc    Order stats (admin)
// @route   GET /api/orders/stats
// @access  Private
export const getOrderStats = asyncHandler(async (req, res) => {
    const [total, pending, processing, completed, cancelled] = await Promise.all([
        Order.countDocuments({}),
        Order.countDocuments({ status: 'Pending' }),
        Order.countDocuments({ status: 'Processing' }),
        Order.countDocuments({ status: 'Completed' }),
        Order.countDocuments({ status: 'Cancelled' })
    ]);

    const revenueResult = await Order.aggregate([
        { $match: { status: 'Completed' } },
        { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    res.json({ success: true, data: { total, pending, processing, completed, cancelled, totalRevenue } });
});

// @desc    Track order by number (public)
// @route   GET /api/orders/track/:orderNumber
// @access  Public
export const trackOrder = asyncHandler(async (req, res) => {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber })
        .select('orderNumber status paymentStatus paymentMethod totalAmount deliveryCharge deliveryType deliveryArea items createdAt updatedAt');

    if (!order) return res.status(404).json({ success: false, message: 'Order not found. Please check the order number.' });

    // Attach delivery info if applicable
    let delivery = null;
    if (order.deliveryType === 'home_delivery') {
        delivery = await Delivery.findOne({ order: order._id })
            .select('status deliveryArea deliveryAddress acceptedAt pickedUpAt deliveredAt')
            .populate('rider', 'name');
    }

    res.json({ success: true, data: { ...order.toObject(), delivery } });
});
