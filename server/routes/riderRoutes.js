import express from 'express';
import {
    getMyDeliveries,
    updateDeliveryStatus,
    getRiderStats,
    getAllDeliveries,
    assignDelivery,
    getDeliveryAdminStats,
    getAvailableRiders
} from '../controllers/riderController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// ──────────────────────────────────────────────
// RIDER (staff) routes — /api/rider/*
// ──────────────────────────────────────────────

/**
 * @route   GET /api/rider/stats
 * @desc    Get rider dashboard statistics
 * @access  Private (staff)
 */
router.get('/stats', protect, authorize('staff'), getRiderStats);

/**
 * @route   GET /api/rider/deliveries
 * @desc    Get all deliveries assigned to the logged-in rider
 * @access  Private (staff)
 */
router.get('/deliveries', protect, authorize('staff'), getMyDeliveries);

/**
 * @route   PUT /api/rider/deliveries/:id
 * @desc    Update delivery status
 * @access  Private (staff)
 */
router.put('/deliveries/:id', protect, authorize('staff'), updateDeliveryStatus);

// ──────────────────────────────────────────────
// ADMIN routes — /api/rider/admin/*
// ──────────────────────────────────────────────

/**
 * @route   GET /api/rider/admin/stats
 * @desc    Get overall delivery statistics (admin view)
 * @access  Private (admin)
 */
router.get('/admin/stats', protect, authorize('admin'), getDeliveryAdminStats);

/**
 * @route   GET /api/rider/admin/deliveries
 * @desc    Get all deliveries with filters (admin view)
 * @access  Private (admin)
 */
router.get('/admin/deliveries', protect, authorize('admin'), getAllDeliveries);

/**
 * @route   POST /api/rider/admin/assign
 * @desc    Assign an order to a rider
 * @access  Private (admin)
 */
router.post('/admin/assign', protect, authorize('admin'), assignDelivery);

/**
 * @route   GET /api/rider/admin/riders
 * @desc    Get list of all available riders (staff users)
 * @access  Private (admin)
 */
router.get('/admin/riders', protect, authorize('admin'), getAvailableRiders);

export default router;
