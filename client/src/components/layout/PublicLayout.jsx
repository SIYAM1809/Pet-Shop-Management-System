import { Outlet, Link, useLocation } from 'react-router-dom';
import { Cat, LogIn } from 'lucide-react'; // Changed import to Cat
import Button from '../common/Button';
import './PublicLayout.css';

const PublicLayout = () => {
    const location = useLocation();

    return (
        <div className="public-layout">
            <nav className="public-navbar">
                <div className="container navbar-content">
                    <Link to="/" className="navbar-brand">
                        <div className="brand-icon" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)', padding: '8px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Cat size={24} color="white" />
                        </div>
                        <span className="brand-text gradient-text" style={{ fontSize: '1.5rem', fontWeight: '800', marginLeft: '10px' }}>Praniseba</span>
                    </Link>

                    <div className="navbar-links">
                        <Link
                            to="/"
                            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                        >
                            Home
                        </Link>
                        <Link
                            to="/browse"
                            className={`nav-link ${location.pathname === '/browse' ? 'active' : ''}`}
                        >
                            Browse Pets
                        </Link>
                    </div>

                </div>
            </nav>

            <main className="public-content">
                <Outlet />
            </main>

            <footer className="public-footer">
                <div className="container">
                    <div className="footer-content">
                        <div className="footer-brand-section">
                            <div className="footer-brand">
                                <Cat size={24} className="text-primary-600" />
                                <span className="brand-text">Praniseba</span>
                            </div>
                            <p className="footer-tagline">
                                Connecting pets with loving homes. We prioritize the well-being and happiness of every animal.
                            </p>
                        </div>

                        <div className="footer-links">
                            <div className="footer-column">
                                <h4>Quick Links</h4>
                                <Link to="/">Home</Link>
                                <Link to="/browse">Browse Pets</Link>
                                <Link to="/about">About Us</Link>
                            </div>
                            <div className="footer-column">
                                <h4>Support</h4>
                                <Link to="/contact">Contact</Link>
                                <Link to="/faq">FAQ</Link>
                                <Link to="/privacy">Privacy Policy</Link>
                            </div>
                        </div>
                    </div>

                    <div className="footer-bottom">
                        <p>&copy; {new Date().getFullYear()} Praniseba. All rights reserved.</p>
                        <p className="footer-credit">Designed & Developed by <span className="credit-name">Siyam</span></p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default PublicLayout;
