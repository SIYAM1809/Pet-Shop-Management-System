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
                    <p>&copy; {new Date().getFullYear()} PetShop Management System. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default PublicLayout;
