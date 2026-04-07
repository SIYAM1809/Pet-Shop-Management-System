import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, PawPrint, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/api';
import toast from 'react-hot-toast';
import './CustomerAuthModal.css';

const CustomerAuthModal = ({ isOpen, onClose }) => {
    const [mode, setMode] = useState('login'); // 'login' | 'signup'
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const { login } = useAuth();

    const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (mode === 'login') {
                await login(formData.email, formData.password);
                toast.success(`Welcome back, ${formData.email.split('@')[0]}! 🐾`);
            } else {
                if (formData.password.length < 6) {
                    toast.error('Password must be at least 6 characters');
                    setLoading(false);
                    return;
                }
                const data = await authAPI.customerRegister({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                });
                // Manually set auth state since we bypassed the context login
                localStorage.setItem('token', data.token);
                window.location.reload(); // Refresh to re-init AuthContext with new token
                toast.success(`Welcome, ${data.user.name}! 🐾`);
            }
            onClose();
        } catch (err) {
            toast.error(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const switchMode = () => {
        setMode(m => m === 'login' ? 'signup' : 'login');
        setFormData({ name: '', email: '', password: '' });
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="auth-modal-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={(e) => e.target === e.currentTarget && onClose()}
            >
                <motion.div
                    className="auth-modal-card"
                    initial={{ opacity: 0, y: -30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                >
                    {/* Header */}
                    <div className="auth-modal-header">
                        <div className="auth-modal-logo">
                            <PawPrint size={22} />
                        </div>
                        <div>
                            <h2 className="auth-modal-title">
                                {mode === 'login' ? 'Welcome back!' : 'Create account'}
                            </h2>
                            <p className="auth-modal-subtitle">
                                {mode === 'login' ? 'Sign in to track orders & manage cart' : 'Join Siyam\'s Praniseba today'}
                            </p>
                        </div>
                        <button className="auth-modal-close" onClick={onClose} aria-label="Close">
                            <X size={18} />
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="auth-tabs">
                        <button
                            className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
                            onClick={() => setMode('login')}
                        >
                            Login
                        </button>
                        <button
                            className={`auth-tab ${mode === 'signup' ? 'active' : ''}`}
                            onClick={() => setMode('signup')}
                        >
                            Sign Up
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="auth-modal-form">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={mode}
                                initial={{ opacity: 0, x: mode === 'signup' ? 20 : -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.18 }}
                            >
                                {mode === 'signup' && (
                                    <div className="auth-field">
                                        <label className="auth-label">Full Name</label>
                                        <div className="auth-input-wrap">
                                            <User size={16} className="auth-input-icon" />
                                            <input
                                                className="auth-input"
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                placeholder="John Doe"
                                                required
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="auth-field">
                                    <label className="auth-label">Email Address</label>
                                    <div className="auth-input-wrap">
                                        <Mail size={16} className="auth-input-icon" />
                                        <input
                                            className="auth-input"
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="you@example.com"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="auth-field">
                                    <label className="auth-label">Password</label>
                                    <div className="auth-input-wrap">
                                        <Lock size={16} className="auth-input-icon" />
                                        <input
                                            className="auth-input"
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="••••••••"
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="auth-eye-btn"
                                            onClick={() => setShowPassword(p => !p)}
                                        >
                                            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        <button
                            type="submit"
                            className="auth-submit-btn"
                            disabled={loading}
                        >
                            {loading
                                ? <span className="auth-spinner" />
                                : mode === 'login' ? 'Sign In' : 'Create Account'
                            }
                        </button>
                    </form>

                    <p className="auth-modal-footer">
                        {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                        <button className="auth-switch-btn" onClick={switchMode} type="button">
                            {mode === 'login' ? 'Sign Up' : 'Login'}
                        </button>
                    </p>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default CustomerAuthModal;
