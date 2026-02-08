import Appointment from '../models/Appointment.js';
import { asyncHandler } from '../middleware/error.js';

// @desc    Get all appointments
// @route   GET /api/appointments
// @access  Private/Admin
export const getAppointments = asyncHandler(async (req, res) => {
    const appointments = await Appointment.find({})
        .populate('customer', 'name email phone')
        .sort({ date: 1, time: 1 }); // Sort by date and time

    res.json(appointments);
});

// @desc    Update appointment status
// @route   PUT /api/appointments/:id
// @access  Private/Admin
export const updateAppointmentStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (appointment) {
        appointment.status = status;
        const updatedAppointment = await appointment.save();
        res.json(updatedAppointment);
    } else {
        res.status(404);
        throw new Error('Appointment not found');
    }
});
