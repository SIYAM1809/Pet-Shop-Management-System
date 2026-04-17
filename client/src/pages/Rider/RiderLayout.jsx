import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Truck,
    User,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Bike,
    MapPin
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './RiderLayout.css';

const navItems = [
    { path: '/rider',            icon: LayoutDashboard, label: 'Dashboard', end: true },
    { path: '/rider/deliveries', icon: Truck,            label: 'My Deliveries' },
    { path: '/rider/profile',    icon: User,             label: 'Profile' },
    { path: '/rider/settings',   icon: Settings,         label: 'Settings' }
];

const RiderLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const sidebarWidth = collapsed ? 80 : 260;

    return (
        <div className="rider-layout">
            {/* ── Sidebar ─────────────────────────────────────── */}
            <motion.aside
                className="rider-sidebar"
                animate={{ width: sidebarWidth }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
                {/* Logo */}
                <div className="rider-sidebar-header">
                    <div className="rider-sidebar-logo-icon">
                        <Bike size={20} color="white" />
                    </div>
                    <AnimatePresence>
                        {!collapsed && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="rider-sidebar-title">Rider Portal</div>
                                <div className="rider-sidebar-subtitle">Siyam's Praniseba</div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Nav */}
                <nav className="rider-sidebar-nav">
                    {!collapsed && (
                        <span className="rider-nav-section-label">Navigation</span>
                    )}
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.end}
                            className={({ isActive }) =>
                                `rider-nav-item ${isActive ? 'active' : ''}`
                            }
                            title={collapsed ? item.label : undefined}
                        >
                            <item.icon size={20} className="rider-nav-icon" />
                            <AnimatePresence>
                                {!collapsed && (
                                    <motion.span
                                        className="rider-nav-text"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.15 }}
                                    >
                                        {item.label}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </NavLink>
                    ))}
                </nav>

                {/* Footer */}
                <div className="rider-sidebar-footer">
                    {/* User info */}
                    <div className="rider-user-info" title={collapsed ? user?.name : undefined}>
                        <div className="rider-avatar">
                            {user?.name?.charAt(0)?.toUpperCase() || 'R'}
                        </div>
                        <AnimatePresence>
                            {!collapsed && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.15 }}
                                    style={{ overflow: 'hidden' }}
                                >
                                    <div className="rider-user-name">{user?.name || 'Rider'}</div>
                                    <div className="rider-user-role">🏍️ Rider</div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Logout */}
                    <button
                        className="rider-logout-btn"
                        onClick={handleLogout}
                        title={collapsed ? 'Logout' : undefined}
                    >
                        <LogOut size={18} />
                        <AnimatePresence>
                            {!collapsed && (
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.15 }}
                                >
                                    Logout
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </button>

                    {/* Toggle */}
                    <button
                        className="rider-toggle-btn"
                        onClick={() => setCollapsed(!collapsed)}
                        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    >
                        {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                    </button>
                </div>
            </motion.aside>

            {/* ── Main Content ─────────────────────────────────── */}
            <motion.div
                className="rider-main-content"
                animate={{ marginLeft: sidebarWidth }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
                {/* Header */}
                <header className="rider-header">
                    <div className="rider-header-left">
                        <MapPin size={18} color="var(--rider-primary, #f97316)" />
                        <span className="rider-header-title">Delivery Management</span>
                    </div>
                    <div className="rider-header-right">
                        <div className="rider-status-dot" title="Online" />
                        <div className="rider-header-chip">
                            <Bike size={14} />
                            <span>Rider · {user?.name?.split(' ')[0]}</span>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="rider-page-content">
                    <Outlet />
                </main>
            </motion.div>
        </div>
    );
};

export default RiderLayout;
