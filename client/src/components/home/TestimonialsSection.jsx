import { useState, useEffect } from 'react';
import { Star, Quote, MessageSquarePlus } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '../common/Button';
import { reviewAPI } from '../../services/api';
import './TestimonialsSection.css';

const TestimonialsSection = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const data = await reviewAPI.getAll();
                // Take only the latest 3-6 reviews for the home page
                if (Array.isArray(data) && data.length > 0) {
                    setReviews(data.slice(0, 3));
                } else {
                    // Fallback to static data if no reviews exist yet
                    setReviews(staticTestimonials);
                }
            } catch (error) {
                console.error("Failed to fetch reviews:", error);
                setReviews(staticTestimonials);
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
    }, []);

    const staticTestimonials = [
        {
            _id: 1,
            name: "Rahim Ahmed",
            petName: "Max (Golden Retriever)",
            review: "Siyam's Praniseba is the best! We found our dream puppy here. The team was so helpful in guiding us on how to take care of him. Highly recommended!",
            image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80",
            rating: 5,
            createdAt: new Date().toISOString()
        },
        {
            _id: 2,
            name: "Fatima Begum",
            petName: "Luna (Persian Cat)",
            review: "The quality of pets here is amazing. Luna is so healthy and playful. Thank you for making the adoption process so smooth.",
            image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80",
            rating: 5,
            createdAt: new Date().toISOString()
        },
        {
            _id: 3,
            name: "Tanvir Hasan",
            petName: "Coco (Poodle)",
            review: "Excellent service! I ordered online and got delivery in Dhaka within 24 hours. The packaging was safe and Coco arrived happy.",
            image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80",
            rating: 4,
            createdAt: new Date().toISOString()
        }
    ];

    const displayReviews = reviews.length > 0 ? reviews : staticTestimonials;

    const renderAvatar = (review) => {
        if (review.image) {
            return (
                <img
                    src={review.image}
                    alt={review.name}
                    className="user-avatar"
                />
            );
        }
        return (
            <div className="avatar-placeholder">
                {review.name.charAt(0)}
            </div>
        );
    };

    return (
        <section className="testimonials-section">
            {/* Background Decorations */}
            <div className="bg-blob blob-1"></div>
            <div className="bg-blob blob-2"></div>

            <div className="testimonials-container">
                <div className="testimonials-header">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <span className="subtitle-badge">
                            COMMUNITY LOVE
                        </span>
                        <h2 className="testimonials-title">
                            Happy Tails <span className="highlight-text">Stories</span> 🐾
                        </h2>
                        <p className="testimonials-description">
                            Join thousands of happy pet parents who found their perfect companion with us. Real stories from our amazing community.
                        </p>
                    </motion.div>
                </div>

                {loading ? (
                    <div className="loading-container">
                        <div className="spinner"></div>
                    </div>
                ) : (
                    <div className="testimonials-grid">
                        {displayReviews.map((item, index) => (
                            <motion.div
                                key={item._id}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="testimonial-card"
                            >
                                <div className="quote-icon">
                                    <Quote size={80} />
                                </div>

                                <div className="card-header">
                                    <div className="avatar-wrapper">
                                        {renderAvatar(item)}
                                    </div>
                                    <div className="user-info">
                                        <h4 className="user-name">{item.name}</h4>
                                        <p className="pet-name">{item.petName}</p>
                                    </div>
                                </div>

                                <div className="rating-stars">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={18}
                                            className={i < item.rating ? 'star-filled' : 'star-empty'}
                                        />
                                    ))}
                                </div>

                                <p className="review-text">
                                    "{item.review}"
                                </p>

                                <div className="card-footer">
                                    <span className="verified-badge">
                                        <CheckCircleIcon size={12} /> Verified
                                    </span>
                                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    viewport={{ once: true }}
                    className="cta-container"
                >
                    <div className="cta-wrapper">
                        <Link to="/submit-review">
                            <Button
                                size="lg"
                                className="cta-button-custom"
                            >
                                <MessageSquarePlus size={22} />
                                Share Your Happy Tale
                            </Button>
                        </Link>
                    </div>
                    <p className="cta-subtext">
                        Got a pet from us? We'd love to hear your story! ❤️
                    </p>
                </motion.div>
            </div>
        </section>
    );
};

// Helper component for the check icon in the verified badge
const CheckCircleIcon = ({ size }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
);

export default TestimonialsSection;
