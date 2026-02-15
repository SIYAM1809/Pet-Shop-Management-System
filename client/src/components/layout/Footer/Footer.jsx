import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Cat, Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin, Send } from 'lucide-react';
import './Footer.css';

const Footer = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubscribe = async (e) => {
        e.preventDefault();
        setLoading(true);

        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

        try {
            const res = await fetch(`${API_URL}/subscribers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            const data = await res.json();

            if (data.success) {
                toast.success(data.message);
                setEmail('');
            } else {
                toast.error(data.message || 'Subscription failed');
            }
        } catch (error) {
            console.error('Subscription error:', error);
            toast.error('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    {/* Brand Section */}
                    <div className="footer-section brand-section">
                        <div className="footer-brand">
                            <Cat size={24} className="text-primary-600" />
                            <span className="brand-text">Siyam's Praniseba</span>
                        </div>
                        <p className="footer-description">
                            Connecting pets with loving homes. We prioritize the well-being and happiness of every animal, providing comprehensive care solutions.
                        </p>
                        <div className="social-links">
                            <a href="#" className="social-link" aria-label="Facebook"><Facebook size={20} /></a>
                            <a href="#" className="social-link" aria-label="Instagram"><Instagram size={20} /></a>
                            <a href="#" className="social-link" aria-label="Twitter"><Twitter size={20} /></a>
                            <a href="#" className="social-link" aria-label="LinkedIn"><Linkedin size={20} /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="footer-section">
                        <h4 className="footer-title">Quick Links</h4>
                        <div className="footer-links">
                            <Link to="/" className="footer-link">Home</Link>
                            <Link to="/browse" className="footer-link">Browse Pets</Link>
                            <Link to="/track" className="footer-link">Track Order</Link>
                            <Link to="/about" className="footer-link">About Us</Link>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="footer-section">
                        <h4 className="footer-title">Contact Us</h4>
                        <div className="contact-info">
                            <div className="contact-item">
                                <MapPin size={18} className="contact-icon" />
                                <span>Prembagan, Kosaibari, Uttara, Dhaka-1230</span>
                            </div>
                            <div className="contact-item">
                                <Phone size={18} className="contact-icon" />
                                <span>+880 130 405 4566</span>
                            </div>
                            <div className="contact-item">
                                <Mail size={18} className="contact-icon" />
                                <span>support@praniseba.com</span>
                            </div>
                        </div>
                    </div>

                    {/* Newsletter */}
                    <div className="footer-section newsletter-section">
                        <h4 className="footer-title">Stay Updated</h4>
                        <p className="newsletter-text">Subscribe to our newsletter for new arrivals and pet care tips.</p>
                        <form className="newsletter-form" onSubmit={handleSubscribe}>
                            <div className="input-group">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="newsletter-input"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <button type="submit" className="newsletter-btn" aria-label="Subscribe" disabled={loading}>
                                    <Send size={18} />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} Siyam's Praniseba. All rights reserved.</p>
                    <div className="footer-legal">
                        <Link to="/privacy">Privacy Policy</Link>
                        <Link to="/terms">Terms of Service</Link>
                    </div>
                    <p className="footer-credit">Designed & Developed by <span className="credit-name">Siyam</span></p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
