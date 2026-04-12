import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ShoppingCart, LogIn, LogOut, User, Package } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import CustomerAuthModal from '../common/CustomerAuthModal';
import CartDrawer from '../common/CartDrawer';
import WhatsAppButton from '../common/WhatsAppButton';
import Footer from './Footer/Footer';
import './PublicLayout.css';

const PublicLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isScrolled, setIsScrolled] = useState(false);
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

    const { isAuthenticated, user, logout } = useAuth();
    const { cartCount } = useCart();

    // Only show as "customer" in public nav — admin/staff have their own dashboard
    const isCustomer = isAuthenticated && user?.role === 'customer';

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="public-layout">
            <nav className={`public-navbar ${isScrolled ? 'scrolled' : ''}`}>
                <div className="container navbar-content">
                    {/* Brand */}
                    <Link to="/" className="navbar-brand">
                        <div className="brand-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <img src="/logo.png" alt="Siyam's Praniseba Logo" style={{ height: '52px', width: 'auto', objectFit: 'contain' }} />
                        </div>
                        <span className="brand-text gradient-text" style={{ fontSize: '1.5rem', fontWeight: '800', marginLeft: '5px' }}>Siyam's Praniseba</span>
                    </Link>

                    {/* Nav Links */}
                    <div className="navbar-links">
                        <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
                            Home
                        </Link>
                        <Link to="/browse" className={`nav-link ${location.pathname === '/browse' ? 'active' : ''}`}>
                            Browse Pets
                        </Link>
                        <Link to="/accessories" className={`nav-link ${location.pathname.startsWith('/accessories') ? 'active' : ''}`}>
                            Accessories
                        </Link>

                        {/* Track Order — only for logged-in customers */}
                        {isCustomer && (
                            <Link to="/track" className={`nav-link ${location.pathname === '/track' ? 'active' : ''}`}>
                                Track Order
                            </Link>
                        )}
                    </div>

                    {/* Right side — Auth + Cart */}
                    <div className="navbar-auth-area">
                        {isAuthenticated ? (
                            isCustomer ? (
                                <>
                                    {/* Cart button */}
                                    <button
                                        className="navbar-cart-btn"
                                        onClick={() => setCartDrawerOpen(true)}
                                        aria-label="Open cart"
                                    >
                                        <ShoppingCart size={18} />
                                        {cartCount > 0 && (
                                            <span className="cart-badge">{cartCount}</span>
                                        )}
                                    </button>

                                    {/* User chip */}
                                    <div className="navbar-user-chip">
                                        <User size={14} />
                                        <span>{user.name.split(' ')[0]}</span>
                                    </div>

                                    {/* Logout */}
                                    <button className="navbar-logout-btn" onClick={handleLogout} title="Logout">
                                        <LogOut size={15} />
                                        <span>Logout</span>
                                    </button>
                                </>
                            ) : (
                                <>
                                    {/* Dashboard link for admin/staff */}
                                    <Link to="/dashboard" className="navbar-login-btn" style={{ textDecoration: 'none', background: 'var(--primary-50)', color: 'var(--primary-600)', border: '1px solid var(--primary-200)' }}>
                                        <User size={15} />
                                        <span>Admin Dashboard</span>
                                    </Link>
                                    <button className="navbar-logout-btn" onClick={handleLogout} title="Logout">
                                        <LogOut size={15} />
                                    </button>
                                </>
                            )
                        ) : (
                            <button
                                className="navbar-login-btn"
                                onClick={() => setAuthModalOpen(true)}
                                id="customer-login-btn"
                            >
                                <LogIn size={15} />
                                <span>Login / Sign Up</span>
                            </button>
                        )}
                    </div>
                </div>
            </nav>

            <main className="public-content">
                <Outlet />
            </main>

            <WhatsAppButton />
            <Footer />

            {/* Modals */}
            <CustomerAuthModal
                isOpen={authModalOpen}
                onClose={() => setAuthModalOpen(false)}
            />
            <CartDrawer
                isOpen={cartDrawerOpen}
                onClose={() => setCartDrawerOpen(false)}
            />
        </div>
    );
};

export default PublicLayout;
