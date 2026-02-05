import { motion } from 'framer-motion';
import { Sun, Moon, User, Bell, Shield, Palette } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { containerVariants, itemVariants } from '../../utils/animations';
import './Settings.css';

const Settings = () => {
    const { theme, toggleTheme } = useTheme();
    const { user } = useAuth();

    return (
        <motion.div className="settings-page" variants={containerVariants} initial="hidden" animate="visible">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Settings</h1>
                    <p className="page-subtitle">Manage your account and preferences</p>
                </div>
            </div>

            <div className="settings-grid">
                <motion.div variants={itemVariants}>
                    <Card className="settings-card">
                        <div className="settings-header">
                            <div className="settings-icon"><User size={24} /></div>
                            <div>
                                <h3>Profile</h3>
                                <p>Manage your account information</p>
                            </div>
                        </div>
                        <div className="settings-content">
                            <div className="profile-info">
                                <div className="avatar avatar-lg">{user?.name?.charAt(0) || 'U'}</div>
                                <div>
                                    <h4>{user?.name || 'User'}</h4>
                                    <p>{user?.email || 'user@example.com'}</p>
                                    <span className="badge badge-info">{user?.role || 'Staff'}</span>
                                </div>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
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

                <motion.div variants={itemVariants}>
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
                                <span>Low Stock Alerts</span>
                                <input type="checkbox" className="toggle" />
                            </div>
                        </div>
                    </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <Card className="settings-card">
                        <div className="settings-header">
                            <div className="settings-icon security"><Shield size={24} /></div>
                            <div>
                                <h3>Security</h3>
                                <p>Protect your account</p>
                            </div>
                        </div>
                        <div className="settings-content">
                            <Button variant="secondary" fullWidth>Change Password</Button>
                            <Button variant="ghost" fullWidth style={{ marginTop: 'var(--space-3)' }}>Enable Two-Factor Auth</Button>
                        </div>
                    </Card>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Settings;
