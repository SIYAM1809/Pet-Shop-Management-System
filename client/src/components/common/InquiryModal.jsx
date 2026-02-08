import { useState } from 'react';
import Modal from './Modal';
import Button from './Button';
import Input from './Input';
import Invoice from './Invoice';
import { inquiryAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { CreditCard, Banknote, Smartphone, Building } from 'lucide-react';

const InquiryModal = ({ isOpen, onClose, pet }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        message: '',
        paymentMethod: 'Bkash'
    });
    const [submitting, setSubmitting] = useState(false);
    const [showInvoice, setShowInvoice] = useState(false);
    const [orderData, setOrderData] = useState(null);
    const [customerData, setCustomerData] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePaymentSelect = (method) => {
        setFormData(prev => ({ ...prev, paymentMethod: method }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const response = await inquiryAPI.create({
                ...formData,
                petId: pet._id
            });

            // Success! Prepare invoice data
            setOrderData(response.data); // Assuming API returns order details in data
            setCustomerData({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                address: {
                    street: formData.street,
                    city: formData.city,
                    zipCode: formData.zipCode
                }
            });

            toast.success('Inquiry sent! Generating Invoice...');
            setShowInvoice(true);

            // Reset form for next time (but keep invoice open)
            setFormData({
                name: '', email: '', phone: '', street: '', city: '', state: '', zipCode: '',
                message: '', paymentMethod: 'Bkash'
            });
        } catch (error) {
            toast.error(error.message || 'Failed to send inquiry');
        } finally {
            setSubmitting(false);
        }
    };

    const handleClose = () => {
        setShowInvoice(false);
        setOrderData(null);
        onClose();
    };

    if (!pet) return null;

    // Payment Method Options
    const paymentMethods = [
        { id: 'Bkash', label: 'Bkash', icon: <Smartphone size={20} color="#e2136e" />, bgColor: '#fff0f5' },
        { id: 'Nagad', label: 'Nagad', icon: <Smartphone size={20} color="#ec1d24" />, bgColor: '#fff0f0' },
        { id: 'Rocket', label: 'Rocket', icon: <Smartphone size={20} color="#8c3494" />, bgColor: '#fcf0ff' },
        { id: 'Debit Card', label: 'Debit Card', icon: <CreditCard size={20} color="#2563eb" />, bgColor: '#eff6ff' },
        { id: 'Credit Card', label: 'Credit Card', icon: <CreditCard size={20} color="#2563eb" />, bgColor: '#eff6ff' },
        { id: 'Bank Transfer', label: 'Bank Transfer', icon: <Building size={20} color="#4b5563" />, bgColor: '#f3f4f6' },
    ];

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={showInvoice ? 'Inquiry Successful' : `Inquire about ${pet.name}`}
            size={showInvoice ? 'lg' : 'md'}
        >
            {showInvoice && orderData ? (
                <Invoice
                    order={{ ...orderData, paymentMethod: orderData.paymentMethod || formData.paymentMethod, createdAt: new Date() }} // Fallback if API doesn't return everything immediately
                    customer={customerData}
                    pet={pet}
                    onClose={handleClose}
                />
            ) : (
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
                        <label className="input-label" style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: 'var(--text-primary)' }}>Delivery Address</label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            <input
                                name="street"
                                className="input"
                                value={formData.street}
                                onChange={handleChange}
                                placeholder="Street Address"
                                required
                                style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-light)', background: 'var(--surface)', color: 'var(--text-primary)' }}
                            />
                            <input
                                name="city"
                                className="input"
                                value={formData.city}
                                onChange={handleChange}
                                placeholder="City"
                                required
                                style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-light)', background: 'var(--surface)', color: 'var(--text-primary)' }}
                            />
                            <input
                                name="state"
                                className="input"
                                value={formData.state}
                                onChange={handleChange}
                                placeholder="State"
                                style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-light)', background: 'var(--surface)', color: 'var(--text-primary)' }}
                            />
                            <input
                                name="zipCode"
                                className="input"
                                value={formData.zipCode}
                                onChange={handleChange}
                                placeholder="ZIP Code"
                                required
                                style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-light)', background: 'var(--surface)', color: 'var(--text-primary)' }}
                            />
                        </div>
                    </div>

                    <div className="input-group" style={{ marginTop: '20px' }}>
                        <label className="input-label" style={{ display: 'block', marginBottom: '10px', fontWeight: '500', color: 'var(--text-primary)' }}>Select Payment Method</label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                            {paymentMethods.map(method => (
                                <div
                                    key={method.id}
                                    onClick={() => handlePaymentSelect(method.id)}
                                    style={{
                                        border: formData.paymentMethod === method.id ? '2px solid var(--primary-600)' : '1px solid var(--border-light)',
                                        borderRadius: '8px',
                                        padding: '10px',
                                        cursor: 'pointer',
                                        background: formData.paymentMethod === method.id ? method.bgColor : 'var(--surface)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '5px',
                                        transition: 'all 0.2s',
                                        opacity: formData.paymentMethod === method.id ? 1 : 0.8
                                    }}
                                >
                                    {method.icon}
                                    <span style={{ fontSize: '0.8rem', fontWeight: '500', color: '#333' }}>{method.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="input-group" style={{ marginTop: '20px' }}>
                        <label className="input-label" style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: 'var(--text-primary)' }}>Message (Optional)</label>
                        <textarea
                            name="message"
                            className="input textarea"
                            value={formData.message}
                            onChange={handleChange}
                            rows={2}
                            placeholder="I'm interested in adopting..."
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-light)', background: 'var(--surface)', color: 'var(--text-primary)' }}
                        />
                    </div>

                    <div className="modal-actions" style={{ marginTop: '25px', display: 'flex', justifyContent: 'end', gap: '10px' }}>
                        <Button type="button" variant="secondary" onClick={handleClose}>Cancel</Button>
                        <Button type="submit" variant="primary" loading={submitting}>Confirm & Get Invoice</Button>
                    </div>
                </form>
            )}
        </Modal>
    );
};

export default InquiryModal;
