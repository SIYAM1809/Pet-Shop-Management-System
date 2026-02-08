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
                    <Input
                        label="Your Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="John Doe"
                        icon={<User size={18} />}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Phone Number"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            placeholder="+880..."
                            icon={<Phone size={18} />}
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date</label>
                            <div className="relative">
                                <input
                                    type="date"
                                    name="date"
                                    min={today}
                                    value={formData.date}
                                    onChange={handleChange}
                                    required
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none"
                                />
                                <Calendar className="absolute left-3 top-2.5 text-gray-400" size={18} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Time</label>
                            <div className="relative">
                                <input
                                    type="time"
                                    name="time"
                                    value={formData.time}
                                    onChange={handleChange}
                                    required
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none"
                                />
                                <Clock className="absolute left-3 top-2.5 text-gray-400" size={18} />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Purpose of Visit</label>
                        <select
                            name="purpose"
                            value={formData.purpose}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none bg-white"
                        >
                            <option value="General Visit">General Visit</option>
                            <option value="Meet a Specific Pet">Meet a Specific Pet</option>
                            <option value="Consultation">Vet Consultation</option>
                            <option value="Supplies Pickup">Supplies Pickup</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            rows={2}
                            placeholder="Any specific requests?"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none resize-none"
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
