import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Truck,
    Clock,
    CheckCircle,
    XCircle,
    Package,
    TrendingUp,
    ArrowRight,
    MapPin
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { riderAPI } from '../../services/api';
import { containerVariants, itemVariants } from '../../utils/animations';
import './RiderDashboard.css';

const getRiderBadge = (status) => {
    const map = {
        'Assigned':   'assigned',
        'Picked Up':  'pickedup',
        'In Transit': 'intransit',
        'Delivered':  'delivered',
        'Failed':     'failed'
    };
    return `rider-badge rider-badge-${map[status] || 'assigned'}`;
};

const RiderDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [recentDeliveries, setRecentDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await riderAPI.getStats();
            setStats(res.data.stats);
            setRecentDeliveries(res.data.recentDeliveries || []);
        } catch (err) {
            console.error('Failed to load rider stats:', err);
        } finally {
            setLoading(false);
        }
    };

    const statCards = stats
        ? [
            {
                label: 'Pending Pickups',
                value: stats.assigned,
                icon: Clock,
                color: 'amber'
            },
            {
                label: 'In Transit',
                value: stats.inTransit,
                icon: Truck,
                color: 'blue'
            },
            {
                label: 'Delivered Today',
                value: stats.deliveredToday,
                icon: CheckCircle,
                color: 'green'
            },
            {
                label: 'Total Delivered',
                value: stats.totalDelivered,
                icon: TrendingUp,
                color: 'purple'
            },
            {
                label: 'Failed',
                value: stats.failed,
                icon: XCircle,
                color: 'red'
            },
            {
                label: 'All Time',
                value: stats.total,
                icon: Package,
                color: 'orange'
            }
        ]
        : [];

    const formatCurrency = (v) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(v || 0);

    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

    return (
        <motion.div
            className="rider-dashboard"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Header */}
            <div className="rider-page-header">
                <div>
                    <h1 className="rider-page-title">
                        {greeting}, {user?.name?.split(' ')[0]} 👋
                    </h1>
                    <p className="rider-page-subtitle">
                        Here's your delivery overview for today.
                    </p>
                </div>
            </div>

            {/* Stats */}
            <motion.div className="rider-stats-grid" variants={containerVariants}>
                {loading
                    ? Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="rider-skeleton-card">
                            <div className="skeleton-pulse" style={{ width: 48, height: 48, borderRadius: 12, flexShrink: 0 }} />
                            <div style={{ flex: 1 }}>
                                <div className="skeleton-pulse" style={{ height: 12, width: '60%', marginBottom: 8 }} />
                                <div className="skeleton-pulse" style={{ height: 24, width: '40%' }} />
                            </div>
                        </div>
                    ))
                    : statCards.map((card, i) => (
                        <motion.div
                            key={card.label}
                            className="rider-stat-card"
                            variants={itemVariants}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.07 }}
                        >
                            <div className={`rider-stat-icon ${card.color}`}>
                                <card.icon size={22} />
                            </div>
                            <div className="rider-stat-info">
                                <span className="rider-stat-label">{card.label}</span>
                                <span className="rider-stat-value">{card.value}</span>
                            </div>
                        </motion.div>
                    ))
                }
            </motion.div>

            {/* Quick Actions */}
            <motion.div variants={itemVariants}>
                <div className="rider-actions-grid">
                    <Link to="/rider/deliveries" className="rider-action-card">
                        <div className="rider-action-icon">
                            <Truck size={20} />
                        </div>
                        <div>
                            <div className="rider-action-label">My Deliveries</div>
                            <div className="rider-action-sub">View & update delivery status</div>
                        </div>
                        <ArrowRight size={16} style={{ marginLeft: 'auto', opacity: 0.4 }} />
                    </Link>

                    <Link to="/rider/profile" className="rider-action-card">
                        <div className="rider-action-icon">
                            <MapPin size={20} />
                        </div>
                        <div>
                            <div className="rider-action-label">My Profile</div>
                            <div className="rider-action-sub">Update your information</div>
                        </div>
                        <ArrowRight size={16} style={{ marginLeft: 'auto', opacity: 0.4 }} />
                    </Link>
                </div>
            </motion.div>

            {/* Recent Deliveries */}
            <motion.div variants={itemVariants}>
                <div className="rider-recent-card">
                    <h3 className="rider-card-title">
                        <Truck size={18} color="#f97316" />
                        Recent Assignments
                    </h3>

                    {loading ? (
                        <div className="rider-delivery-list">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="rider-delivery-item">
                                    <div className="skeleton-pulse" style={{ width: 38, height: 38, borderRadius: 10, flexShrink: 0 }} />
                                    <div style={{ flex: 1 }}>
                                        <div className="skeleton-pulse" style={{ height: 13, width: '50%', marginBottom: 6 }} />
                                        <div className="skeleton-pulse" style={{ height: 11, width: '35%' }} />
                                    </div>
                                    <div className="skeleton-pulse" style={{ height: 22, width: 70, borderRadius: 999 }} />
                                </div>
                            ))}
                        </div>
                    ) : recentDeliveries.length === 0 ? (
                        <div className="rider-empty">
                            <Truck size={48} />
                            <p>No deliveries assigned yet.</p>
                        </div>
                    ) : (
                        <div className="rider-delivery-list">
                            {recentDeliveries.map((d, i) => (
                                <motion.div
                                    key={d._id}
                                    className="rider-delivery-item"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.06 }}
                                >
                                    <div className="rider-delivery-icon">
                                        <Truck size={16} />
                                    </div>
                                    <div className="rider-delivery-info">
                                        <div className="rider-delivery-order">
                                            {d.order?.orderNumber || 'N/A'}
                                        </div>
                                        <div className="rider-delivery-customer">
                                            {d.order?.customer?.name || '—'}
                                        </div>
                                    </div>
                                    <span className={getRiderBadge(d.status)}>
                                        {d.status}
                                    </span>
                                    <span className="rider-delivery-amount">
                                        {formatCurrency(d.order?.totalAmount)}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default RiderDashboard;
