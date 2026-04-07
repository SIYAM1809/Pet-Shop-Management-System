import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    PawPrint,
    Users,
    ShoppingCart,
    Package,
    Calendar,
    Star,
    Settings,
    ChevronLeft,
    ChevronRight,
    LogOut,
    Mail
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import './Sidebar.css';

const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/dashboard/appointments', icon: Calendar, label: 'Appointments' },
    { path: '/dashboard/pets', icon: PawPrint, label: 'Pets' },
    { path: '/dashboard/products', icon: Package, label: 'Products' },
    { path: '/dashboard/reviews', icon: Star, label: 'Reviews' },
    { path: '/dashboard/customers', icon: Users, label: 'Customers' },
    { path: '/dashboard/orders', icon: ShoppingCart, label: 'Orders' },
    { path: '/dashboard/subscribers', icon: Mail, label: 'Subscribers' },
    { path: '/dashboard/settings', icon: Settings, label: 'Settings' }
];

const Sidebar = ({ collapsed, onToggle }) => {
    const location = useLocation();
    const { logout } = useAuth();

    return (
        <motion.aside
            className={`sidebar ${collapsed ? 'collapsed' : ''}`}
            animate={{ width: collapsed ? 80 : 260 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
            <div className="sidebar-header">
                <div className="sidebar-logo" style={{ display: 'flex', justifyContent: 'center', width: '100%', overflow: 'hidden' }}>
                    <img src="/logo.png" alt="Siyam's Praniseba Logo" style={{ height: '36px', width: 'auto', maxWidth: '100%', objectFit: 'contain' }} />
                </div>
            </div>

            <nav className="sidebar-nav">
                <div className="nav-section">
                    {!collapsed && <span className="nav-section-title">Menu</span>}
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `nav-item ${isActive ? 'active' : ''}`
                            }
                        >
                            <item.icon size={20} className="nav-item-icon" />
                            {!collapsed && (
                                <motion.span
                                    className="nav-item-text"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    {item.label}
                                </motion.span>
                            )}
                        </NavLink>
                    ))}
                </div>
            </nav>

            <div className="sidebar-footer">
                <button
                    className="nav-item logout-btn"
                    onClick={logout}
                >
                    <LogOut size={20} className="nav-item-icon" />
                    {!collapsed && <span className="nav-item-text">Logout</span>}
                </button>

                <button
                    className="sidebar-toggle"
                    onClick={onToggle}
                    aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </button>
            </div>
        </motion.aside>
    );
};

export default Sidebar;
