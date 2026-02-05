import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Mail, Phone, MapPin, Edit2, Trash2, Users } from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import { customerAPI } from '../../services/api';
import { containerVariants, itemVariants } from '../../utils/animations';
import toast from 'react-hot-toast';
import './Customers.css';

const initialFormData = {
    name: '',
    email: '',
    phone: '',
    address: { street: '', city: '', state: '', zipCode: '' },
    notes: ''
};

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [formData, setFormData] = useState(initialFormData);
    const [submitting, setSubmitting] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [customerToDelete, setCustomerToDelete] = useState(null);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const response = await customerAPI.getAll();
            setCustomers(response.data);
        } catch (error) {
            toast.error('Failed to fetch customers');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (customer = null) => {
        if (customer) {
            setEditingCustomer(customer);
            setFormData(customer);
        } else {
            setEditingCustomer(null);
            setFormData(initialFormData);
        }
        setModalOpen(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('address.')) {
            const field = name.split('.')[1];
            setFormData({
                ...formData,
                address: { ...formData.address, [field]: value }
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (editingCustomer) {
                await customerAPI.update(editingCustomer._id, formData);
                toast.success('Customer updated!');
            } else {
                await customerAPI.create(formData);
                toast.success('Customer added!');
            }
            setModalOpen(false);
            fetchCustomers();
        } catch (error) {
            toast.error(error.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        try {
            await customerAPI.delete(customerToDelete._id);
            toast.success('Customer deleted!');
            setDeleteModalOpen(false);
            fetchCustomers();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency', currency: 'USD', minimumFractionDigits: 0
        }).format(value);
    };

    const filteredCustomers = customers.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <motion.div className="customers-page" variants={containerVariants} initial="hidden" animate="visible">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Customers</h1>
                    <p className="page-subtitle">Manage your customer database</p>
                </div>
                <Button variant="primary" icon={<Plus size={18} />} onClick={() => handleOpenModal()}>
                    Add Customer
                </Button>
            </div>

            <Card className="filters-card">
                <div className="search-filter">
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search customers..."
                        className="search-input"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </Card>

            {loading ? (
                <div className="loading-container"><div className="spinner" /></div>
            ) : filteredCustomers.length === 0 ? (
                <div className="empty-state">
                    <Users size={64} className="empty-state-icon" />
                    <h3 className="empty-state-title">No customers found</h3>
                    <Button variant="primary" onClick={() => handleOpenModal()}>Add Customer</Button>
                </div>
            ) : (
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Customer</th>
                                <th>Contact</th>
                                <th>Location</th>
                                <th>Purchases</th>
                                <th>Total Spent</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCustomers.map((customer) => (
                                <motion.tr key={customer._id} variants={itemVariants}>
                                    <td>
                                        <div className="customer-name">
                                            <div className="avatar avatar-sm">{customer.name.charAt(0)}</div>
                                            <span>{customer.name}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="contact-info">
                                            <span><Mail size={14} /> {customer.email}</span>
                                            <span><Phone size={14} /> {customer.phone}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="location">
                                            <MapPin size={14} /> {customer.address?.city || 'N/A'}, {customer.address?.state || ''}
                                        </span>
                                    </td>
                                    <td>{customer.totalPurchases || 0}</td>
                                    <td className="spent">{formatCurrency(customer.totalSpent || 0)}</td>
                                    <td>
                                        <div className="pet-actions">
                                            <button className="action-btn edit" onClick={() => handleOpenModal(customer)}>
                                                <Edit2 size={16} />
                                            </button>
                                            <button className="action-btn delete" onClick={() => { setCustomerToDelete(customer); setDeleteModalOpen(true); }}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingCustomer ? 'Edit Customer' : 'Add Customer'} size="lg"
                footer={<><Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button><Button variant="primary" onClick={handleSubmit} loading={submitting}>{editingCustomer ? 'Save' : 'Add'}</Button></>}>
                <form className="customer-form" onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <Input label="Full Name" name="name" value={formData.name} onChange={handleChange} required />
                        <Input label="Email" type="email" name="email" value={formData.email} onChange={handleChange} required />
                        <Input label="Phone" name="phone" value={formData.phone} onChange={handleChange} required />
                        <Input label="Street" name="address.street" value={formData.address?.street || ''} onChange={handleChange} />
                        <Input label="City" name="address.city" value={formData.address?.city || ''} onChange={handleChange} />
                        <Input label="State" name="address.state" value={formData.address?.state || ''} onChange={handleChange} />
                        <Input label="ZIP Code" name="address.zipCode" value={formData.address?.zipCode || ''} onChange={handleChange} />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Notes</label>
                        <textarea name="notes" className="input textarea" value={formData.notes} onChange={handleChange} rows={2} />
                    </div>
                </form>
            </Modal>

            <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Confirm Delete" size="sm"
                footer={<><Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>Cancel</Button><Button variant="danger" onClick={handleDelete}>Delete</Button></>}>
                <p>Delete <strong>{customerToDelete?.name}</strong>?</p>
            </Modal>
        </motion.div>
    );
};

export default Customers;
