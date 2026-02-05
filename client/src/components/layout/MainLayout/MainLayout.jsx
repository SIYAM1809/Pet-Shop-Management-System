import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from '../Sidebar';
import Header from '../Header';
import './MainLayout.css';

const MainLayout = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    return (
        <div className="main-layout">
            <Sidebar
                collapsed={sidebarCollapsed}
                onToggle={toggleSidebar}
            />

            {mobileMenuOpen && (
                <div
                    className="mobile-overlay"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            <motion.div
                className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}
                animate={{
                    marginLeft: sidebarCollapsed ? 80 : 260
                }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
                <Header onMenuClick={toggleMobileMenu} />
                <main className="page-content">
                    <Outlet />
                </main>
            </motion.div>
        </div>
    );
};

export default MainLayout;
