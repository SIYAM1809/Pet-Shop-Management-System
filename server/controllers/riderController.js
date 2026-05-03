import Delivery from '../models/Delivery.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import { asyncHandler } from '../middleware/error.js';

// ─────────────────────────────────────────────────────────────
// RIDER-FACING ENDPOINTS  (role: staff)
// ─────────────────────────────────────────────────────────────

// @desc    Get all deliveries assigned to the logged-in rider
// @route   GET /api/rider/deliveries
// @access  Private (staff)
export const getMyDeliveries = asyncHandler(async (req, res) => {
    const { status, page = 1, limit = 10 } = req.query;

    const query = { rider: req.user.id };
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Delivery.countDocuments(query);

    const deliveries = await Delivery.find(query)
        .populate('order', 'orderNumber totalAmount items status customer createdAt')
        .populate({
            path: 'order',
            populate: { path: 'customer', select: 'name email phone' }
        })
        .sort({ assignedAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

    res.json({
        success: true,
        count: deliveries.length,
        total,
        pages: Math.ceil(total / limit),
        currentPage: parseInt(page),
        data: deliveries
    });
});

// @desc    Update delivery status by rider
// @route   PUT /api/rider/deliveries/:id
// @access  Private (staff)
export const updateDeliveryStatus = asyncHandler(async (req, res) => {
    const { status, notes } = req.body;

    const delivery = await Delivery.findById(req.params.id);

    if (!delivery) {
        return res.status(404).json({ success: false, message: 'Delivery not found' });
    }

    // Ensure the rider can only update their own deliveries
    if (delivery.rider.toString() !== req.user.id) {
        return res.status(403).json({ success: false, message: 'Not authorized to update this delivery' });
    }

    const allowedTransitions = {
        'Assigned':   ['Picked Up', 'Failed'],
        'Picked Up':  ['In Transit', 'Failed'],
        'In Transit': ['Delivered', 'Failed'],
        'Delivered':  [],
        'Failed':     []
    };

    if (!allowedTransitions[delivery.status]?.includes(status)) {
        return res.status(400).json({
            success: false,
            message: `Cannot transition from '${delivery.status}' to '${status}'`
        });
    }

    delivery.status = status;
    if (notes !== undefined) delivery.notes = notes;
    await delivery.save();

    const populated = await Delivery.findById(delivery._id)
        .populate('order', 'orderNumber totalAmount customer')
        .populate({
            path: 'order',
            populate: { path: 'customer', select: 'name email phone' }
        });

    res.json({ success: true, data: populated });
});

// @desc    Get rider dashboard statistics
// @route   GET /api/rider/stats
// @access  Private (staff)
export const getRiderStats = asyncHandler(async (req, res) => {
    const riderId = req.user.id;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [total, assigned, inTransit, deliveredToday, totalDelivered, failed] = await Promise.all([
        Delivery.countDocuments({ rider: riderId }),
        Delivery.countDocuments({ rider: riderId, status: 'Assigned' }),
        Delivery.countDocuments({ rider: riderId, status: { $in: ['Picked Up', 'In Transit'] } }),
        Delivery.countDocuments({ rider: riderId, status: 'Delivered', deliveredAt: { $gte: today } }),
        Delivery.countDocuments({ rider: riderId, status: 'Delivered' }),
        Delivery.countDocuments({ rider: riderId, status: 'Failed' })
    ]);

    // Recent 5 deliveries
    const recent = await Delivery.find({ rider: riderId })
        .populate('order', 'orderNumber totalAmount')
        .populate({
            path: 'order',
            populate: { path: 'customer', select: 'name' }
        })
        .sort({ assignedAt: -1 })
        .limit(5);

    res.json({
        success: true,
        data: {
            stats: { total, assigned, inTransit, deliveredToday, totalDelivered, failed },
            recentDeliveries: recent
        }
    });
});

// ─────────────────────────────────────────────────────────────
// ADMIN-FACING ENDPOINTS  (role: admin)
// ─────────────────────────────────────────────────────────────

// @desc    Get all deliveries (admin view)
// @route   GET /api/rider/admin/deliveries
// @access  Private (admin)
export const getAllDeliveries = asyncHandler(async (req, res) => {
    const { status, riderId, page = 1, limit = 10 } = req.query;

    const query = {};
    if (status) query.status = status;
    if (riderId) query.rider = riderId;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Delivery.countDocuments(query);

    const deliveries = await Delivery.find(query)
        .populate('rider', 'name email')
        .populate('order', 'orderNumber totalAmount customer items createdAt')
        .populate({
            path: 'order',
            populate: { path: 'customer', select: 'name email phone' }
        })
        .sort({ assignedAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

    res.json({
        success: true,
        count: deliveries.length,
        total,
        pages: Math.ceil(total / limit),
        currentPage: parseInt(page),
        data: deliveries
    });
});

// @desc    Assign an order to a rider (create delivery)
// @route   POST /api/rider/admin/assign
// @access  Private (admin)
export const assignDelivery = asyncHandler(async (req, res) => {
    const { orderId, riderId, deliveryAddress, customerPhone, notes } = req.body;

    if (!orderId || !riderId || !deliveryAddress) {
        return res.status(400).json({
            success: false,
            message: 'orderId, riderId and deliveryAddress are required'
        });
    }

    // Verify order exists
    const order = await Order.findById(orderId);
    if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Verify rider exists and is staff
    const rider = await User.findById(riderId);
    if (!rider || rider.role !== 'staff') {
        return res.status(404).json({ success: false, message: 'Rider not found or invalid role' });
    }

    // Prevent duplicate assignment for same order, UNLESS it's a Pending auto-created delivery
    let delivery = await Delivery.findOne({ order: orderId, status: { $nin: ['Failed'] } });
    
    if (delivery) {
        if (delivery.status !== 'Pending') {
            return res.status(400).json({ success: false, message: 'This order is already assigned to a rider or in progress.' });
        }
        // Update existing Pending delivery
        delivery.rider = riderId;
        delivery.status = 'Assigned';
        if (deliveryAddress) delivery.deliveryAddress = deliveryAddress;
        if (customerPhone) delivery.customerPhone = customerPhone;
        if (notes) delivery.notes = notes;
        await delivery.save();
    } else {
        // Create new delivery if one didn't exist
        delivery = await Delivery.create({
            order: orderId,
            rider: riderId,
            deliveryAddress,
            customerPhone,
            notes,
            status: 'Assigned' // manually assigned status
        });
    }

    const populated = await Delivery.findById(delivery._id)
        .populate('rider', 'name email')
        .populate('order', 'orderNumber totalAmount customer')
        .populate({
            path: 'order',
            populate: { path: 'customer', select: 'name email phone' }
        });

    res.status(201).json({ success: true, data: populated });
});

// @desc    Get delivery stats summary (admin)
// @route   GET /api/rider/admin/stats
// @access  Private (admin)
export const getDeliveryAdminStats = asyncHandler(async (req, res) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [total, pending, assigned, inTransit, deliveredToday, totalDelivered, failed] = await Promise.all([
        Delivery.countDocuments(),
        Delivery.countDocuments({ status: 'Pending' }),
        Delivery.countDocuments({ status: 'Assigned' }),
        Delivery.countDocuments({ status: { $in: ['Picked Up', 'In Transit'] } }),
        Delivery.countDocuments({ status: 'Delivered', deliveredAt: { $gte: today } }),
        Delivery.countDocuments({ status: 'Delivered' }),
        Delivery.countDocuments({ status: 'Failed' })
    ]);

    res.json({ success: true, data: { total, pending, assigned, inTransit, deliveredToday, totalDelivered, failed } });
});

// @desc    Get all available riders (staff users), optionally filtered by area
// @route   GET /api/rider/admin/riders?area=Uttara
// @access  Private (admin)
export const getAvailableRiders = asyncHandler(async (req, res) => {
    const { area } = req.query;

    const query = { role: 'staff' };
    // If area is provided, only return riders who have that area assigned
    if (area) {
        query.assignedAreas = area;
    }

    const riders = await User.find(query).select('name email avatar phone assignedAreas');
    res.json({ success: true, count: riders.length, data: riders });
});

// @desc    Update a rider's assigned delivery areas (admin)
// @route   PUT /api/rider/admin/riders/:id/areas
// @access  Private (admin)
export const updateRiderAreas = asyncHandler(async (req, res) => {
    const { areas } = req.body;

    if (!Array.isArray(areas)) {
        return res.status(400).json({ success: false, message: '`areas` must be an array of area names' });
    }

    const rider = await User.findById(req.params.id);
    if (!rider || rider.role !== 'staff') {
        return res.status(404).json({ success: false, message: 'Rider not found' });
    }

    rider.assignedAreas = areas;
    await rider.save();

    res.json({
        success: true,
        data: {
            id: rider._id,
            name: rider.name,
            email: rider.email,
            phone: rider.phone,
            assignedAreas: rider.assignedAreas
        }
    });
});
