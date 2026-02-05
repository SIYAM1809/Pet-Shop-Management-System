import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    PawPrint,
    Users,
    ShoppingCart,
    DollarSign,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import Card from '../../components/common/Card';
import { dashboardAPI } from '../../services/api';
import { containerVariants, itemVariants } from '../../utils/animations';
import './Dashboard.css';

const COLORS = ['#8b5cf6', '#06b6d4', '#ec4899', '#f97316', '#10b981', '#6366f1'];

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await dashboardAPI.getStats();
            setStats(response.data);
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0
        }).format(value);
    };

    const statsCards = [
        {
            title: 'Total Pets',
            value: stats?.stats?.totalPets || 0,
            icon: PawPrint,
            color: 'purple',
            change: '+12%',
            positive: true
        },
        {
            title: 'Total Customers',
            value: stats?.stats?.totalCustomers || 0,
            icon: Users,
            color: 'cyan',
            change: '+8%',
            positive: true
        },
        {
            title: 'Total Orders',
            value: stats?.stats?.totalOrders || 0,
            icon: ShoppingCart,
            color: 'pink',
            change: '+23%',
            positive: true
        },
        {
            title: 'Revenue',
            value: formatCurrency(stats?.stats?.totalRevenue || 0),
            icon: DollarSign,
            color: 'emerald',
            change: '+15%',
            positive: true
        }
    ];

    if (loading) {
        return (
            <div className="dashboard-loading">
                <div className="spinner" />
                <p>Loading dashboard...</p>
            </div>
        );
    }

    return (
        <motion.div
            className="dashboard"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="page-header">
                <div>
                    <h1 className="page-title">Dashboard</h1>
                    <p className="page-subtitle">Welcome back! Here's what's happening.</p>
                </div>
            </div>

            {/* Stats Cards */}
            <motion.div className="stats-grid" variants={containerVariants}>
                {statsCards.map((stat, index) => (
                    <motion.div key={stat.title} variants={itemVariants}>
                        <div className="stats-card">
                            <div className={`stats-icon stats-icon-${stat.color}`}>
                                <stat.icon size={24} />
                            </div>
                            <div className="stats-content">
                                <p className="stats-label">{stat.title}</p>
                                <h3 className="stats-value">{stat.value}</h3>
                                <div className={`stats-change ${stat.positive ? 'stats-change-up' : 'stats-change-down'}`}>
                                    {stat.positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                    <span>{stat.change} from last month</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Charts Section */}
            <div className="charts-grid">
                <motion.div variants={itemVariants}>
                    <Card className="chart-card">
                        <h3 className="chart-title">Revenue Overview</h3>
                        <div className="chart-container">
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={stats?.charts?.monthlyRevenue || []}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                                    <XAxis
                                        dataKey="month"
                                        stroke="var(--text-tertiary)"
                                        fontSize={12}
                                    />
                                    <YAxis
                                        stroke="var(--text-tertiary)"
                                        fontSize={12}
                                        tickFormatter={(value) => `$${value}`}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            background: 'var(--surface)',
                                            border: '1px solid var(--border-light)',
                                            borderRadius: '8px'
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="#8b5cf6"
                                        strokeWidth={2}
                                        fillOpacity={1}
                                        fill="url(#colorRevenue)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <Card className="chart-card">
                        <h3 className="chart-title">Pets by Species</h3>
                        <div className="chart-container">
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={stats?.charts?.petsBySpecies || []}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {(stats?.charts?.petsBySpecies || []).map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            background: 'var(--surface)',
                                            border: '1px solid var(--border-light)',
                                            borderRadius: '8px'
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="pie-legend">
                                {(stats?.charts?.petsBySpecies || []).map((item, index) => (
                                    <div key={item.name} className="legend-item">
                                        <span
                                            className="legend-color"
                                            style={{ background: COLORS[index % COLORS.length] }}
                                        />
                                        <span className="legend-label">{item.name}</span>
                                        <span className="legend-value">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>
                </motion.div>
            </div>

            {/* Recent Activity */}
            <div className="activity-grid">
                <motion.div variants={itemVariants}>
                    <Card className="activity-card">
                        <h3 className="activity-title">Recent Orders</h3>
                        <div className="activity-list">
                            {(stats?.recentOrders || []).slice(0, 5).map((order) => (
                                <div key={order._id} className="activity-item">
                                    <div className="activity-icon order-icon">
                                        <ShoppingCart size={16} />
                                    </div>
                                    <div className="activity-content">
                                        <p className="activity-name">{order.orderNumber}</p>
                                        <p className="activity-meta">{order.customer?.name}</p>
                                    </div>
                                    <div className="activity-amount">
                                        {formatCurrency(order.totalAmount)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <Card className="activity-card">
                        <h3 className="activity-title">New Pets</h3>
                        <div className="activity-list">
                            {(stats?.recentPets || []).slice(0, 5).map((pet) => (
                                <div key={pet._id} className="activity-item">
                                    <div className="activity-icon pet-icon">
                                        <PawPrint size={16} />
                                    </div>
                                    <div className="activity-content">
                                        <p className="activity-name">{pet.name}</p>
                                        <p className="activity-meta">{pet.species} - {pet.breed}</p>
                                    </div>
                                    <span className={`badge badge-${pet.status === 'Available' ? 'success' : 'warning'}`}>
                                        {pet.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Dashboard;
