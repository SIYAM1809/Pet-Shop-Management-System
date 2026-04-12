import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Shield, Star, ShoppingBag, ArrowRight, ShoppingCart } from 'lucide-react';
import Button from '../../components/common/Button';
import './Public.css';
import { useState, useEffect } from 'react';
import { petAPI, productAPI } from '../../services/api';
import { Package, PawPrint } from 'lucide-react';
import InquiryModal from '../../components/common/InquiryModal';
import CustomerAuthModal from '../../components/common/CustomerAuthModal';
import TestimonialsSection from '../../components/home/TestimonialsSection';
import AppointmentModal from '../../components/common/AppointmentModal';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

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
                            <Button variant="primary" size="lg">Meet all pets</Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── Accessories Showcase Section ── */}
            <FeaturedAccessoriesSection />

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
    const [authModalOpen, setAuthModalOpen] = useState(false);

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

    const chunk1Size = Math.ceil(pets.length / 3);
    const chunk2Size = Math.ceil((pets.length - chunk1Size) / 2);

    const line1Pets = pets.slice(0, chunk1Size);
    const line2Pets = pets.slice(chunk1Size, chunk1Size + chunk2Size);
    const line3Pets = pets.slice(chunk1Size + chunk2Size);

    // Helper to ensure the track has enough pets to span a large screen
    const getSeamlessList = (list) => {
        if (!list.length) return [];
        let repeated = [...list];
        // Repeat until array is reasonably long (prevent breaking on 1920px+ widths and small pet counts)
        while (repeated.length < 8) {
            repeated = [...repeated, ...list];
        }
        return [...repeated, ...repeated];
    };

    const doubled1 = getSeamlessList(line1Pets);
    const doubled2 = getSeamlessList(line2Pets);
    const doubled3 = getSeamlessList(line3Pets);

    const renderTrack = (doubledList, directionClass, lineIndex) => {
        if (!doubledList.length) return null;
        return (
            <div className={`home-marquee-track ${directionClass}`}>
                {doubledList.map((pet, index) => (
                    <div key={`${pet._id}-line${lineIndex}-${index}`} className="home-marquee-card-wrapper">
                        <div
                            className="public-pet-card"
                            style={{ background: 'var(--surface)', borderRadius: '16px', overflow: 'hidden', boxShadow: 'var(--shadow-md)', height: '100%', display: 'flex', flexDirection: 'column' }}
                        >
                            <div className="pet-image-container" style={{ height: '180px', position: 'relative', overflow: 'hidden' }}>
                                {pet.image ? (
                                    <img src={pet.image} alt={pet.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => e.target.style.display = 'none'} />
                                ) : (
                                    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9' }}>
                                        <PawPrint size={40} color="#cbd5e1" />
                                    </div>
                                )}
                                <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(255,255,255,0.9)', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600', color: 'var(--primary-600)' }}>
                                    {pet.species}
                                </div>
                            </div>
                            <div className="pet-content" style={{ padding: '15px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 0 8px 0' }}>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>{pet.name}</h3>
                                    <span style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--primary-600)' }}>${pet.price}</span>
                                </div>
                                <p style={{ color: 'var(--text-secondary)', marginBottom: '10px', fontSize: '0.85rem' }}>{pet.breed} • {pet.gender}</p>
                                <div style={{ marginTop: 'auto' }}>
                                    <Button size="sm" variant="primary" fullWidth onClick={() => handleInquire(pet)} style={{ padding: '6px' }}>Inquire Now</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <>
            <div className="home-marquee-wrapper">
                <div className="home-marquee-tracks-container">
                    {renderTrack(doubled1, "home-marquee-track-rtl", 1)}
                    {renderTrack(doubled2, "home-marquee-track-ltr", 2)}
                    {renderTrack(doubled3, "home-marquee-track-rtl", 3)}
                </div>
            </div>
            <InquiryModal
                isOpen={inquiryModalOpen}
                onClose={() => setInquiryModalOpen(false)}
                pet={inquiryPet}
                onLoginRequired={() => setAuthModalOpen(true)}
            />
            <CustomerAuthModal
                isOpen={authModalOpen}
                onClose={() => setAuthModalOpen(false)}
            />
        </>
    );
};

export default Home;

// ─────────────────────────────────────────────
// FeaturedAccessoriesSection component
// ─────────────────────────────────────────────
const animalEmoji = { 'Dog': '🐕', 'Cat': '🐈', 'Bird': '🦜', 'Fish': '🐠', 'Rabbit': '🐇', 'Small Animal': '🐹', 'Reptile': '🦎', 'All Pets': '🐾' };

