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
import '../../components/home/TestimonialsSection.css'; // Import the design tokens

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
            case 'Approved': return 'bg-green-100 text-green-700';
            case 'Pending': return 'bg-yellow-100 text-yellow-700';
            default: return 'bg-gray-100 text-gray-700';
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
            {/* Header Section - Better Alignment */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Reviews & Testimonials</h1>
                    <p className="text-gray-500 mt-1">Manage customer reviews and feedback</p>
                </div>
                <div className="px-4 py-2 bg-white rounded-xl border border-gray-200 shadow-sm flex items-center gap-2 self-start md:self-auto">
                    <span className="text-sm font-medium text-gray-500">Total Reviews:</span>
                    <span className="text-lg font-bold text-primary-600">{reviews.length}</span>
                </div>
            </div>

            {/* Filters Section - Improved Layout & Spacing */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                    <input
                        type="text"
                        placeholder="Search reviews..."
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-sm text-gray-700 placeholder-gray-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                    {['All', 'Pending', 'Approved'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 whitespace-nowrap border ${filterStatus === status
                                ? 'bg-primary-600 text-white border-primary-600 shadow-md transform scale-105'
                                : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-white hover:border-gray-300 hover:shadow-sm'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Reviews Grid - Happy Tails Styling Restored */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredReviews.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-16 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-gray-100">
                            <MessageSquare className="text-gray-400" size={32} />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">No reviews found</h3>
                        <p className="text-gray-500 mt-1 max-w-sm">
                            Try adjusting your search criteria.
                        </p>
                    </div>
                ) : (
                    filteredReviews.map((review) => (
                        <motion.div
                            key={review._id}
                            variants={itemVariants}
                            className="h-full"
                        >
                            <div className="testimonial-card relative bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col h-full transform transition hover:-translate-y-1 hover:shadow-md">
                                {/* Status Badge */}
                                <div className="absolute top-4 right-4 z-20">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm ${getStatusColor(review.status)}`}>
                                        {review.status || 'Pending'}
                                    </span>
                                </div>

                                {/* Quote Icon */}
                                <div className="quote-icon opacity-10 text-primary-500 absolute top-6 right-6 transform rotate-180 pointer-events-none">
                                    <Quote size={80} strokeWidth={0} fill="currentColor" />
                                </div>

                                {/* Header: Avatar + Name */}
                                <div className="card-header flex items-center mb-4 z-10 relative">
                                    <div className="avatar-wrapper flex-shrink-0 relative">
                                        {review.image ? (
                                            <img
                                                src={review.image}
                                                alt={review.name}
                                                className="user-avatar w-16 h-16 rounded-full object-cover border-4 border-white shadow-sm"
                                            />
                                        ) : (
                                            <div className="avatar-placeholder w-16 h-16 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-xl border-4 border-white shadow-sm">
                                                {review.name.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    <div className="user-info ml-4">
                                        <h4 className="user-name font-bold text-gray-900 text-lg">{review.name}</h4>
                                        <p className="pet-name text-sm text-primary-600 font-medium">{review.petName}</p>
                                    </div>
                                </div>

                                {/* Star Rating */}
                                <div className="rating-stars flex gap-1 mb-4 z-10 relative">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={18}
                                            className={i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}
                                        />
                                    ))}
                                </div>

                                {/* Review Text */}
                                <p className="review-text text-gray-600 italic mb-6 relative z-10 flex-grow leading-relaxed line-clamp-4">
                                    "{review.review}"
                                </p>

                                {/* Footer: Date & Actions */}
                                <div className="card-footer pt-4 border-t border-gray-100 mt-auto flex flex-col gap-4">
                                    <div className="flex justify-between items-center w-full text-xs text-gray-400 font-medium uppercase tracking-wide">
                                        <span className="flex items-center gap-1">
                                            {review.status === 'Approved' ? (
                                                <><CheckCircle size={14} className="text-green-500" /> Verified</>
                                            ) : (
                                                <><AlertCircle size={14} className="text-yellow-500" /> Unverified</>
                                            )}
                                        </span>
                                        <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                                    </div>

                                    <div className="flex gap-2 w-full z-20">
                                        {review.status !== 'Approved' && (
                                            <Button
                                                size="sm"
                                                className="flex-1 bg-green-600 hover:bg-green-700 text-white border-none py-2 shadow-sm"
                                                onClick={() => handleStatusUpdate(review._id, 'Approved')}
                                            >
                                                <CheckCircle size={16} className="mr-1" /> Approve
                                            </Button>
                                        )}
                                        {review.status === 'Approved' && (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="flex-1 text-yellow-600 border-yellow-200 hover:bg-yellow-50 py-2"
                                                onClick={() => handleStatusUpdate(review._id, 'Pending')}
                                            >
                                                <AlertCircle size={16} className="mr-1" /> Suspend
                                            </Button>
                                        )}
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="text-red-600 border-red-200 hover:bg-red-50 px-3 shadow-sm"
                                            onClick={() => handleDelete(review._id)}
                                        >
                                            <Trash2 size={16} />
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
