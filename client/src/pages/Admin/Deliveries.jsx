import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Truck, Plus, Search, Eye, X, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { riderAPI, orderAPI } from '../../services/api';
import { containerVariants, itemVariants } from '../../utils/animations';
import './Deliveries.css';

const BADGE = {
    'Assigned':   'badge-warning',
    'Picked Up':  'badge-info',
    'In Transit': 'badge-info',
    'Delivered':  'badge-success',
    'Failed':     'badge-error'
};

const formatCurrency = (v) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(v || 0);

const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

const AdminDeliveries = () => {
    const [deliveries, setDeliveries]   = useState([]);
    const [stats, setStats]             = useState(null);
    const [riders, setRiders]           = useState([]);
    const [orders, setOrders]           = useState([]);
    const [loading, setLoading]         = useState(true);
    const [filterStatus, setFilterStatus] = useState('');
    const [filterRider, setFilterRider]   = useState('');
    const [search, setSearch]             = useState('');
    const [page, setPage]               = useState(1);
    const [totalPages, setTotalPages]   = useState(1);
    const [total, setTotal]             = useState(0);

    // Assign modal
    const [assignOpen, setAssignOpen]   = useState(false);
    const [assigning, setAssigning]     = useState(false);
    const [assignForm, setAssignForm]   = useState({
        orderId: '', riderId: '', deliveryAddress: '', customerPhone: '', notes: ''
    });

    // View modal
    const [viewDelivery, setViewDelivery] = useState(null);

    const fetchAll = useCallback(async () => {
        setLoading(true);
        try {
            const params = { page, limit: 10 };
            if (filterStatus) params.status = filterStatus;
            if (filterRider)  params.riderId = filterRider;

            // Fetch deliveries and stats independently so one failure doesn't block the other
            const [delivRes, statsRes] = await Promise.allSettled([
                riderAPI.getAllDeliveries(params),
                riderAPI.getAdminStats()
            ]);

            if (delivRes.status === 'fulfilled') {
                setDeliveries(delivRes.value.data || []);
                setTotalPages(delivRes.value.pages || 1);
                setTotal(delivRes.value.total || 0);
            } else {
                console.warn('Deliveries fetch failed:', delivRes.reason?.message);
                setDeliveries([]);
            }

            if (statsRes.status === 'fulfilled') {
                setStats(statsRes.value.data || null);
            } else {
                console.warn('Stats fetch failed:', statsRes.reason?.message);
            }
        } catch (err) {
            toast.error('Unexpected error loading deliveries');
        } finally {
            setLoading(false);
        }
    }, [page, filterStatus, filterRider]);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    // Load riders & orders for the assign modal
    useEffect(() => {
        const load = async () => {
            try {
                const ridersRes = await riderAPI.getAvailableRiders();
                setRiders(ridersRes.data || []);
            } catch (_) {}

            try {
                const ordersRes = await orderAPI.getAll({ limit: 100 });
                // Handle both { data: [] } and { orders: [] } response shapes
                const list = ordersRes.data || ordersRes.orders || ordersRes || [];
                setOrders(Array.isArray(list) ? list : []);
            } catch (_) {}
        };
        load();
    }, []);

    const handleAssign = async (e) => {
        e.preventDefault();
        if (!assignForm.orderId || !assignForm.riderId || !assignForm.deliveryAddress) {
            toast.error('Order, Rider and Delivery Address are required');
            return;
        }
        setAssigning(true);
        try {
            await riderAPI.assignDelivery(assignForm);
            toast.success('Delivery assigned successfully!');
            setAssignOpen(false);
            setAssignForm({ orderId: '', riderId: '', deliveryAddress: '', customerPhone: '', notes: '' });
            fetchAll();
        } catch (err) {
            toast.error(err.message || 'Failed to assign delivery');
        } finally {
            setAssigning(false);
        }
    };

    // Client-side search
    const filtered = deliveries.filter(d =>
        d.order?.orderNumber?.toLowerCase().includes(search.toLowerCase()) ||
        d.rider?.name?.toLowerCase().includes(search.toLowerCase())
    );

    const statCards = stats ? [
        { label: 'Total',       value: stats.total,          color: 'badge-neutral' },
        { label: 'Assigned',    value: stats.assigned,       color: 'badge-warning' },
        { label: 'In Transit',  value: stats.inTransit,      color: 'badge-info' },
        { label: 'Completed',   value: stats.totalDelivered, color: 'badge-success' },
        { label: 'Today',       value: stats.deliveredToday, color: 'badge-success' },
        { label: 'Failed',      value: stats.failed,         color: 'badge-error' }
    ] : [];

    return (
        <motion.div
            className="admin-deliveries"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">Deliveries</h1>
                    <p className="page-subtitle">Manage home delivery assignments</p>
                </div>
                <Button variant="primary" icon={<Plus size={18} />} onClick={() => setAssignOpen(true)}>
                    Assign Delivery
                </Button>
            </div>

            {/* Stats Row */}
            {stats && (
                <motion.div className="delivery-stats-row" variants={itemVariants}>
                    {statCards.map((s) => (
                        <div key={s.label} className="delivery-stat-mini">
                            <span className="delivery-stat-mini-value">{s.value}</span>
                            <span className={`badge ${s.color}`} style={{ marginTop: '0.25rem' }}>{s.label}</span>
                        </div>
                    ))}
                </motion.div>
            )}

            {/* Filters */}
            <Card className="filters-card">
                <div className="filters-row">
                    <div className="search-filter">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search order # or rider..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <select
                        className="input select"
                        value={filterStatus}
                        onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
                    >
                        <option value="">All Statuses</option>
                        <option value="Assigned">Assigned</option>
                        <option value="Picked Up">Picked Up</option>
                        <option value="In Transit">In Transit</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Failed">Failed</option>
                    </select>
                    <select
                        className="input select"
                        value={filterRider}
                        onChange={(e) => { setFilterRider(e.target.value); setPage(1); }}
                    >
                        <option value="">All Riders</option>
                        {riders.map(r => (
                            <option key={r._id} value={r._id}>{r.name}</option>
                        ))}
                    </select>
                    <button
                        className="action-btn edit"
                        style={{ width: 36, height: 36, borderRadius: 8 }}
                        onClick={fetchAll}
                        title="Refresh"
                    >
                        <RefreshCw size={15} />
                    </button>
                </div>
            </Card>

            {/* Table */}
            {loading ? (
                <div className="loading-container"><div className="spinner" /></div>
            ) : filtered.length === 0 ? (
                <div className="empty-state">
                    <Truck size={64} className="empty-state-icon" />
                    <h3 className="empty-state-title">No deliveries found</h3>
                    <Button variant="primary" onClick={() => setAssignOpen(true)}>
                        Assign First Delivery
                    </Button>
                </div>
            ) : (
                <motion.div variants={itemVariants}>
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Order #</th>
                                    <th>Customer</th>
                                    <th>Rider</th>
                                    <th>Address</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                    <th>Assigned</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((d, i) => (
                                    <motion.tr
                                        key={d._id}
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.04 }}
                                    >
                                        <td>
                                            <span className="order-number">
                                                {d.order?.orderNumber || '—'}
                                            </span>
                                        </td>
                                        <td>{d.order?.customer?.name || '—'}</td>
                                        <td>
                                            <div style={{ fontWeight: 600 }}>{d.rider?.name || '—'}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                                {d.rider?.email}
                                            </div>
                                        </td>
                                        <td style={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {d.deliveryAddress}
                                        </td>
                                        <td style={{ fontWeight: 700 }}>
                                            {formatCurrency(d.order?.totalAmount)}
                                        </td>
                                        <td>
                                            <span className={`badge ${BADGE[d.status] || 'badge-neutral'}`}>
                                                {d.status}
                                            </span>
                                        </td>
                                        <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                            {formatDate(d.assignedAt)}
                                        </td>
                                        <td>
                                            <button
                                                className="action-btn edit"
                                                title="View Details"
                                                onClick={() => setViewDelivery(d)}
                                            >
                                                <Eye size={15} />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="delivery-pagination">
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                Page {page} of {totalPages} · {total} total
                            </span>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <Button size="sm" variant="secondary" onClick={() => setPage(p => p - 1)} disabled={page <= 1}>
                                    ← Prev
                                </Button>
                                <Button size="sm" variant="secondary" onClick={() => setPage(p => p + 1)} disabled={page >= totalPages}>
                                    Next →
                                </Button>
                            </div>
                        </div>
                    )}
                </motion.div>
            )}

            {/* ── Assign Delivery Modal ─────────────────────── */}
            <Modal
                isOpen={assignOpen}
                onClose={() => setAssignOpen(false)}
                title="Assign Delivery to Rider"
                size="md"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setAssignOpen(false)}>Cancel</Button>
                        <Button variant="primary" onClick={handleAssign} loading={assigning}>
                            Assign Delivery
                        </Button>
                    </>
                }
            >
                <form onSubmit={handleAssign} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="input-group">
                        <label className="input-label">Order (Processing status)</label>
                        <select
                            className="input select"
                            value={assignForm.orderId}
                            onChange={(e) => setAssignForm({ ...assignForm, orderId: e.target.value })}
                            required
                        >
                            <option value="">Select an order...</option>
                            {orders.map(o => (
                                <option key={o._id} value={o._id}>
                                    {o.orderNumber} — {o.customer?.name} ({formatCurrency(o.totalAmount)})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="input-group">
                        <label className="input-label">Assign to Rider</label>
                        <select
                            className="input select"
                            value={assignForm.riderId}
                            onChange={(e) => setAssignForm({ ...assignForm, riderId: e.target.value })}
                            required
                        >
                            <option value="">Select a rider...</option>
                            {riders.map(r => (
                                <option key={r._id} value={r._id}>{r.name} · {r.email}</option>
                            ))}
                        </select>
                    </div>
                    <div className="input-group">
                        <label className="input-label">Delivery Address *</label>
                        <input
                            className="input"
                            placeholder="Full delivery address"
                            value={assignForm.deliveryAddress}
                            onChange={(e) => setAssignForm({ ...assignForm, deliveryAddress: e.target.value })}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Customer Phone</label>
                        <input
                            className="input"
                            placeholder="01XXXXXXXXX"
                            value={assignForm.customerPhone}
                            onChange={(e) => setAssignForm({ ...assignForm, customerPhone: e.target.value })}
                        />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Notes (Optional)</label>
                        <textarea
                            className="input textarea"
                            rows="2"
                            placeholder="Special instructions..."
                            value={assignForm.notes}
                            onChange={(e) => setAssignForm({ ...assignForm, notes: e.target.value })}
                        />
                    </div>
                </form>
            </Modal>

            {/* ── View Delivery Modal ───────────────────────── */}
            {viewDelivery && (
                <div
                    style={{
                        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        zIndex: 1000, padding: '1rem'
                    }}
                    onClick={() => setViewDelivery(null)}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{
                            background: 'var(--surface)', borderRadius: 16,
                            padding: '1.5rem', width: '100%', maxWidth: 500,
                            border: '1px solid var(--border-light)'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                            <h3 style={{ margin: 0, fontWeight: 700 }}>Delivery Details</h3>
                            <button
                                onClick={() => setViewDelivery(null)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }}
                            >
                                <X size={20} />
                            </button>
                        </div>
                        {[
                            ['Order #',   <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{viewDelivery.order?.orderNumber}</span>],
                            ['Customer',  viewDelivery.order?.customer?.name],
                            ['Rider',     viewDelivery.rider?.name],
                            ['Address',   viewDelivery.deliveryAddress],
                            ['Phone',     viewDelivery.customerPhone || '—'],
                            ['Status',    <span className={`badge ${BADGE[viewDelivery.status]}`}>{viewDelivery.status}</span>],
                            ['Total',     formatCurrency(viewDelivery.order?.totalAmount)],
                            ['Assigned',  formatDate(viewDelivery.assignedAt)],
                            ['Delivered', formatDate(viewDelivery.deliveredAt)],
                            ['Notes',     viewDelivery.notes || '—']
                        ].map(([k, v]) => (
                            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border-light)', fontSize: '0.875rem' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>{k}</span>
                                <strong style={{ textAlign: 'right', maxWidth: '60%' }}>{v}</strong>
                            </div>
                        ))}
                    </motion.div>
                </div>
            )}
        </motion.div>
    );
};

export default AdminDeliveries;
