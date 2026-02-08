import { useState } from 'react';
import Modal from './Modal';
import Button from './Button';
import Input from './Input';
import { inquiryAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { Calendar, Clock, User, Phone, Mail } from 'lucide-react';

const AppointmentModal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        purpose: 'General Visit',
        notes: ''
    });
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            // We reuse inquiryAPI but send type='Appointment'
            await inquiryAPI.create({
                ...formData,
                type: 'Appointment'
            });

            toast.success('Appointment Request Sent!');
            setFormData({
                name: '', email: '', phone: '', date: '', time: '', purpose: 'General Visit', notes: ''
            });
            onClose();
        } catch (error) {
            toast.error(error.message || 'Failed to book appointment');
        } finally {
            setSubmitting(false);
        }
    };

    const today = new Date().toISOString().split('T')[0];

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Book a Visit"
            size="md"
        >
            <form onSubmit={handleSubmit} className="appointment-form">
                <p className="text-gray-600 mb-6 text-sm">
                    Schedule a time to visit Siyam's Praniseba. Meet our pets in person and consult with our experts.
                </p>

                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Your Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="John Doe"
                            icon={<User size={18} />}
                        />
                        <Input
                            label="Email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="john@example.com"
                            icon={<Mail size={18} />}
                        />
                    </div>

                    <Input
                        label="Phone Number"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="+880..."
                        icon={<Phone size={18} />}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Preferred Date"
                            type="date"
                            name="date"
                            min={today}
                            value={formData.date}
                            onChange={handleChange}
                            required
                            icon={<Calendar size={18} />}
                        />
                        <Input
                            label="Preferred Time"
                            type="time"
                            name="time"
                            value={formData.time}
                            onChange={handleChange}
                            required
                            icon={<Clock size={18} />}
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label">Purpose of Visit</label>
                        <select
                            name="purpose"
                            value={formData.purpose}
                            onChange={handleChange}
                            className="input select"
                        >
                            <option value="General Visit">General Visit</option>
                            <option value="Meet a Specific Pet">Meet a Specific Pet</option>
                            <option value="Consultation">Vet Consultation</option>
                            <option value="Supplies Pickup">Supplies Pickup</option>
                        </select>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Additional Notes</label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Any specific requests?"
                            className="input textarea"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-8">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="primary" loading={submitting}>Confirm Booking</Button>
                </div>
            </form>
        </Modal>
    );
};

export default AppointmentModal;
