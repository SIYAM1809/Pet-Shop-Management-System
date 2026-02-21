import express from 'express';
import { createInquiry } from '../controllers/inquiryController.js';

const router = express.Router();

/**
 * @swagger
 * /api/inquiries:
 *   post:
 *     summary: Submit a customer inquiry (public)
 *     tags: [Inquiries]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, message]
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               phone:
 *                 type: string
 *                 example: "01700000000"
 *               subject:
 *                 type: string
 *                 example: Question about Golden Retriever
 *               message:
 *                 type: string
 *                 example: I am interested in adopting a dog...
 *     responses:
 *       201:
 *         description: Inquiry submitted successfully
 *       400:
 *         description: Validation error
 */
// Public route - no auth middleware
router.post('/', createInquiry);

export default router;
