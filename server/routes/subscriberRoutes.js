import express from 'express';
import { subscribe, getSubscribers } from '../controllers/subscriberController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * /api/subscribers:
 *   post:
 *     summary: Subscribe to newsletter (public)
 *     tags: [Subscribers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *     responses:
 *       201:
 *         description: Subscribed successfully
 *       400:
 *         description: Already subscribed or invalid email
 *   get:
 *     summary: Get all newsletter subscribers (Admin/Staff)
 *     tags: [Subscribers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all email subscribers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       email:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 */
router.route('/')
    .post(subscribe)
    .get(protect, authorize('admin', 'staff'), getSubscribers);

export default router;
