import { Outlet, Link, useLocation } from 'react-router-dom';
import { PawPrint, LogIn } from 'lucide-react';
import Button from '../common/Button';
import './PublicLayout.css';

const PublicLayout = () => {
    const location = useLocation();

    return (
        <div className="public-layout">
            <nav className="public-navbar">
                <div className="container navbar-content">
                    <Link to="/" className="navbar-brand">
                        <div className="brand-icon">
                            <PawPrint size={24} color="white" />
                        </div>
                        <span className="brand-text">PetShop</span>
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

                    <div className="navbar-actions">
                        <Link to="/login">
                            <Button variant="secondary" size="sm" icon={<LogIn size={16} />}>
                                Admin Login
                            </Button>
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
