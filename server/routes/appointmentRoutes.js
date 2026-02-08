import express from 'express';
import { getAppointments, updateAppointmentStatus } from '../controllers/appointmentController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/').get(protect, authorize('admin'), getAppointments);
router.route('/:id').put(protect, authorize('admin'), updateAppointmentStatus);

export default router;
