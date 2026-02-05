import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, ShoppingCart, Eye, Check, X, Clock } from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Modal from '../../components/common/Modal';
import { orderAPI, customerAPI, petAPI } from '../../services/api';
import { containerVariants, itemVariants } from '../../utils/animations';
import toast from 'react-hot-toast';
import './Orders.css';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [viewOrder, setViewOrder] = useState(null);
    const [customers, setCustomers] = useState([]);
    const [pets, setPets] = useState([]);
    const [formData, setFormData] = useState({ customer: '', items: [], paymentMethod: 'Cash' });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchOrders();
        fetchCustomers();
        fetchPets();
    }, [filterStatus]);

    const fetchOrders = async () => {
        try {
            const params = filterStatus ? { status: filterStatus } : {};
            const response = await orderAPI.getAll(params);
            setOrders(response.data);
        } catch (error) {
            toast.error('Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    const fetchCustomers = async () => {
        try {
            const response = await customerAPI.getAll();
            setCustomers(response.data);
        } catch (error) {
            console.error('Failed to fetch customers');
        }
    };

    const fetchPets = async () => {
        try {
            const response = await petAPI.getAll({ status: 'Available' });
            setPets(response.data);
        } catch (error) {
            console.error('Failed to fetch pets');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.customer || formData.items.length === 0) {
            toast.error('Please select a customer and at least one pet');
            return;
        }
        setSubmitting(true);
        try {
            await orderAPI.create({
                customer: formData.customer,
                items: formData.items.map(id => ({ petId: id })),
                paymentMethod: formData.paymentMethod
            });
            toast.success('Order created!');
            setModalOpen(false);
            setFormData({ customer: '', items: [], paymentMethod: 'Cash' });
            fetchOrders();
            fetchPets();
        } catch (error) {
            toast.error(error.message);
        } finally {
            setSubmitting(false);
        }
    };

    const updateOrderStatus = async (orderId, status) => {
        try {
            await orderAPI.update(orderId, { status });
            toast.success(`Order ${status.toLowerCase()}`);
            fetchOrders();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const formatCurrency = (v) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v);
    const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Completed': return <Check size={14} />;
            case 'Cancelled': return <X size={14} />;
            default: return <Clock size={14} />;
        }
    };

    const getStatusBadge = (status) => {
        const map = { 'Completed': 'success', 'Cancelled': 'error', 'Pending': 'warning', 'Processing': 'info' };
        return map[status] || 'neutral';
    };

    const filteredOrders = orders.filter(o => o.orderNumber?.toLowerCase().includes(search.toLowerCase()));

    const togglePetSelection = (petId) => {
        setFormData(prev => ({
            ...prev,
            items: prev.items.includes(petId) ? prev.items.filter(id => id !== petId) : [...prev.items, petId]
        }));
    };

    return (
        <motion.div className="orders-page" variants={containerVariants} initial="hidden" animate="visible">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Orders</h1>
                    <p className="page-subtitle">Manage sales and transactions</p>
                </div>
                <Button variant="primary" icon={<Plus size={18} />} onClick={() => setModalOpen(true)}>New Order</Button>
            </div>

            <Card className="filters-card">
                <div className="filters-row">
                    <div className="search-filter">
                        <Search size={18} className="search-icon" />
                        <input type="text" placeholder="Search orders..." className="search-input" value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>
                    <select className="input select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                        <option value="">All Status</option>
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>
            </Card>

            {loading ? (
                <div className="loading-container"><div className="spinner" /></div>
            ) : filteredOrders.length === 0 ? (
                <div className="empty-state">
                    <ShoppingCart size={64} className="empty-state-icon" />
                    <h3 className="empty-state-title">No orders found</h3>
                    <Button variant="primary" onClick={() => setModalOpen(true)}>Create Order</Button>
                </div>
            ) : (
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Order #</th>
                                <th>Customer</th>
                                <th>Items</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map((order, index) => (
                                <motion.tr
                                    key={order._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                >
                                    <td><span className="order-number">{order.orderNumber}</span></td>
                                    <td>{order.customer?.name || 'N/A'}</td>
                                    <td>{order.items?.length || 0} pet(s)</td>
                                    <td className="order-total">{formatCurrency(order.totalAmount)}</td>
                                    <td><span className={`badge badge-${getStatusBadge(order.status)}`}>{getStatusIcon(order.status)} {order.status}</span></td>
                                    <td>{formatDate(order.createdAt)}</td>
                                    <td>
                                        <div className="order-actions">
                                            <button className="action-btn edit" onClick={() => setViewOrder(order)}><Eye size={16} /></button>
                                            {order.status === 'Pending' && (
                                                <>
                                                    <button className="action-btn success" onClick={() => updateOrderStatus(order._id, 'Completed')}><Check size={16} /></button>
                                                    <button className="action-btn delete" onClick={() => updateOrderStatus(order._id, 'Cancelled')}><X size={16} /></button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* New Order Modal */}
            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create New Order" size="lg"
                footer={<><Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button><Button variant="primary" onClick={handleSubmit} loading={submitting}>Create Order</Button></>}>
                <form className="order-form" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label className="input-label">Customer</label>
                        <select className="input select" value={formData.customer} onChange={(e) => setFormData({ ...formData, customer: e.target.value })} required>
                            <option value="">Select customer...</option>
                            {customers.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div className="input-group">
                        <label className="input-label">Select Pets ({formData.items.length} selected)</label>
                        <div className="pet-select-grid">
                            {pets.map(pet => (
                                <div key={pet._id} className={`pet-select-item ${formData.items.includes(pet._id) ? 'selected' : ''}`} onClick={() => togglePetSelection(pet._id)}>
                                    <span className="pet-select-name">{pet.name}</span>
                                    <span className="pet-select-price">${pet.price}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="input-group">
                        <label className="input-label">Payment Method</label>
                        <select className="input select" value={formData.paymentMethod} onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}>
                            <option value="Cash">Cash</option>
                            <option value="Credit Card">Credit Card</option>
                            <option value="Debit Card">Debit Card</option>
                            <option value="PayPal">PayPal</option>
                        </select>
                    </div>
                </form>
            </Modal>

            {/* View Order Modal */}
            <Modal isOpen={!!viewOrder} onClose={() => setViewOrder(null)} title={`Order ${viewOrder?.orderNumber || ''}`} size="md">
                {viewOrder && (
                    <div className="order-details">
                        <div className="detail-row"><span>Customer:</span><strong>{viewOrder.customer?.name}</strong></div>
                        <div className="detail-row"><span>Status:</span><span className={`badge badge-${getStatusBadge(viewOrder.status)}`}>{viewOrder.status}</span></div>
                        <div className="detail-row"><span>Payment:</span><span>{viewOrder.paymentMethod}</span></div>
                        <div className="order-items">
                            <h4>Items</h4>
                            {viewOrder.items?.map((item, i) => (
                                <div key={i} className="order-item"><span>{item.petName} ({item.petSpecies})</span><span>${item.price}</span></div>
                            ))}
                        </div>
                        <div className="order-summary">
                            <div className="summary-row"><span>Subtotal</span><span>{formatCurrency(viewOrder.subtotal)}</span></div>
                            <div className="summary-row"><span>Tax</span><span>{formatCurrency(viewOrder.tax)}</span></div>
                            <div className="summary-row total"><span>Total</span><span>{formatCurrency(viewOrder.totalAmount)}</span></div>
                        </div>
                    </div>
                )}
            </Modal>
        </motion.div>
    );
};

export default Orders;
