import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, User, Bell, Shield, Palette } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { containerVariants } from '../../utils/animations';
import './Settings.css';

const Settings = () => {
    const { theme, toggleTheme } = useTheme();
    const { user } = useAuth();
    const [passwordNote, setPasswordNote] = useState(false);

    return (
        <motion.div className="settings-page" variants={containerVariants} initial="hidden" animate="visible">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Settings</h1>
                    <p className="page-subtitle">Manage your account and preferences</p>
                </div>
            </div>

            <div className="settings-grid">
                {/* Profile Card */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
                    <Card className="settings-card">
                        <div className="settings-header">
                            <div className="settings-icon"><User size={24} /></div>
                            <div>
                                <h3>Profile</h3>
                                <p>Your current account information</p>
                            </div>
                        </div>
                        <div className="settings-content">
                            <div className="profile-info">
                                <div className="avatar avatar-lg">{user?.name?.charAt(0) || 'U'}</div>
                                <div>
                                    <h4>{user?.name || 'User'}</h4>
                                    <p>{user?.email || 'user@example.com'}</p>
                                    <span className="badge badge-info" style={{ textTransform: 'capitalize' }}>
                                        {user?.role || 'Admin'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                {/* Appearance Card */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
                    <Card className="settings-card">
                        <div className="settings-header">
                            <div className="settings-icon theme"><Palette size={24} /></div>
                            <div>
                                <h3>Appearance</h3>
                                <p>Customize the look and feel</p>
                            </div>
                        </div>
                        <div className="settings-content">
                            <div className="theme-toggle-section">
                                <div className="theme-option">
                                    <span>Theme Mode</span>
                                    <button className="theme-switch" onClick={toggleTheme}>
                                        {theme === 'light' ? <Sun size={20} /> : <Moon size={20} />}
                                        <span>{theme === 'light' ? 'Light' : 'Dark'}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                {/* Notifications Card */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.3 }}>
                    <Card className="settings-card">
                        <div className="settings-header">
                            <div className="settings-icon notifications"><Bell size={24} /></div>
                            <div>
                                <h3>Notifications</h3>
                                <p>Configure alert preferences</p>
                            </div>
                        </div>
                        <div className="settings-content">
                            <div className="toggle-row">
                                <span>Email Notifications</span>
                                <input type="checkbox" className="toggle" defaultChecked />
                            </div>
                            <div className="toggle-row">
                                <span>Order Alerts</span>
                                <input type="checkbox" className="toggle" defaultChecked />
                            </div>
                            <div className="toggle-row">
                                <span>Delivery Updates</span>
                                <input type="checkbox" className="toggle" defaultChecked />
                            </div>
                        </div>
                    </Card>
                </motion.div>

                {/* Security Card */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.4 }}>
                    <Card className="settings-card">
                        <div className="settings-header">
                            <div className="settings-icon security"><Shield size={24} /></div>
                            <div>
                                <h3>Security</h3>
                                <p>Protect your account</p>
                            </div>
                        </div>
                        <div className="settings-content">
                            {passwordNote ? (
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                    Password change is handled by your system administrator.
                                </p>
                            ) : (
                                <Button variant="secondary" fullWidth onClick={() => setPasswordNote(true)}>
                                    Change Password
                                </Button>
                            )}
                        </div>
                    </Card>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Settings;
