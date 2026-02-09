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
    AlertCircle
} from 'lucide-react';
import { reviewAPI } from '../../services/api';
import Button from '../../components/common/Button';  // Adjusted path: ../../components/common/Button
import { containerVariants, itemVariants } from '../../utils/animations'; // Adjusted path: ../../utils/animations
import toast from 'react-hot-toast';

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
            <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <motion.div
            className="p-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Reviews & Testimonials</h1>
                    <p className="text-gray-500">Manage customer reviews and feedback</p>
                </div>
                <div className="flex gap-2">
                    <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex items-center gap-2">
                        <span className="text-sm text-gray-500">Total Reviews:</span>
                        <span className="font-bold text-gray-900">{reviews.length}</span>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name, pet, or content..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
                    {['All', 'Pending', 'Approved'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${filterStatus === status
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
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
                    <div className="col-span-full text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MessageSquare className="text-gray-400" size={32} />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No reviews found</h3>
                        <p className="text-gray-500 mt-1">Try adjusting your search or filters</p>
                    </div>
                ) : (
                    filteredReviews.map((review) => (
                        <motion.div
                            key={review._id}
                            variants={itemVariants}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        {review.image ? (
                                            <img
                                                src={review.image}
                                                alt={review.petName}
                                                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold border-2 border-white shadow-sm">
                                                {review.name.charAt(0)}
                                            </div>
                                        )}
                                        <div>
                                            <h3 className="font-bold text-gray-900">{review.name}</h3>
                                            <p className="text-sm text-primary-600 font-medium">{review.petName}</p>
                                        </div>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(review.status)}`}>
                                        {review.status || 'Pending'}
                                    </span>
                                </div>

                                <div className="flex mb-3">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={16}
                                            className={i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}
                                        />
                                    ))}
                                </div>

                                <p className="text-gray-600 text-sm mb-4 line-clamp-4 italic bg-gray-50 p-3 rounded-lg border border-gray-100">
                                    "{review.review}"
                                </p>

                                <div className="text-xs text-gray-400 mb-4 font-medium">
                                    Submitted: {new Date(review.createdAt).toLocaleDateString()}
                                </div>

                                <div className="flex gap-2 pt-4 border-t border-gray-100">
                                    {review.status !== 'Approved' && (
                                        <Button
                                            size="sm"
                                            className="flex-1 bg-green-600 hover:bg-green-700 text-white border-none"
                                            onClick={() => handleStatusUpdate(review._id, 'Approved')}
                                        >
                                            <CheckCircle size={16} className="mr-1" /> Approve
                                        </Button>
                                    )}
                                    {review.status === 'Approved' && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="flex-1 text-yellow-600 border-yellow-200 hover:bg-yellow-50"
                                            onClick={() => handleStatusUpdate(review._id, 'Pending')}
                                        >
                                            <AlertCircle size={16} className="mr-1" /> Suspend
                                        </Button>
                                    )}
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="text-red-600 border-red-200 hover:bg-red-50"
                                        onClick={() => handleDelete(review._id)}
                                    >
                                        <Trash2 size={16} />
                                    </Button>
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
