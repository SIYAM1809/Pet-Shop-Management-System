import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, Truck, Eye, RefreshCw, ArrowUpRight, X, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { riderAPI } from '../../services/api';
import { containerVariants, itemVariants } from '../../utils/animations';
import './MyDeliveries.css';

/* ── Helpers ─────────────────────────────────────────────── */
const BADGE_MAP = {
    'Assigned':   'assigned',
    'Picked Up':  'pickedup',
    'In Transit': 'intransit',
    'Delivered':  'delivered',
    'Failed':     'failed'
};

const NEXT_STATUSES = {
    'Assigned':   [{ label: '📦 Mark as Picked Up', value: 'Picked Up', danger: false },
                   { label: '❌ Mark as Failed',    value: 'Failed',    danger: true }],
    'Picked Up':  [{ label: '🚴 Mark as In Transit', value: 'In Transit', danger: false },
                   { label: '❌ Mark as Failed',     value: 'Failed',     danger: true }],
    'In Transit': [{ label: '✅ Mark as Delivered', value: 'Delivered', danger: false },
                   { label: '❌ Mark as Failed',    value: 'Failed',     danger: true }],
    'Delivered':  [],
    'Failed':     []
};

const formatCurrency = (v) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(v || 0);

const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

/* ── Component ───────────────────────────────────────────── */
const MyDeliveries = () => {
    const [deliveries, setDeliveries]     = useState([]);
    const [loading, setLoading]           = useState(true);
    const [search, setSearch]             = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [page, setPage]                 = useState(1);
    const [totalPages, setTotalPages]     = useState(1);
    const [total, setTotal]               = useState(0);

    // Modals
    const [viewDelivery, setViewDelivery]     = useState(null);
    const [updateTarget, setUpdateTarget]     = useState(null);
    const [updating, setUpdating]             = useState(false);

    const fetchDeliveries = useCallback(async () => {
        setLoading(true);
        try {
            const params = { page, limit: 10 };
            if (filterStatus) params.status = filterStatus;
            const res = await riderAPI.getMyDeliveries(params);
            setDeliveries(res.data || []);
            setTotalPages(res.pages || 1);
            setTotal(res.total || 0);
        } catch (err) {
            toast.error('Failed to load deliveries');
        } finally {
            setLoading(false);
        }
    }, [page, filterStatus]);

    useEffect(() => {
        fetchDeliveries();
    }, [fetchDeliveries]);

    // Client-side search filter
    const filtered = deliveries.filter(d =>
        d.order?.orderNumber?.toLowerCase().includes(search.toLowerCase()) ||
        d.order?.customer?.name?.toLowerCase().includes(search.toLowerCase())
    );

    const handleUpdateStatus = async (deliveryId, newStatus) => {
        setUpdating(true);
        try {
            await riderAPI.updateDeliveryStatus(deliveryId, { status: newStatus });
            toast.success(`Status updated to "${newStatus}"`);
            setUpdateTarget(null);
            fetchDeliveries();
        } catch (err) {
            toast.error(err.message || 'Failed to update status');
        } finally {
            setUpdating(false);
        }
    };

    const nextOptions = updateTarget ? (NEXT_STATUSES[updateTarget.status] || []) : [];

    return (
        <motion.div
            className="my-deliveries"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Header */}
            <div className="rider-page-header">
                <div>
                    <h1 className="rider-page-title">My Deliveries</h1>
                    <p className="rider-page-subtitle">
                        {total} total assignment{total !== 1 ? 's' : ''}
                    </p>
                </div>
                <button
                    className="delivery-action-btn view"
                    style={{ width: 'auto', padding: '0.5rem 1rem', borderRadius: 10 }}
                    onClick={fetchDeliveries}
                    title="Refresh"
                >
                    <RefreshCw size={15} />
                    <span style={{ marginLeft: '0.375rem', fontSize: '0.8rem', fontWeight: 600 }}>Refresh</span>
                </button>
            </div>

            {/* Filters */}
            <motion.div className="deliveries-filters" variants={itemVariants}>
                <div className="delivery-search-wrap">
                    <Search size={16} className="delivery-search-icon" />
                    <input
                        type="text"
                        className="delivery-search-input"
                        placeholder="Search order # or customer..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <select
                    className="delivery-filter-select"
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
            </motion.div>

            {/* Table */}
            <motion.div variants={itemVariants}>
                {loading ? (
                    <div className="deliveries-loading">
                        <div className="spinner" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="deliveries-empty">
                        <Truck size={64} />
                        <h3 style={{ fontWeight: 600, margin: '0.5rem 0 0.25rem' }}>
                            No deliveries found
                        </h3>
                        <p style={{ fontSize: '0.875rem' }}>
                            {filterStatus ? 'Try a different status filter.' : 'You have no assignments yet.'}
                        </p>
                    </div>
                ) : (
                    <div className="deliveries-table-wrap">
                        <table className="deliveries-table">
                            <thead>
                                <tr>
                                    <th>Order #</th>
                                    <th>Customer</th>
                                    <th>Delivery Address</th>
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
                                            <span className="delivery-order-num">
                                                {d.order?.orderNumber || '—'}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ fontWeight: 600 }}>
                                                {d.order?.customer?.name || '—'}
                                            </div>
                                            {d.customerPhone && (
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                                    📞 {d.customerPhone}
                                                </div>
                                            )}
                                        </td>
                                        <td>
                                            <div className="delivery-address-cell" title={d.deliveryAddress}>
                                                📍 {d.deliveryAddress}
                                            </div>
                                        </td>
                                        <td style={{ fontWeight: 700 }}>
                                            {formatCurrency(d.order?.totalAmount)}
                                        </td>
                                        <td>
                                            <span className={`rider-badge rider-badge-${BADGE_MAP[d.status] || 'assigned'}`}>
                                                {d.status}
                                            </span>
                                        </td>
                                        <td style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                                            {formatDate(d.assignedAt)}
                                        </td>
                                        <td>
                                            <div className="delivery-actions">
                                                {/* View */}
                                                <button
                                                    className="delivery-action-btn view"
                                                    title="View Details"
                                                    onClick={() => setViewDelivery(d)}
                                                >
                                                    <Eye size={14} />
                                                </button>
                                                {/* Update Status */}
                                                {['Assigned', 'Picked Up', 'In Transit'].includes(d.status) && (
                                                    <button
                                                        className="delivery-action-btn update"
                                                        title="Update Status"
                                                        onClick={() => setUpdateTarget(d)}
                                                    >
                                                        <ArrowUpRight size={14} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="deliveries-pagination">
                                <span>Page {page} of {totalPages}</span>
                                <div className="deliveries-pag-btns">
                                    <button
                                        className="deliveries-pag-btn"
                                        disabled={page <= 1}
                                        onClick={() => setPage(p => p - 1)}
                                    >
                                        ← Prev
                                    </button>
                                    <button
                                        className="deliveries-pag-btn"
                                        disabled={page >= totalPages}
                                        onClick={() => setPage(p => p + 1)}
                                    >
                                        Next →
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </motion.div>

            {/* ── View Order Modal ──────────────────────────── */}
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
                            padding: '1.5rem', width: '100%', maxWidth: 520,
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
                        <div className="order-detail-block">
                            <div className="order-detail-row">
                                <span>Order #</span>
                                <strong style={{ color: '#f97316', fontFamily: 'monospace' }}>
                                    {viewDelivery.order?.orderNumber}
                                </strong>
                            </div>
                            <div className="order-detail-row">
                                <span>Customer</span>
                                <strong>{viewDelivery.order?.customer?.name || '—'}</strong>
                            </div>
                            {viewDelivery.order?.customer?.phone && (
                                <div className="order-detail-row">
                                    <span>Phone</span>
                                    <strong>{viewDelivery.order.customer.phone}</strong>
                                </div>
                            )}
                            <div className="order-detail-row">
                                <span>Delivery Address</span>
                                <strong style={{ textAlign: 'right', maxWidth: '60%' }}>
                                    {viewDelivery.deliveryAddress}
                                </strong>
                            </div>
                            {viewDelivery.customerPhone && (
                                <div className="order-detail-row">
                                    <span>Contact</span>
                                    <strong>{viewDelivery.customerPhone}</strong>
                                </div>
                            )}
                            <div className="order-detail-row">
                                <span>Status</span>
                                <span className={`rider-badge rider-badge-${BADGE_MAP[viewDelivery.status]}`}>
                                    {viewDelivery.status}
                                </span>
                            </div>
                            <div className="order-detail-row">
                                <span>Total</span>
                                <strong>{formatCurrency(viewDelivery.order?.totalAmount)}</strong>
                            </div>
                            {viewDelivery.notes && (
                                <div className="order-detail-row">
                                    <span>Notes</span>
                                    <strong>{viewDelivery.notes}</strong>
                                </div>
                            )}
                            {viewDelivery.order?.items?.length > 0 && (
                                <div>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        Items
                                    </p>
                                    <div className="order-items-list">
                                        {viewDelivery.order.items.map((item, i) => (
                                            <div key={i} className="order-item-line">
                                                <span>{item.petName} ({item.petSpecies})</span>
                                                <span>{formatCurrency(item.price)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}

            {/* ── Update Status Modal ───────────────────────── */}
            {updateTarget && (
                <div
                    style={{
                        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        zIndex: 1000, padding: '1rem'
                    }}
                    onClick={() => setUpdateTarget(null)}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{
                            background: 'var(--surface)', borderRadius: 16,
                            padding: '1.5rem', width: '100%', maxWidth: 440,
                            border: '1px solid var(--border-light)'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                            <h3 style={{ margin: 0, fontWeight: 700 }}>Update Delivery Status</h3>
                            <button
                                onClick={() => setUpdateTarget(null)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="status-modal-body">
                            {/* Current info */}
                            <div className="status-info-block">
                                <div className="status-info-row">
                                    <span>Order</span>
                                    <strong style={{ fontFamily: 'monospace', color: '#f97316' }}>
                                        {updateTarget.order?.orderNumber}
                                    </strong>
                                </div>
                                <div className="status-info-row">
                                    <span>Customer</span>
                                    <strong>{updateTarget.order?.customer?.name || '—'}</strong>
                                </div>
                                <div className="status-info-row">
                                    <span>Current Status</span>
                                    <span className={`rider-badge rider-badge-${BADGE_MAP[updateTarget.status]}`}>
                                        {updateTarget.status}
                                    </span>
                                </div>
                            </div>

                            {/* Next options */}
                            {nextOptions.length > 0 ? (
                                <div>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', fontWeight: 600 }}>
                                        Choose next status:
                                    </p>
                                    <div className="status-next-options">
                                        {nextOptions.map(opt => (
                                            <button
                                                key={opt.value}
                                                className={`status-option-btn ${opt.danger ? 'danger' : ''}`}
                                                disabled={updating}
                                                onClick={() => handleUpdateStatus(updateTarget._id, opt.value)}
                                            >
                                                {opt.danger ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <p style={{ textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>
                                    This delivery is in a final state.
                                </p>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </motion.div>
    );
};

export default MyDeliveries;
