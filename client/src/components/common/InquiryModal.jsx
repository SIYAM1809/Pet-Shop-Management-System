import { useState } from 'react';
import Modal from './Modal';
import Button from './Button';
import Input from './Input';
import { inquiryAPI } from '../../services/api';
import toast from 'react-hot-toast';

const InquiryModal = ({ isOpen, onClose, pet }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
        paymentMethod: 'Cash'
    });
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            await inquiryAPI.create({
                ...formData,
                petId: pet._id
            });
            toast.success('Inquiry sent! We will contact you soon.');
            onClose();
            setFormData({ name: '', email: '', phone: '', message: '' });
        } catch (error) {
            toast.error(error.message || 'Failed to send inquiry');
        } finally {
            setSubmitting(false);
        }
    };

    if (!pet) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Inquire about ${pet.name}`}
            size="md"
        >
            <form onSubmit={handleSubmit} className="inquiry-form">
                <div className="pet-summary" style={{ marginBottom: '20px', padding: '10px', background: 'var(--bg-secondary)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div className="pet-thumb" style={{ width: '60px', height: '60px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
                        {pet.image ? (
                            <img src={pet.image} alt={pet.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <div style={{ width: '100%', height: '100%', background: 'var(--gray-200)' }} />
                        )}
                    </div>
                    <div>
                        <h4 style={{ margin: 0, color: 'var(--text-primary)' }}>{pet.name}</h4>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{pet.breed} • ${pet.price}</p>
                    </div>
                </div>

                <div className="form-grid">
                    <Input
                        label="Your Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="John Doe"
                    />
                    <Input
                        label="Email Address"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="john@example.com"
                    />
                    <Input
                        label="Phone Number"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="+1 (555) 000-0000"
                    />
                </div>

                <div className="input-group" style={{ marginTop: '15px' }}>
                    <label className="input-label" style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: 'var(--text-primary)' }}>Preferred Payment Method</label>
                    <select
                        name="paymentMethod"
                        className="input select"
                        value={formData.paymentMethod}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-light)', background: 'var(--surface)', color: 'var(--text-primary)' }}
                    >
                        <option value="Cash">Cash</option>
                        <option value="Credit Card">Credit Card</option>
                        <option value="Debit Card">Debit Card</option>
                        <option value="PayPal">PayPal</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                    </select>
                </div>

                <div className="input-group" style={{ marginTop: '15px' }}>
                    <label className="input-label" style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: 'var(--text-primary)' }}>Message (Optional)</label>
                    <textarea
                        name="message"
                        className="input textarea"
                        value={formData.message}
                        onChange={handleChange}
                        rows={3}
                        placeholder="I'm interested in adopting..."
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-light)', background: 'var(--surface)', color: 'var(--text-primary)' }}
                    />
                </div>

                <div className="modal-actions" style={{ marginTop: '25px', display: 'flex', justifyContent: 'end', gap: '10px' }}>
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="primary" loading={submitting}>Send Inquiry</Button>
                </div>
            </form>
        </Modal>
    );
};

export default InquiryModal;