const FeaturedAccessoriesSection = () => {
    const { isAuthenticated, user } = useAuth();
    const { addToCart, cartItems } = useCart();
    const isCustomer = isAuthenticated && user?.role === 'customer';

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [authModalOpen, setAuthModalOpen] = useState(false);

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                // Try featured first, fall back to latest 4
                const res = await productAPI.getFeatured();
                if (res.data && res.data.length > 0) {
                    setProducts(res.data.slice(0, 4));
                } else {
                    const fallback = await productAPI.getAll({ limit: 4, status: 'Active' });
                    setProducts(fallback.data || []);
                }
            } catch {
                // Silently fail — section just won't show
            } finally {
                setLoading(false);
            }
        };
        fetchFeatured();
    }, []);

    // Don't render the section at all if no products
    if (!loading && products.length === 0) return null;

    const handleAddToCart = (e, product) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isCustomer) { setAuthModalOpen(true); return; }
        addToCart({ ...product, itemType: 'accessory' });
        toast.success(`${product.name} added to cart! 🛒`);
    };

    const isInCart = (id) => cartItems.some(item => item._id === id);

    return (
        <>
            <section className="home-accessories-section">
                <div className="container">
                    {/* Section Header */}
                    <div className="home-acc-header">
                        <div>
                            <span className="home-acc-badge"><ShoppingBag size={14} /> Shop Accessories</span>
                            <h2 className="home-acc-title">
                                Everything Your Pet <span className="home-acc-gradient">Needs</span>
                            </h2>
                            <p className="home-acc-sub">
                                Premium food, toys, grooming essentials and more — all in one place.
                            </p>
                        </div>
                        <Link to="/accessories" className="home-acc-view-all">
                            Browse all accessories <ArrowRight size={16} />
                        </Link>
                    </div>

                    {/* Product Cards Grid */}
                    {loading ? (
                        <div className="home-acc-grid">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="home-acc-skeleton">
                                    <div className="home-acc-ske-img" />
                                    <div style={{ padding: '16px' }}>
                                        <div className="home-acc-ske-line" style={{ width: '50%', height: '11px' }} />
                                        <div className="home-acc-ske-line" style={{ width: '85%', height: '16px', margin: '8px 0 4px' }} />
                                        <div className="home-acc-ske-line" style={{ width: '35%', height: '20px' }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <motion.div
                            className="home-acc-grid"
                        >
                            {products.map(product => (
                                <motion.div
                                    key={product._id}
                                    className="home-acc-card"
                                    initial={{ opacity: 0, y: 15 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: '-80px' }}
                                    transition={{ duration: 0.3 }}
                                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                                >
                                    <Link to={`/accessories/${product._id}`} className="home-acc-card-link">
                                        <div className="home-acc-img-wrap">
                                            {product.images?.[0] ? (
                                                <img src={product.images[0]} alt={product.name} loading="lazy" />
                                            ) : (
                                                <div className="home-acc-img-placeholder"><Package size={36} /></div>
                                            )}
                                            {product.salePrice && product.salePrice < product.price && (
                                                <span className="home-acc-sale-badge">SALE</span>
                                            )}
                                            {product.status === 'Out of Stock' && (
                                                <div className="home-acc-oos">Out of Stock</div>
                                            )}
                                        </div>
                                        <div className="home-acc-card-body">
                                            <span className="home-acc-cat-chip">
                                                {animalEmoji[product.animalCategory] || '🐾'} {product.animalCategory}
                                            </span>
                                            <h3 className="home-acc-name">{product.name}</h3>
                                            {product.brand && <p className="home-acc-brand">{product.brand}</p>}
                                            <div className="home-acc-price-row">
                                                {product.salePrice && product.salePrice < product.price ? (
                                                    <>
                                                        <span className="home-acc-sale-price">${product.salePrice}</span>
                                                        <span className="home-acc-orig-price">${product.price}</span>
                                                    </>
                                                ) : (
                                                    <span className="home-acc-price">${product.price}</span>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                    <div className="home-acc-card-action">
                                        <button
                                            className={`home-acc-cart-btn ${isInCart(product._id) ? 'in-cart' : ''} ${product.status === 'Out of Stock' ? 'oos' : ''}`}
                                            onClick={e => { if (product.status !== 'Out of Stock') handleAddToCart(e, product); }}
                                            disabled={product.status === 'Out of Stock'}
                                        >
                                            <ShoppingCart size={14} />
                                            {isInCart(product._id) ? 'In Cart ✓' : product.status === 'Out of Stock' ? 'Out of Stock' : 'Add to Cart'}
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    {/* Bottom CTA */}
                    <div className="home-acc-cta">
                        <Link to="/accessories">
                            <button className="home-acc-cta-btn">
                                View All Accessories <ArrowRight size={16} />
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

            <CustomerAuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
        </>
    );
};

