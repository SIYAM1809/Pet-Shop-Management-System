import { useState, useEffect } from 'react';
import { Star, Quote, MessageSquarePlus, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '../common/Button';
import { reviewAPI } from '../../services/api';

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
                    className="w-16 h-16 rounded-full object-cover relative z-10 border-4 border-white shadow-sm"
                />
            );
        }
        return (
            <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-xl relative z-10 border-4 border-white shadow-sm">
                {review.name.charAt(0)}
            </div>
        );
    };

    return (
        <section className="py-24 bg-gradient-to-b from-white via-primary-50 to-white overflow-hidden relative">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-secondary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16 relative">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <span className="inline-block px-4 py-1.5 rounded-full bg-primary-100 text-primary-700 font-semibold text-sm mb-4 tracking-wide shadow-sm">
                            COMMUNITY LOVE
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
                            Happy Tails <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400">Stories</span> 🐾
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
                            Join thousands of happy pet parents who found their perfect companion with us. Real stories from our amazing community.
                        </p>
                    </motion.div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                        {displayReviews.map((item, index) => (
                            <motion.div
                                key={item._id}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                                className="bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100 relative group overflow-hidden"
                            >
                                {/* Card Hover Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-primary-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                <div className="absolute top-6 right-8 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                                    <Quote size={80} className="text-primary-500 rotate-180" />
                                </div>

                                <div className="flex items-center mb-6 relative z-10">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-primary-200 rounded-full transform scale-110 group-hover:scale-125 transition-transform duration-500 blur-sm"></div>
                                        {renderAvatar(item)}
                                    </div>
                                    <div className="ml-4">
                                        <h4 className="font-bold text-lg text-gray-900 leading-tight">{item.name}</h4>
                                        <p className="text-sm text-primary-600 font-medium">{item.petName}</p>
                                    </div>
                                </div>

                                <div className="flex mb-4 space-x-1 relative z-10">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={18}
                                            className={`${i < item.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'} transition-transform group-hover:scale-110 duration-300`}
                                            style={{ transitionDelay: `${i * 50}ms` }}
                                        />
                                    ))}
                                </div>

                                <p className="text-gray-600 leading-relaxed relative z-10 line-clamp-4 min-h-[5rem]">
                                    "{item.review}"
                                </p>

                                <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400 font-medium uppercase tracking-wide relative z-10">
                                    <span className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-full">
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
                    className="text-center relative z-10"
                >
                    <div className="inline-block p-1.5 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-full shadow-inner">
                        <Link to="/submit-review">
                            <Button
                                size="lg"
                                className="rounded-full px-10 py-4 text-lg shadow-xl hover:shadow-2xl hover:bg-primary-700 transform transition-all hover:-translate-y-1 flex items-center gap-3 bg-primary-600 text-white border-none"
                            >
                                <MessageSquarePlus size={22} />
                                Share Your Happy Tale
                            </Button>
                        </Link>
                    </div>
                    <p className="mt-6 text-sm text-gray-500 font-medium animate-pulse">
                        Got a pet from us? We'd love to hear your story! ❤️
                    </p>
                </motion.div>
            </div>

            <style jsx>{`
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
            `}</style>
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
