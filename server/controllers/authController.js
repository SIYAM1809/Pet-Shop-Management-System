import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { asyncHandler } from '../middleware/error.js';

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

// @desc    Register customer (Public self-sign-up)
// @route   POST /api/auth/customer-register
// @access  Public
export const customerRegister = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: 'Please provide name, email and password' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
        return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    const user = await User.create({ name, email, password, role: 'customer' });
    const token = generateToken(user._id);

    res.status(201).json({
        success: true,
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
});

// @desc    Register user (Admin only)
// @route   POST /api/auth/register
// @access  Private/Admin
export const register = asyncHandler(async (req, res) => {
    const { name, email, password, role, phone, assignedAreas } = req.body;

    // Create user
    const user = await User.create({
        name,
        email,
        password,
        role: role || 'staff',
        phone: phone || '',
        assignedAreas: Array.isArray(assignedAreas) ? assignedAreas : []
    });

    res.status(201).json({
        success: true,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            assignedAreas: user.assignedAreas
        }
    });
});

// @desc    Get all users (Admin only)
// @route   GET /api/auth/users
// @access  Private/Admin
export const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select('-password');
    res.json({
        success: true,
        count: users.length,
        data: users  // includes assignedAreas, phone automatically
    });
});

// @desc    Delete a user account (Admin only)
// @route   DELETE /api/auth/users/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Prevent admin from deleting themselves
    if (id === req.user.id) {
        return res.status(400).json({
            success: false,
            message: 'You cannot delete your own account.'
        });
    }

    const userToDelete = await User.findById(id);
    if (!userToDelete) {
        return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Prevent deleting the last admin
    if (userToDelete.role === 'admin') {
        const adminCount = await User.countDocuments({ role: 'admin' });
        if (adminCount <= 1) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete the last admin account.'
            });
        }
    }

    await userToDelete.deleteOne();
    res.json({ success: true, message: `Account for "${userToDelete.name}" has been deleted.` });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Please provide an email and password'
        });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return res.status(401).json({
            success: false,
            message: 'Invalid credentials'
        });
    }

    // Check password
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        return res.status(401).json({
            success: false,
            message: 'Invalid credentials'
        });
    }

    const token = generateToken(user._id);

    res.json({
        success: true,
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);

    res.json({
        success: true,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            phone: user.phone || '',
            assignedAreas: user.assignedAreas || []
        }
    });
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = asyncHandler(async (req, res) => {
    const fieldsToUpdate = {
        name: req.body.name,
        email: req.body.email,
        avatar: req.body.avatar,
        phone: req.body.phone
    };

    // Remove undefined fields
    Object.keys(fieldsToUpdate).forEach(key =>
        fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
    );

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
        new: true,
        runValidators: true
    });

    res.json({
        success: true,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            phone: user.phone || '',
            assignedAreas: user.assignedAreas || []
        }
    });
});
