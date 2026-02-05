import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, User, Bell, Shield, Palette, Users, Plus, Trash2 } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { containerVariants, itemVariants } from '../../utils/animations';
import { authAPI } from '../../services/api';
import toast from 'react-hot-toast';
import './Settings.css';

const Settings = () => {
    const { theme, toggleTheme } = useTheme();
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const [addUserForm, setAddUserForm] = useState({ name: '', email: '', password: '', role: 'staff' });
    const [addingUser, setAddingUser] = useState(false);

    useEffect(() => {
        if (user?.role?.toLowerCase() === 'admin') {
            fetchUsers();
        }
    }, [user]);

    const fetchUsers = async () => {
        setLoadingUsers(true);
        try {
            const response = await authAPI.getUsers();
            setUsers(response.data);
        } catch (error) {
            console.error('Failed to fetch users', error);
        } finally {
            setLoadingUsers(false);
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        setAddingUser(true);
        try {
            await authAPI.register(addUserForm);
            toast.success('Staff member added successfully');
            setShowAddUserModal(false);
            setAddUserForm({ name: '', email: '', password: '', role: 'staff' });
            fetchUsers();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add user');
        } finally {
            setAddingUser(false);
        }
    };

    return (
        <motion.div className="settings-page" variants={containerVariants} initial="hidden" animate="visible">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Settings</h1>
                    <p className="page-subtitle">Manage your account and preferences</p>
                </div>
            </div>

            <div className="settings-grid">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                >
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

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                >
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

                {user?.role?.toLowerCase() === 'admin' && (
                    <motion.div
                        className="full-width-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.3 }}
                    >
                        <Card className="settings-card">
                            <div className="settings-header">
                                <div className="settings-icon staff"><Users size={24} /></div>
                                <div>
                                    <h3>Staff Management</h3>
                                    <p>Manage system access for employees</p>
                                </div>
                                <Button
                                    size="sm"
                                    variant="primary"
                                    icon={<Plus size={16} />}
                                    onClick={() => setShowAddUserModal(true)}
                                    style={{ marginLeft: 'auto' }}
                                >
                                    Add Staff
                                </Button>
                            </div>
                            <div className="settings-content">
                                {loadingUsers ? (
                                    <div className="loading-spinner">Loading users...</div>
                                ) : (
                                    <div className="users-list">
                                        {users.map(u => (
                                            <div key={u._id} className="user-item">
                                                <div className="user-item-info">
                                                    <div className="avatar avatar-sm">{u.name.charAt(0)}</div>
                                                    <div>
                                                        <p className="user-item-name">{u.name}</p>
                                                        <p className="user-item-email">{u.email}</p>
                                                    </div>
                                                </div>
                                                <span className={`badge badge-${u.role === 'admin' ? 'primary' : 'secondary'}`}>
                                                    {u.role}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </Card>
                    </motion.div>
                )}

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                >
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
                        </div>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 }}
                >
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
                        </div>
                    </Card>
                </motion.div>
            </div>

            <Modal
                isOpen={showAddUserModal}
                onClose={() => setShowAddUserModal(false)}
                title="Add New Staff Member"
            >
                <form onSubmit={handleAddUser} className="add-user-form">
                    <Input
                        label="Full Name"
                        value={addUserForm.name}
                        onChange={(e) => setAddUserForm({ ...addUserForm, name: e.target.value })}
                        required
                    />
                    <Input
                        label="Email Address"
                        type="email"
                        value={addUserForm.email}
                        onChange={(e) => setAddUserForm({ ...addUserForm, email: e.target.value })}
                        required
                    />
                    <Input
                        label="Password"
                        type="password"
                        value={addUserForm.password}
                        onChange={(e) => setAddUserForm({ ...addUserForm, password: e.target.value })}
                        required
                    />
                    <div className="input-group">
                        <label className="input-label">Role</label>
                        <select
                            className="input select"
                            value={addUserForm.role}
                            onChange={(e) => setAddUserForm({ ...addUserForm, role: e.target.value })}
                        >
                            <option value="staff">Staff</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <div className="modal-actions">
                        <Button type="button" variant="secondary" onClick={() => setShowAddUserModal(false)}>Cancel</Button>
                        <Button type="submit" variant="primary" loading={addingUser}>Create Account</Button>
                    </div>
                </form>
            </Modal>
        </motion.div>
    );
};

export default Settings;
