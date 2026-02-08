import express from 'express';
import {
    getOrders,
    getOrder,
    createOrder,
    updateOrder,
    deleteOrder,
    getOrderStats,
    trackOrder
} from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/track/:orderNumber', trackOrder);

router.use(protect);

router.get('/stats', getOrderStats);
router.route('/')
    .get(getOrders)
    .post(createOrder);

router.route('/:id')
    .get(getOrder)
    .put(updateOrder)
    .delete(authorize('admin'), deleteOrder);

export default router;
