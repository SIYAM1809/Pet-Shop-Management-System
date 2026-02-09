import { useState, useRef, useEffect } from 'react';
import { Star, Upload, CheckCircle, Send, ArrowLeft, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import { reviewAPI } from '../../services/api';
import './SubmitReview.css';

const SubmitReview = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [formData, setFormData] = useState({
        name: '',
        petName: '',
        review: '',
        image: null
    });
    const [previewUrl, setPreviewUrl] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // Scroll to top on mount or when successfully submitted
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [submitted]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, image: file });
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleRemoveImage = (e) => {
        e.stopPropagation();
        setFormData({ ...formData, image: null });
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            setError("Please select a star rating");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            let imageBase64 = null;
            if (formData.image) {
                imageBase64 = await convertToBase64(formData.image);
            }

            const reviewData = {
                name: formData.name,
                petName: formData.petName,
                review: formData.review,
                rating: rating,
                image: imageBase64
            };

            await reviewAPI.create(reviewData);
            setSubmitted(true);

            // Auto redirect after 3 seconds
            setTimeout(() => {
                navigate('/');
            }, 3000);

        } catch (err) {
            console.error("Failed to submit review:", err);
            setError(err.message || "Failed to submit review. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
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
                        Your review has been submitted successfully. It will appear in our Happy Tails section shortly!
                    </p>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)', marginBottom: '2rem' }}>
                        Redirecting to home...
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
                        {error && (
                            <div style={{
                                background: '#fee2e2',
                                color: '#b91c1c',
                                padding: '1rem',
                                borderRadius: '0.5rem',
                                marginBottom: '1.5rem',
                                textAlign: 'center'
                            }}>
                                {error}
                            </div>
                        )}

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
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    style={{ display: 'none' }}
                                />
                                <div
                                    className={`file-upload-area ${previewUrl ? 'has-preview' : ''}`}
                                    onClick={triggerFileInput}
                                    style={{
                                        position: 'relative',
                                        overflow: 'hidden',
                                        borderColor: previewUrl ? 'var(--primary-500)' : undefined
                                    }}
                                >
                                    {previewUrl ? (
                                        <div className="preview-container" style={{ position: 'relative', zIndex: 10 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                                                <img
                                                    src={previewUrl}
                                                    alt="Preview"
                                                    style={{
                                                        width: '64px',
                                                        height: '64px',
                                                        objectFit: 'cover',
                                                        borderRadius: '8px',
                                                        boxShadow: 'var(--shadow-sm)'
                                                    }}
                                                />
                                                <div style={{ textAlign: 'left' }}>
                                                    <p style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{formData.image.name}</p>
                                                    <p style={{ fontSize: '0.75rem', color: 'var(--success)' }}>Image selected</p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={handleRemoveImage}
                                                    style={{
                                                        padding: '0.5rem',
                                                        borderRadius: '50%',
                                                        border: '1px solid var(--border-medium)',
                                                        background: 'white',
                                                        color: 'var(--error)',
                                                        cursor: 'pointer',
                                                        marginLeft: 'auto'
                                                    }}
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
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
                                        </>
                                    )}
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
