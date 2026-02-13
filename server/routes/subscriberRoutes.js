import express from 'express';
import { subscribe, getSubscribers } from '../controllers/subscriberController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
    .post(subscribe)
    .get(protect, authorize('admin', 'staff'), getSubscribers);

export default router;
