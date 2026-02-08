import express from 'express';
import { createInquiry } from '../controllers/inquiryController.js';

const router = express.Router();

// Public route - no auth middleware
router.post('/', createInquiry);

export default router;
