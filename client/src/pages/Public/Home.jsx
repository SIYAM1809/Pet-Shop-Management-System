import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Shield, Star } from 'lucide-react';
import Button from '../../components/common/Button';
import './Public.css';
import { useState, useEffect } from 'react';
import { petAPI } from '../../services/api';
import { PawPrint } from 'lucide-react';
import InquiryModal from '../../components/common/InquiryModal';
import TestimonialsSection from '../../components/home/TestimonialsSection';
import AppointmentModal from '../../components/common/AppointmentModal';

const Home = () => {
    const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);

    return (
        <div className="home-page">
            <AppointmentModal
                isOpen={appointmentModalOpen}
                onClose={() => setAppointmentModalOpen(false)}
            />
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
                                    Checkout your Companions
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
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                    >
                        <div className="hero-image-card">
                            <img
                                src="https://images.unsplash.com/photo-1623387641168-d9803ddd3f35?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                alt="Cats and Dogs Playing"
                                className="hero-img"
                            />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Featured Pets Section */}
            <section className="featured-pets-section" style={{ padding: '80px 0', background: 'var(--bg-secondary)' }}>
                <div className="container">
                    <div className="section-header text-center">
                        <h2 className="gradient-text">New Arrivals</h2>
                        <p>Meet our newest companions looking for a home</p>
                    </div>

                    <FeaturedPetsList />

                    <div className="text-center" style={{ marginTop: '40px' }}>
                        <Link to="/browse">
                            <Button variant="outline" size="lg">View All Pets</Button>
                        </Link>
                    </div>
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

            {/* Testimonials Section */}
            <TestimonialsSection />

            {/* Location & Map Section */}
            <section className="location-section" style={{ padding: '80px 0', background: 'var(--bg-primary)' }}>
                <div className="container">
                    <div className="section-header text-center">
                        <h2 className="gradient-text">Visit Our Store</h2>
                        <p>Come meet your new best friend in person</p>
                    </div>

                    <div className="map-container" style={{
                        borderRadius: '24px',
                        overflow: 'hidden',
                        boxShadow: 'var(--shadow-lg)',
                        height: '450px',
                        position: 'relative',
                        border: '1px solid var(--border-light)'
                    }}>
                        <iframe
                            src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=Prembagan,kosaibari,Uttrar,Dhaka-1230&amp;t=&amp;z=15&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                        ></iframe>

                        <div className="location-card" style={{
                            position: 'absolute',
                            top: '30px',
                            right: '30px',
                            left: 'auto', // Ensure left is unset
                            background: 'rgba(255, 255, 255, 0.95)',
                            padding: '25px',
                            borderRadius: '16px',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                            maxWidth: '300px',
                            backdropFilter: 'blur(10px)'
                        }}>
                            <h3 style={{ margin: '0 0 10px 0', color: 'var(--primary-600)' }}>Siyam's Praniseba</h3>
                            <p style={{ margin: '0 0 5px 0', color: '#334155' }}><strong>Address:</strong><br />Prembagan, kosaibari, Uttrar, Dhaka-1230</p>
                            <p style={{ margin: '15px 0 5px 0', color: '#334155' }}><strong>Hours:</strong><br />Mon-Sat: 9am - 8pm<br />Sun: 10am - 6pm</p>
                            <p style={{ margin: '15px 0 0 0', color: '#334155' }}><strong>Contact:</strong><br />01304054566</p>

                            <div style={{ marginTop: '20px' }}>
                                <Button size="sm" fullWidth onClick={() => setAppointmentModalOpen(true)}>
                                    Book a Visit
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

const FeaturedPetsList = () => {
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [inquiryPet, setInquiryPet] = useState(null);
    const [inquiryModalOpen, setInquiryModalOpen] = useState(false);

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const response = await petAPI.getAll({ limit: 0, status: 'Available' });
                setPets(response.data);
            } catch (error) {
                console.error("Failed to fetch featured pets");
            } finally {
                setLoading(false);
            }
        };
        fetchFeatured();
    }, []);

    const handleInquire = (pet) => {
        setInquiryPet(pet);
        setInquiryModalOpen(true);
    };

    if (loading) return <div className="text-center"><div className="spinner" /></div>;

    if (pets.length === 0) return null;

    return (
        <>
            <div className="featured-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                {pets.map((pet, index) => (
                    <motion.div
                        key={pet._id}
                        className="public-pet-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        style={{ background: 'var(--surface)', borderRadius: '16px', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}
                    >
                        <div className="pet-image-container" style={{ height: '240px', position: 'relative', overflow: 'hidden' }}>
                            {pet.image ? (
                                <img src={pet.image} alt={pet.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => e.target.style.display = 'none'} />
                            ) : (
                                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9' }}>
                                    <PawPrint size={48} color="#cbd5e1" />
                                </div>
                            )}
                            <div style={{ position: 'absolute', top: '15px', right: '15px', background: 'rgba(255,255,255,0.9)', padding: '5px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600', color: 'var(--primary-600)' }}>
                                {pet.species}
                            </div>
                        </div>
                        <div className="pet-content" style={{ padding: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>{pet.name}</h3>
                                <span style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--primary-600)' }}>${pet.price}</span>
                            </div>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '15px' }}>{pet.breed} • {pet.gender}</p>
                            <Button size="sm" variant="primary" fullWidth onClick={() => handleInquire(pet)}>Inquire Now</Button>
                        </div>
                    </motion.div>
                ))}
            </div>
            <InquiryModal
                isOpen={inquiryModalOpen}
                onClose={() => setInquiryModalOpen(false)}
                pet={inquiryPet}
            />
        </>
    );
};

export default Home;
