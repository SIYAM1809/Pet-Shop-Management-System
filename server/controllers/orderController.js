import Order from '../models/Order.js';
import Pet from '../models/Pet.js';
import Customer from '../models/Customer.js';
import { asyncHandler } from '../middleware/error.js';

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private
export const getOrders = asyncHandler(async (req, res) => {
    const { status, paymentStatus, search, page = 1, limit = 10 } = req.query;

    let query = {};

    if (status) query.status = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;
    if (search) {
        query.orderNumber = { $regex: search, $options: 'i' };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Order.countDocuments(query);

    const orders = await Order.find(query)
        .populate('customer', 'name email phone')
        .populate('processedBy', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

    res.json({
        success: true,
        count: orders.length,
        total,
        pages: Math.ceil(total / limit),
        currentPage: parseInt(page),
        data: orders
    });
});

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
export const getOrder = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)
        .populate('customer')
        .populate('items.pet')
        .populate('processedBy', 'name');

    if (!order) {
        return res.status(404).json({
            success: false,
            message: 'Order not found'
        });
    }

    res.json({
        success: true,
        data: order
    });
});

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = asyncHandler(async (req, res) => {
    const { customer, items, paymentMethod, discount = 0, notes } = req.body;

    // Calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
        const pet = await Pet.findById(item.petId);
        if (!pet) {
            return res.status(404).json({
                success: false,
                message: `Pet not found: ${item.petId}`
            });
        }
        if (pet.status !== 'Available') {
            return res.status(400).json({
                success: false,
                message: `Pet ${pet.name} is not available`
            });
        }

        subtotal += pet.price;
        orderItems.push({
            pet: pet._id,
            petName: pet.name,
            petSpecies: pet.species,
            price: pet.price
        });

        // Update pet status
        pet.status = 'Sold';
        await pet.save();
    }

    const tax = subtotal * 0.08; // 8% tax
    const totalAmount = subtotal + tax - discount;

    const order = await Order.create({
        customer,
        items: orderItems,
        subtotal,
        tax,
        discount,
        totalAmount,
        paymentMethod,
        notes,
        processedBy: req.user.id
    });

    // NOTE: We do NOT update customer stats here anymore.
    // Stats are updated only when order status becomes 'Completed'.

    const populatedOrder = await Order.findById(order._id)
        .populate('customer', 'name email phone')
        .populate('processedBy', 'name');

    res.status(201).json({
        success: true,
        data: populatedOrder
    });
});

// @desc    Update order status
// @route   PUT /api/orders/:id
// @access  Private
export const updateOrder = asyncHandler(async (req, res) => {
    let order = await Order.findById(req.params.id);

    if (!order) {
        return res.status(404).json({
            success: false,
            message: 'Order not found'
        });
    }

    const previousStatus = order.status;

    // Only allow status and payment status updates
    const { status, paymentStatus, notes } = req.body;
    const updateFields = {};
    if (status) updateFields.status = status;
    if (paymentStatus) updateFields.paymentStatus = paymentStatus;
    if (notes !== undefined) updateFields.notes = notes;

    order = await Order.findByIdAndUpdate(req.params.id, updateFields, {
        new: true,
        runValidators: true
    })
        .populate('customer', 'name email phone')
        .populate('processedBy', 'name');

    // Handle Customer Stats Update
    // 1. If becoming Completed (from non-Completed) -> INCREASE stats
    if (status === 'Completed' && previousStatus !== 'Completed') {
        await Customer.findByIdAndUpdate(order.customer._id, {
            $inc: { totalPurchases: 1, totalSpent: order.totalAmount }
        });
    }
    // 2. If becoming non-Completed (from Completed) -> DECREASE stats
    else if (previousStatus === 'Completed' && status && status !== 'Completed') {
        await Customer.findByIdAndUpdate(order.customer._id, {
            $inc: { totalPurchases: -1, totalSpent: -order.totalAmount }
        });
    }

    res.json({
        success: true,
        data: order
    });
});

// @desc    Delete order (cancel)
// @route   DELETE /api/orders/:id
// @access  Private (Admin only)
export const deleteOrder = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return res.status(404).json({
            success: false,
            message: 'Order not found'
        });
    }

    // Restore pet availability if order is cancelled
    for (const item of order.items) {
        await Pet.findByIdAndUpdate(item.pet, { status: 'Available' });
    }

    // Update customer stats ONLY if the order was previously Completed
    if (order.status === 'Completed') {
        await Customer.findByIdAndUpdate(order.customer, {
            $inc: { totalPurchases: -1, totalSpent: -order.totalAmount }
        });
    }

    await order.deleteOne();

    res.json({
        success: true,
        data: {}
    });
});

// @desc    Get order statistics
// @route   GET /api/orders/stats
// @access  Private
export const getOrderStats = asyncHandler(async (req, res) => {
    const totalOrders = await Order.countDocuments();
    const completedOrders = await Order.countDocuments({ status: 'Completed' });
    const pendingOrders = await Order.countDocuments({ status: 'Pending' });

    const revenueResult = await Order.aggregate([
        { $match: { status: 'Completed' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    const revenue = revenueResult[0]?.total || 0;

    // Monthly revenue for chart
    const monthlyRevenue = await Order.aggregate([
        { $match: { status: 'Completed' } },
        {
            $group: {
                _id: {
                    year: { $year: '$createdAt' },
                    month: { $month: '$createdAt' }
                },
                revenue: { $sum: '$totalAmount' },
                orders: { $sum: 1 }
            }
        },
        { $sort: { '_id.year': -1, '_id.month': -1 } },
        { $limit: 12 }
    ]);

    res.json({
        success: true,
        data: {
            totalOrders,
            completedOrders,
            pendingOrders,
            revenue,
            monthlyRevenue: monthlyRevenue.reverse()
        }
    });
});
