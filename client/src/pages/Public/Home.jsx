import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Heart, Shield, Award } from 'lucide-react';
import Button from '../../components/common/Button';
import './Public.css';

const Home = () => {
    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="container hero-content">
                    <motion.div
                        className="hero-text"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1>Find Your New Best Friend</h1>
                        <p>
                            We connect loving families with happy, healthy pets.
                            Browse our available companions and find the perfect addition to your home today.
                        </p>
                        <div className="hero-actions">
                            <Link to="/browse">
                                <Button variant="primary" size="lg" icon={<ArrowRight size={20} />}>
                                    Browse Pets
                                </Button>
                            </Link>
                            <Link to="/browse">
                                <Button variant="secondary" size="lg">
                                    Learn More
                                </Button>
                            </Link>

                        </div>
                    </motion.div>
                    <motion.div
                        className="hero-image"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <img
                            src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                            alt="Happy dog"
                        />
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="container">
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">
                                <Heart size={32} />
                            </div>
                            <h3>Healthy & Happy</h3>
                            <p>All our pets are fully vaccinated, health-checked, and raised with love.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">
                                <Shield size={32} />
                            </div>
                            <h3>Lifetime Support</h3>
                            <p>We provide ongoing advice and separate 24/7 support for all new pet parents.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">
                                <Award size={32} />
                            </div>
                            <h3>Certified Breeders</h3>
                            <p>We verify every breeder to ensure ethical practices and pure lineages.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
