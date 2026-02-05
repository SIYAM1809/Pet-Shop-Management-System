import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Heart, Shield, Star, CheckCircle } from 'lucide-react';
import Button from '../../components/common/Button';
import './Public.css';

const Home = () => {
    return (
        <div className="home-page">
            {/* Premium Hero Section */}
            <section className="hero-section">
                <div className="container hero-content">
                    <motion.div
                        className="hero-text"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <div className="hero-badge">
                            <Star size={14} fill="#f59e0b" stroke="#f59e0b" />
                            <span>#1 Trusted Pet Shop</span>
                        </div>
                        <h1 className="hero-title">
                            Find Your Perfect <br />
                            <span className="gradient-text">Companion Today</span>
                        </h1>
                        <p className="hero-subtitle">
                            We don't just sell pets; we match souls. Browse our carefully vetted,
                            health-checked companions ready to fill your home with joy.
                        </p>

                        <div className="hero-actions">
                            <Link to="/browse">
                                <Button className="btn-premium-primary" size="lg">
                                    Lets Checkout The Pets
                                    <ArrowRight size={20} />
                                </Button>
                            </Link>
                            <div className="hero-stat">
                                <div className="avatars">
                                    <div className="avatar ring-2 ring-white"><img src="https://i.pravatar.cc/100?img=1" alt="User" /></div>
                                    <div className="avatar ring-2 ring-white"><img src="https://i.pravatar.cc/100?img=5" alt="User" /></div>
                                    <div className="avatar ring-2 ring-white"><img src="https://i.pravatar.cc/100?img=8" alt="User" /></div>
                                </div>
                                <span><strong>500+</strong> Happy Families</span>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        className="hero-image-wrapper"
                        initial={{ opacity: 0, scale: 0.9, rotate: 5 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                    >
                        <div className="hero-image-card">
                            <img
                                src="https://images.unsplash.com/photo-1560743641-3914f2c45636?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                alt="Happy Dog"
                                className="hero-img"
                            />
                            <div className="floating-card top-right">
                                <Heart size={20} fill="#ef4444" stroke="#ef4444" />
                                <span>100% Health Guarantee</span>
                            </div>
                            <div className="floating-card bottom-left">
                                <CheckCircle size={20} className="text-success" />
                                <span>Vaccinated & Chipped</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Value Proposition */}
            <section className="features-section">
                <div className="container">
                    <div className="section-header text-center">
                        <h2>Why Choose Us?</h2>
                        <p>We set the standard for ethical pet adoption</p>
                    </div>

                    <div className="features-grid">
                        <div className="feature-card premium-card">
                            <div className="feature-icon-wrapper icon-heart">
                                <Heart size={28} />
                            </div>
                            <h3>Ethical Sourcing</h3>
                            <p>We strictly partner with certified breeders who prioritize animal welfare above all else.</p>
                        </div>
                        <div className="feature-card premium-card">
                            <div className="feature-icon-wrapper icon-shield">
                                <Shield size={28} />
                            </div>
                            <h3>Health Assurance</h3>
                            <p>Every pet comes with a comprehensive vet check, vaccinations, and a 1-year genetic health guarantee.</p>
                        </div>
                        <div className="feature-card premium-card">
                            <div className="feature-icon-wrapper icon-star">
                                <Star size={28} />
                            </div>
                            <h3>Lifetime Support</h3>
                            <p>Our relationship doesn't end at checkout. Access 24/7 expert advice for your pet's entire life.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
