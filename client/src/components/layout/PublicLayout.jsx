import { Outlet, Link, useLocation } from 'react-router-dom';
import { Cat, LogIn } from 'lucide-react';
import Button from '../common/Button';
import WhatsAppButton from '../common/WhatsAppButton';
import Footer from './Footer/Footer';
import './PublicLayout.css';
import { useState, useEffect } from 'react';

const PublicLayout = () => {
    const location = useLocation();
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className="public-layout">

            <nav className={`public-navbar ${isScrolled ? 'scrolled' : ''}`}>
                <div className="container navbar-content">
                    <Link to="/" className="navbar-brand">
                        <div className="brand-icon" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)', padding: '8px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Cat size={24} color="white" />
                        </div>
                        <span className="brand-text gradient-text" style={{ fontSize: '1.5rem', fontWeight: '800', marginLeft: '10px' }}>Siyam's Praniseba</span>
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
                        <Link
                            to="/track"
                            className={`nav-link ${location.pathname === '/track' ? 'active' : ''}`}
                        >
                            Track Order
                        </Link>
                    </div>

                </div>
            </nav>

            <main className="public-content">
                <Outlet />
            </main>

            <WhatsAppButton />

            <Footer />
        </div >
    );
};

export default PublicLayout;
