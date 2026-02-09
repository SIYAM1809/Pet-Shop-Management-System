import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Star,
    Trash2,
    CheckCircle,
    XCircle,
    Search,
    Filter,
    MessageSquare,
    AlertCircle,
    Quote
} from 'lucide-react';
import { reviewAPI } from '../../services/api';
import Button from '../../components/common/Button';
import { containerVariants, itemVariants } from '../../utils/animations';
import toast from 'react-hot-toast';

// Removed external CSS import to rely on Tailwind for admin layout
// import '../../components/home/TestimonialsSection.css'; 

const Reviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('All'); // All, Pending, Approved
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const data = await reviewAPI.getAllAdmin();
            setReviews(data);
        } catch (error) {
            console.error('Failed to fetch reviews:', error);
            toast.error('Failed to load reviews');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await reviewAPI.updateStatus(id, newStatus);
            setReviews(reviews.map(review =>
                review._id === id ? { ...review, status: newStatus } : review
            ));
            toast.success(`Review ${newStatus === 'Approved' ? 'approved' : 'rejected'}`);
        } catch (error) {
            console.error('Failed to update status:', error);
            toast.error('Failed to update status');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this review?')) return;

        try {
            await reviewAPI.delete(id);
            setReviews(reviews.filter(review => review._id !== id));
            toast.success('Review deleted');
        } catch (error) {
            console.error('Failed to delete review:', error);
            toast.error('Failed to delete review');
        }
    };

    const filteredReviews = reviews.filter(review => {
        const matchesSearch =
            review.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            review.petName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            review.review?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = filterStatus === 'All' || review.status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'Approved': return 'bg-green-100 text-green-700 border-green-200';
            case 'Pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <motion.div
            className="p-6 max-w-7xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Reviews & Testimonials</h1>
                    <p className="text-gray-500 mt-1">Manage customer reviews and feedback</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-500">Total Reviews:</span>
                    <span className="text-lg font-bold text-primary-600">{reviews.length}</span>
                </div>
            </div>

            {/* Filters Section */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name, pet, or content..."
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                    {['All', 'Pending', 'Approved'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap border ${filterStatus === status
                                ? 'bg-primary-600 text-white border-primary-600 shadow-md transform scale-105'
                                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Reviews Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredReviews.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-16 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-gray-100">
                            <MessageSquare className="text-gray-400" size={32} />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">No reviews found</h3>
                        <p className="text-gray-500 mt-1 max-w-sm">
                            We couldn't find any reviews matching your search filters. Try adjusting your criteria.
                        </p>
                    </div>
                ) : (
                    filteredReviews.map((review) => (
                        <motion.div
                            key={review._id}
                            variants={itemVariants}
                            className="flex"
                        >
                            {/* Card Container - Flex column for sticky footer */}
                            <div className="relative w-full bg-white rounded-2xl p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300">

                                {/* Status Badge (Absolute Top Right) */}
                                <div className="absolute top-4 right-4 z-20">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm border ${getStatusColor(review.status)}`}>
                                        {review.status || 'Pending'}
                                    </span>
                                </div>

                                {/* Quote Icon (Background Decoration) */}
                                <div className="absolute top-8 right-8 text-primary-50 opacity-10 pointer-events-none z-0 transform rotate-180">
                                    <Quote size={80} strokeWidth={0} fill="currentColor" />
                                </div>

                                {/* Header: Avatar + Name */}
                                <div className="flex items-center gap-4 mb-4 relative z-10">
                                    <div className="relative">
                                        {review.image ? (
                                            <img
                                                src={review.image}
                                                alt={review.name}
                                                className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md ring-2 ring-gray-50"
                                            />
                                        ) : (
                                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-100 to-primary-50 text-primary-600 flex items-center justify-center font-bold text-xl border-2 border-white shadow-md ring-2 ring-gray-50">
                                                {review.name.charAt(0)}
                                            </div>
                                        )}
                                        {/* Verification Checkmark */}
                                        {review.status === 'Approved' && (
                                            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                                                <CheckCircle size={16} className="text-green-500 fill-green-50" />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 leading-tight">{review.name}</h3>
                                        <p className="text-sm text-primary-600 font-medium mt-0.5">{review.petName}</p>
                                    </div>
                                </div>

                                {/* Star Rating */}
                                <div className="flex gap-1 mb-4 relative z-10">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={16}
                                            className={`${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-100'}`}
                                        />
                                    ))}
                                </div>

                                {/* Review Text */}
                                <div className="relative z-10 mb-6 flex-grow">
                                    <p className="text-gray-600 text-sm leading-relaxed italic line-clamp-4">
                                        "{review.review}"
                                    </p>
                                </div>

                                {/* Footer: Date & Actions */}
                                <div className="mt-auto pt-4 border-t border-gray-100 relative z-10">
                                    <div className="flex justify-between items-center mb-4 text-xs font-medium text-gray-400 uppercase tracking-wide">
                                        <span>Submitted</span>
                                        <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        {review.status !== 'Approved' ? (
                                            <Button
                                                size="sm"
                                                className="w-full bg-green-600 hover:bg-green-700 text-white border-none py-2 shadow-sm flex justify-center items-center gap-1.5"
                                                onClick={() => handleStatusUpdate(review._id, 'Approved')}
                                            >
                                                <CheckCircle size={14} /> Approve
                                            </Button>
                                        ) : (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="w-full text-yellow-600 border-yellow-200 hover:bg-yellow-50 py-2 flex justify-center items-center gap-1.5"
                                                onClick={() => handleStatusUpdate(review._id, 'Pending')}
                                            >
                                                <AlertCircle size={14} /> Suspend
                                            </Button>
                                        )}

                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="w-full text-red-600 border-red-200 hover:bg-red-50 py-2 flex justify-center items-center gap-1.5"
                                            onClick={() => handleDelete(review._id)}
                                        >
                                            <Trash2 size={14} /> Delete
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </motion.div>
    );
};

export default Reviews;
