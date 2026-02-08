import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    purpose: {
        type: String,
        enum: ['General Visit', 'Meet a Specific Pet', 'Consultation', 'Supplies Pickup'],
        default: 'General Visit'
    },
    notes: {
        type: String
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
        default: 'Pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;
