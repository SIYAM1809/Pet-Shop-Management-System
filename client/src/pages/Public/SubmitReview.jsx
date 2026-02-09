import { useState } from 'react';
import { Star, Upload, CheckCircle, Send, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import './SubmitReview.css';

const SubmitReview = () => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [formData, setFormData] = useState({
        name: '',
        petName: '',
        review: '',
        image: null
    });
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setSubmitted(true);
            setIsSubmitting(false);
        }, 1500);
    };

    if (submitted) {
        return (
            <div className="submit-review-page">
                <div className="review-card success-state">
                    <div className="success-icon">
                        <CheckCircle size={48} />
                    </div>
                    <h2 className="success-title">Thank You!</h2>
                    <p className="success-message">
                        Your review has been submitted successfully. We love hearing from our community!
                    </p>
                    <div className="action-buttons">
                        <Link to="/">
                            <Button variant="outline">Back to Home</Button>
                        </Link>
                        <Link to="/browse">
                            <Button>Browse Pets</Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="submit-review-page">
            <div style={{ width: '100%', maxWidth: '700px' }}>
                <Link to="/" className="back-link">
                    <ArrowLeft size={20} />
                    Back to Home
                </Link>

                <div className="review-card">
                    <div className="review-header">
                        <h1>Share Your Story</h1>
                        <p>Tell us about your new companion and detailed experience.</p>
                    </div>

                    <div className="review-form-container">
                        <form onSubmit={handleSubmit}>
                            {/* Star Rating */}
                            <div className="rating-section">
                                <label className="rating-label">How would you rate your experience?</label>
                                <div className="star-container">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            className="star-btn"
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            onClick={() => setRating(star)}
                                        >
                                            <Star
                                                size={40}
                                                className="star-icon"
                                                fill={star <= (hoverRating || rating) ? "#fbbf24" : "none"}
                                                color={star <= (hoverRating || rating) ? "#fbbf24" : "#e5e7eb"}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="form-grid">
                                <div className="form-group">
                                    <label className="form-label">Your Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="input"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Pet's Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="input"
                                        placeholder="Buddy"
                                        value={formData.petName}
                                        onChange={(e) => setFormData({ ...formData, petName: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="form-group" style={{ marginTop: '1.5rem' }}>
                                <label className="form-label">Your Review</label>
                                <textarea
                                    required
                                    rows="5"
                                    className="input textarea"
                                    placeholder="Share your experience..."
                                    value={formData.review}
                                    onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                                ></textarea>
                            </div>

                            <div className="form-group" style={{ marginTop: '1.5rem' }}>
                                <label className="form-label">Add a Photo of Your Pet</label>
                                <div className="file-upload-area">
                                    <div className="upload-icon-wrapper">
                                        <Upload size={24} />
                                    </div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                        <span style={{ color: 'var(--primary-600)', fontWeight: 500 }}>Upload a file</span>
                                        {' '}or drag and drop
                                    </div>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '0.25rem' }}>
                                        PNG, JPG, GIF up to 5MB
                                    </p>
                                </div>
                            </div>

                            <div className="submit-btn-wrapper">
                                <Button
                                    type="submit"
                                    fullWidth
                                    size="lg"
                                    className="btn-primary"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            Submitting...
                                        </span>
                                    ) : (
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            Submit Review <Send size={20} />
                                        </span>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubmitReview;
