import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

const testimonials = [
    {
        id: 1,
        name: "Rahim Ahmed",
        pet: "Max (Golden Retriever)",
        review: "Siyam's Praniseba is the best! We found our dream puppy here. The team was so helpful in guiding us on how to take care of him. Highly recommended!",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80"
    },
    {
        id: 2,
        name: "Fatima Begum",
        pet: "Luna (Persian Cat)",
        review: "The quality of pets here is amazing. Luna is so healthy and playful. Thank you for making the adoption process so smooth.",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80"
    },
    {
        id: 3,
        name: "Tanvir Hasan",
        pet: "Coco (Poodle)",
        review: "Excellent service! I ordered online and got delivery in Dhaka within 24 hours. The packaging was safe and Coco arrived happy.",
        image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80"
    }
];

const TestimonialsSection = () => {
    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Happy Tails 🐾</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Don't just take our word for it. Here's what our happy customers have to say about finding their furry friends with us.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-gray-50 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative"
                        >
                            <Quote size={40} className="text-sky-100 absolute top-4 right-4" />

                            <div className="flex items-center mb-6">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-14 h-14 rounded-full object-cover mr-4 border-2 border-sky-100"
                                />
                                <div>
                                    <h4 className="font-semibold text-gray-900">{item.name}</h4>
                                    <p className="text-sm text-sky-600">{item.pet}</p>
                                </div>
                            </div>

                            <div className="flex mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={16} className="text-yellow-400 fill-current" />
                                ))}
                            </div>

                            <p className="text-gray-600 italic">"{item.review}"</p>

                            <div className="mt-6 flex items-center text-sm text-green-600 font-medium">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                Verified Purchase
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
