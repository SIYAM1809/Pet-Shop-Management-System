import { useState } from 'react';
import { Search, Package, CheckCircle, Clock, Truck, MapPin, AlertCircle, Home } from 'lucide-react';
import { orderAPI, formatBDT } from '../../services/api';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import './Public.css';

/* ── Delivery timeline definition ───────────────────────── */
const DELIVERY_STEPS = [
    { key: 'Pending',    label: 'Order Placed',   icon: Package,     desc: 'Your order is in the queue' },
    { key: 'Assigned',   label: 'Rider Assigned', icon: Truck,       desc: 'A rider has been assigned' },
    { key: 'Picked Up',  label: 'Picked Up',      icon: Home,        desc: 'Rider picked up your order' },
    { key: 'In Transit', label: 'On the Way',     icon: MapPin,      desc: 'Your order is en route to you' },
    { key: 'Delivered',  label: 'Delivered',      icon: CheckCircle, desc: 'Order successfully delivered' }
];

const STEP_INDEX = { Pending: 0, Assigned: 1, 'Picked Up': 2, 'In Transit': 3, Delivered: 4 };

const getOrderStatusColor = (status) => {
    switch (status) {
        case 'Completed':   return '#22c55e';
        case 'Processing':  return '#3b82f6';
        case 'Cancelled':   return '#ef4444';
        default:            return '#f59e0b';
    }
};

