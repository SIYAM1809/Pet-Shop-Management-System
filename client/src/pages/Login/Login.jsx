import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, PawPrint } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import toast from 'react-hot-toast';
import './Login.css';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const { login, register } = useAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isLogin) {
                await login(formData.email, formData.password);
                toast.success('Welcome back!');
            } else {
                await register(formData.name, formData.email, formData.password);
                toast.success('Account created successfully!');
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-background">
                <div className="bg-gradient-1" />
                <div className="bg-gradient-2" />
                <div className="bg-pattern" />
            </div>

            <motion.div
                className="login-container"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="login-card">
                    <motion.div
                        className="login-header"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="login-logo">
                            <PawPrint size={32} />
                        </div>
                        <h1 className="login-title">Pet Shop Manager</h1>
                        <p className="login-subtitle">
                            {isLogin ? 'Sign in to your account' : 'Create a new account'}
                        </p>
                    </motion.div>

                    <motion.form
                        className="login-form"
                        onSubmit={handleSubmit}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        {!isLogin && (
                            <Input
                                label="Full Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="John Doe"
                                required
                            />
                        )}
                        <Input
                            label="Email Address"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            icon={<Mail size={18} />}
                            required
                        />
                        <Input
                            label="Password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            icon={<Lock size={18} />}
                            required
                        />

                        {isLogin && (
                            <div className="login-options">
                                <label className="remember-me">
                                    <input type="checkbox" />
                                    <span>Remember me</span>
                                </label>
                                <a href="#" className="forgot-link">Forgot password?</a>
                            </div>
                        )}

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            fullWidth
                            loading={loading}
                        >
                            {isLogin ? 'Sign In' : 'Create Account'}
                        </Button>
                    </motion.form>

                    <div className="login-footer">
                        <span>
                            {isLogin ? "Don't have an account?" : 'Already have an account?'}
                        </span>
                        <button
                            className="switch-mode-btn"
                            onClick={() => setIsLogin(!isLogin)}
                        >
                            {isLogin ? 'Sign up' : 'Sign in'}
                        </button>
                    </div>

                    <div className="demo-credentials">
                        <p>Demo Credentials:</p>
                        <code>admin@petshop.com / admin123</code>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
