import Customer from '../models/Customer.js';
import Order from '../models/Order.js';
import { asyncHandler } from '../middleware/error.js';

// @desc    Get all customers
// @route   GET /api/customers
// @access  Private
export const getCustomers = asyncHandler(async (req, res) => {
    const { search, sort, page = 1, limit = 10 } = req.query;

    let query = {};

    if (search) {
        query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { phone: { $regex: search, $options: 'i' } }
        ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'name') sortOption = { name: 1 };
    if (sort === 'spent') sortOption = { totalSpent: -1 };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Customer.countDocuments(query);

    const customers = await Customer.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(parseInt(limit));

    res.json({
        success: true,
        count: customers.length,
        total,
        pages: Math.ceil(total / limit),
        currentPage: parseInt(page),
        data: customers
    });
});

// @desc    Get single customer
// @route   GET /api/customers/:id
// @access  Private
export const getCustomer = asyncHandler(async (req, res) => {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
        return res.status(404).json({
            success: false,
            message: 'Customer not found'
        });
    }

    // Get customer's orders
    const orders = await Order.find({ customer: req.params.id })
        .sort({ createdAt: -1 })
        .limit(10);

    res.json({
        success: true,
        data: {
            ...customer.toObject(),
            recentOrders: orders
        }
    });
});

// @desc    Create new customer
// @route   POST /api/customers
// @access  Private
export const createCustomer = asyncHandler(async (req, res) => {
    const customer = await Customer.create(req.body);

    res.status(201).json({
        success: true,
        data: customer
    });
});

// @desc    Update customer
// @route   PUT /api/customers/:id
// @access  Private
export const updateCustomer = asyncHandler(async (req, res) => {
    let customer = await Customer.findById(req.params.id);

    if (!customer) {
        return res.status(404).json({
            success: false,
            message: 'Customer not found'
        });
    }

    customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.json({
        success: true,
        data: customer
    });
});

// @desc    Delete customer
// @route   DELETE /api/customers/:id
// @access  Private
export const deleteCustomer = asyncHandler(async (req, res) => {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
        return res.status(404).json({
            success: false,
            message: 'Customer not found'
        });
    }

    await customer.deleteOne();

    res.json({
        success: true,
        data: {}
    });
});
