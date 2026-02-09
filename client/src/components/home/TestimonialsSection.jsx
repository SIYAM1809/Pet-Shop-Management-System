import { Star, Quote, MessageSquarePlus } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '../common/Button';

const testimonials = [
    {
        id: 1,
        name: "Rahim Ahmed",
        pet: "Max (Golden Retriever)",
        review: "Siyam's Praniseba is the best! We found our dream puppy here. The team was so helpful in guiding us on how to take care of him. Highly recommended!",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80",
        rating: 5
    },
    {
        id: 2,
        name: "Fatima Begum",
        pet: "Luna (Persian Cat)",
        review: "The quality of pets here is amazing. Luna is so healthy and playful. Thank you for making the adoption process so smooth.",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80",
        rating: 5
    },
    {
        id: 3,
        name: "Tanvir Hasan",
        pet: "Coco (Poodle)",
        review: "Excellent service! I ordered online and got delivery in Dhaka within 24 hours. The packaging was safe and Coco arrived happy.",
        image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80",
        rating: 4
    }
];

const TestimonialsSection = () => {
    return (
        <section className="py-20 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16 relative">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <span className="text-primary-600 font-semibold tracking-wider uppercase text-sm mb-2 block">
                            Testimonials
                        </span>
                        <h2 className="text-4xl font-bold text-gray-900 mb-6">
                            Happy Tails <span className="text-primary-500">Stories</span> 🐾
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
                            Don't just take our word for it. Here's what our happy customers have to say about finding their furry friends with us.
                        </p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {testimonials.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -10 }}
                            className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 relative group"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Quote size={60} className="text-primary-500 transform rotate-180" />
                            </div>

                            <div className="flex items-center mb-6 relative z-10">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-primary-100 rounded-full transform scale-110 group-hover:scale-125 transition-transform duration-300"></div>
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-16 h-16 rounded-full object-cover relative z-10 border-4 border-white shadow-sm"
                                    />
                                </div>
                                <div className="ml-4">
                                    <h4 className="font-bold text-lg text-gray-900">{item.name}</h4>
                                    <p className="text-sm text-primary-600 font-medium">{item.pet}</p>
                                </div>
                            </div>

                            <div className="flex mb-4 space-x-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={18}
                                        className={`${i < item.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'} transition-transform hover:scale-110`}
                                    />
                                ))}
                            </div>

                            <p className="text-gray-600 italic leading-relaxed relative z-10">"{item.review}"</p>

                            <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400 font-medium uppercase tracking-wide">
                                <span>Verified Purchase</span>
                                <span>2 Days ago</span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    viewport={{ once: true }}
                    className="text-center"
                >
                    <div className="inline-block p-1 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-full">
                        <Link to="/submit-review">
                            <Button
                                size="lg"
                                className="rounded-full px-8 shadow-xl hover:shadow-2xl transform transition-all hover:scale-105 flex items-center gap-2"
                            >
                                <MessageSquarePlus size={20} />
                                Share Your Story
                            </Button>
                        </Link>
                    </div>
                    <p className="mt-4 text-sm text-gray-500">Join our community of happy pet parents!</p>
                </motion.div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