const TrackOrder = () => {
    const [orderNumber, setOrderNumber] = useState('');
    const [order, setOrder]             = useState(null);
    const [loading, setLoading]         = useState(false);
    const [error, setError]             = useState('');

    const handleTrack = async (e) => {
        e.preventDefault();
        if (!orderNumber.trim()) { toast.error('Please enter an order number'); return; }
        setLoading(true);
        setError('');
        setOrder(null);
        try {
            const data = await orderAPI.track(orderNumber);
            setOrder(data.data);
        } catch (err) {
            setError(err.message);
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const delivery = order?.delivery;
    const currentStep = delivery ? (STEP_INDEX[delivery.status] ?? -1) : -1;
    const isFailed    = delivery?.status === 'Failed';

    return (
        <div className="container" style={{ padding: '4rem 1rem', minHeight: '60vh' }}>
            <div className="card glass" style={{ maxWidth: '660px', margin: '0 auto', padding: '2.5rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h2 className="gradient-text" style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>
                        Track Your Order
                    </h2>
                    <p className="text-secondary">Enter your order number to see live delivery status.</p>
                </div>

                {/* Search form */}
                <form onSubmit={handleTrack} style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <Search size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                        <input
                            type="text"
                            value={orderNumber}
                            onChange={(e) => setOrderNumber(e.target.value)}
                            placeholder="e.g. ORD-240208-1234"
                            className="input"
                            style={{ paddingLeft: '2.5rem' }}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={loading} style={{ whiteSpace: 'nowrap' }}>
                        {loading ? 'Searching...' : 'Track'}
                    </button>
                </form>

                {/* Error */}
                {error && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '0.75rem 1rem', marginBottom: '1.5rem', color: '#ef4444', fontSize: '0.875rem' }}>
                        <AlertCircle size={18} />
                        {error}
                    </div>
                )}

                {/* Order Found */}
                {order && (
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35 }}
                    >
                        {/* Order header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: '1rem', borderBottom: '1px solid var(--border-light)', marginBottom: '1.5rem' }}>
                            <div>
                                <div style={{ fontWeight: 800, fontSize: '1.1rem', fontFamily: 'monospace', color: 'var(--text-primary)' }}>
                                    #{order.orderNumber}
                                </div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                                    Placed {new Date(order.createdAt).toLocaleDateString('en-US', { dateStyle: 'medium' })}
                                </div>
                            </div>
                            <span style={{ background: `${getOrderStatusColor(order.status)}18`, color: getOrderStatusColor(order.status), padding: '0.3rem 0.875rem', borderRadius: 999, fontSize: '0.8rem', fontWeight: 700 }}>
                                {order.status}
                            </span>
                        </div>

                        {/* Delivery timeline — only for home delivery */}
                        {order.deliveryType === 'home_delivery' && (
                            <div style={{ marginBottom: '1.5rem' }}>
                                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1rem' }}>
                                    📦 Delivery Status
                                </div>

                                {/* Rider + area info */}
                                {delivery && (
                                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                                        {delivery.rider?.name && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(249,115,22,0.08)', borderRadius: 8, padding: '0.4rem 0.75rem', fontSize: '0.8rem', color: '#f97316', fontWeight: 600 }}>
                                                <Truck size={14} /> Rider: {delivery.rider.name}
                                            </div>
                                        )}
                                        {order.deliveryArea && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(59,130,246,0.08)', borderRadius: 8, padding: '0.4rem 0.75rem', fontSize: '0.8rem', color: '#3b82f6', fontWeight: 600 }}>
                                                <MapPin size={14} /> {order.deliveryArea}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Failed state */}
                                {isFailed ? (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12, padding: '1rem', color: '#ef4444' }}>
                                        <AlertCircle size={20} />
                                        <div>
                                            <div style={{ fontWeight: 700 }}>Delivery Failed</div>
                                            <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Please contact us for assistance.</div>
                                        </div>
                                    </div>
                                ) : (
                                    /* Timeline steps */
                                    <div style={{ position: 'relative' }}>
                                        {/* Connecting line */}
                                        <div style={{ position: 'absolute', left: 19, top: 20, bottom: 20, width: 2, background: 'var(--border-light)', zIndex: 0 }} />
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                                            {DELIVERY_STEPS.map((step, idx) => {
                                                const done    = idx <= currentStep;
                                                const current = idx === currentStep;
                                                const StepIcon = step.icon;
                                                return (
                                                    <motion.div
                                                        key={step.key}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: idx * 0.08 }}
                                                        style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '0.75rem 0', position: 'relative', zIndex: 1 }}
                                                    >
                                                        {/* Icon circle */}
                                                        <div style={{
                                                            width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            background: done ? (current ? '#f97316' : '#22c55e') : 'var(--surface)',
                                                            border: `2px solid ${done ? (current ? '#f97316' : '#22c55e') : 'var(--border-light)'}`,
                                                            boxShadow: current ? '0 0 0 4px rgba(249,115,22,0.15)' : 'none',
                                                            transition: 'all 0.3s'
                                                        }}>
                                                            <StepIcon size={16} color={done ? 'white' : 'var(--text-tertiary)'} />
                                                        </div>
                                                        {/* Label */}
                                                        <div style={{ paddingTop: '0.5rem' }}>
                                                            <div style={{ fontWeight: current ? 700 : 600, color: done ? 'var(--text-primary)' : 'var(--text-tertiary)', fontSize: '0.875rem' }}>
                                                                {step.label}
                                                                {current && (
                                                                    <span style={{ marginLeft: '0.5rem', background: 'rgba(249,115,22,0.12)', color: '#f97316', padding: '0.1rem 0.5rem', borderRadius: 999, fontSize: '0.7rem', fontWeight: 800 }}>
                                                                        CURRENT
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div style={{ fontSize: '0.775rem', color: 'var(--text-tertiary)', marginTop: '0.1rem' }}>{step.desc}</div>
                                                        </div>
                                                    </motion.div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Store pickup notice */}
                        {order.deliveryType === 'store_pickup' && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 12, padding: '1rem', marginBottom: '1.5rem', fontSize: '0.875rem', color: '#3b82f6' }}>
                                <Home size={18} />
                                <div><strong>Store Pickup</strong> — Please visit our store to collect your order.</div>
                            </div>
                        )}

                        {/* Payment summary */}
                        <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                                <span>Payment</span>
                                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{order.paymentMethod}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                                <span>Payment Status</span>
                                <span style={{ fontWeight: 700, color: order.paymentStatus === 'Paid' ? '#22c55e' : '#f59e0b' }}>{order.paymentStatus}</span>
                            </div>
                            {order.deliveryCharge > 0 && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                                    <span>Delivery Charge</span>
                                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{formatBDT(order.deliveryCharge)}</span>
                                </div>
                            )}
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem', fontWeight: 800, marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-light)' }}>
                                <span>Total</span>
                                <span style={{ color: '#f97316' }}>{formatBDT(order.totalAmount)}</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default TrackOrder;
