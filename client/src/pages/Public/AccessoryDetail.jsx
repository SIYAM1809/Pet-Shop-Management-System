import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, ArrowLeft, Package, Check, Tag, ChevronLeft, ChevronRight, Minus, Plus } from 'lucide-react';
import { productAPI } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import CustomerAuthModal from '../../components/common/CustomerAuthModal';
import toast from 'react-hot-toast';
import './AccessoryDetail.css';

const animalEmoji = {
    'Dog': '🐕', 'Cat': '🐈', 'Bird': '🦜', 'Fish': '🐠',
    'Rabbit': '🐇', 'Small Animal': '🐹', 'Reptile': '🦎', 'All Pets': '🐾'
};

const AccessoryDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();
    const { addToCart, cartItems, updateQuantity } = useCart();
    const isCustomer = isAuthenticated && user?.role === 'customer';

    const [product, setProduct] = useState(null);
    const [related, setRelated] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);
    const [qty, setQty] = useState(1);
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const [addedToCart, setAddedToCart] = useState(false);

    const cartItem = cartItems.find(item => item._id === id);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        setLoading(true);
        try {
            const res = await productAPI.getById(id);
            setProduct(res.data);
            setActiveImage(0);

            // fetch related products same animal category
            const relRes = await productAPI.getAll({
                animalCategory: res.data.animalCategory,
                limit: 4,
                status: 'Active'
            });
            setRelated(relRes.data.filter(p => p._id !== id));
        } catch {
            toast.error('Product not found');
            navigate('/accessories');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = () => {
        if (!isCustomer) {
            setAuthModalOpen(true);
            return;
        }
        if (product.status === 'Out of Stock') return;

        if (cartItem) {
            updateQuantity(cartItem._id, cartItem.quantity + qty);
        } else {
            for (let i = 0; i < qty; i++) {
                addToCart({ ...product, itemType: 'accessory' });
            }
        }
        setAddedToCart(true);
        toast.success(`${product.name} added to cart! 🛒`);
        setTimeout(() => setAddedToCart(false), 2500);
    };

    if (loading) {
        return (
            <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
                <div className="skeleton" style={{ height: '400px', borderRadius: '16px', marginBottom: '24px' }} />
            </div>
        );
    }

    if (!product) return null;

    const displayImages = product.images?.length > 0 ? product.images : [null];
    const onSale = product.salePrice && product.salePrice < product.price;
    const effectivePrice = onSale ? product.salePrice : product.price;
    const discountPct = onSale ? Math.round((1 - product.salePrice / product.price) * 100) : 0;

    return (
        <div className="accessory-detail-page">
            <div className="container">

                {/* Breadcrumb */}
                <nav className="detail-breadcrumb">
                    <Link to="/accessories" className="breadcrumb-back">
                        <ArrowLeft size={16} />
                        <span>Back to Accessories</span>
                    </Link>
                    <span className="breadcrumb-sep">›</span>
                    <span className="breadcrumb-cat">{animalEmoji[product.animalCategory]} {product.animalCategory}</span>
                    <span className="breadcrumb-sep">›</span>
                    <span className="breadcrumb-current">{product.name}</span>
                </nav>

                {/* Main product section */}
                <div className="detail-main">

                    {/* Image Gallery */}
                    <motion.div
                        className="detail-gallery"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <div className="detail-main-image">
                            {displayImages[activeImage] ? (
                                <img src={displayImages[activeImage]} alt={product.name} />
                            ) : (
                                <div className="detail-img-placeholder"><Package size={80} /></div>
                            )}
                            {onSale && <span className="detail-sale-overlay">-{discountPct}% OFF</span>}

                            {/* Arrow navigation */}
                            {displayImages.length > 1 && (
                                <>
                                    <button className="gallery-nav prev" onClick={() => setActiveImage(i => Math.max(0, i - 1))}>
                                        <ChevronLeft size={20} />
                                    </button>
                                    <button className="gallery-nav next" onClick={() => setActiveImage(i => Math.min(displayImages.length - 1, i + 1))}>
                                        <ChevronRight size={20} />
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {displayImages.length > 1 && (
                            <div className="detail-thumbnails">
                                {displayImages.map((src, i) => (
                                    <button
                                        key={i}
                                        className={`thumb-btn ${activeImage === i ? 'active' : ''}`}
                                        onClick={() => setActiveImage(i)}
                                    >
                                        {src ? <img src={src} alt={`View ${i + 1}`} /> : <Package size={20} />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {/* Product Info */}
                    <motion.div
                        className="detail-info"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                    >
                        {/* Category chips */}
                        <div className="detail-cats">
                            <span className="acc-cat-chip">{animalEmoji[product.animalCategory]} {product.animalCategory}</span>
                            <span className="acc-type-chip">{product.productType}</span>
                            {product.featured && <span className="featured-chip">⭐ Featured</span>}
                        </div>

                        <h1 className="detail-product-name">{product.name}</h1>
                        {product.brand && <p className="detail-brand">by <strong>{product.brand}</strong></p>}

                        {/* Price */}
                        <div className="detail-price-block">
                            {onSale ? (
                                <>
                                    <span className="detail-sale-price">${product.salePrice}</span>
                                    <span className="detail-original-price">${product.price}</span>
                                    <span className="detail-discount-badge">Save {discountPct}%</span>
                                </>
                            ) : (
                                <span className="detail-price">${product.price}</span>
                            )}
                        </div>

                        {/* Stock */}
                        <div className={`detail-stock ${product.stock === 0 ? 'out' : product.stock < 5 ? 'low' : 'in'}`}>
                            {product.stock === 0 ? '❌ Out of Stock'
                                : product.stock < 5 ? `⚠️ Only ${product.stock} left!`
                                : `✅ In Stock (${product.stock} available)`}
                        </div>

                        {/* Qty + Add to cart */}
                        {product.status !== 'Out of Stock' && (
                            <div className="detail-cart-row">
                                <div className="qty-selector">
                                    <button className="qty-btn-lg" onClick={() => setQty(q => Math.max(1, q - 1))}><Minus size={16} /></button>
                                    <span className="qty-display">{qty}</span>
                                    <button className="qty-btn-lg" onClick={() => setQty(q => Math.min(product.stock, q + 1))}><Plus size={16} /></button>
                                </div>
                                <button
                                    className={`detail-cart-btn ${addedToCart ? 'added' : ''}`}
                                    onClick={handleAddToCart}
                                >
                                    {addedToCart ? <><Check size={18} /> Added!</> : <><ShoppingCart size={18} /> Add to Cart</>}
                                </button>
                            </div>
                        )}

                        {/* Tags */}
                        {product.tags?.length > 0 && (
                            <div className="detail-tags">
                                <Tag size={14} />
                                {product.tags.map(tag => (
                                    <span key={tag} className="detail-tag">#{tag}</span>
                                ))}
                            </div>
                        )}

                        {/* Description */}
                        {product.description && (
                            <div className="detail-description">
                                <h3>About this product</h3>
                                <p>{product.description}</p>
                            </div>
                        )}
                    </motion.div>
                </div>

                {/* Related Products */}
                {related.length > 0 && (
                    <section className="related-section">
                        <h2 className="related-title">More for your {product.animalCategory}</h2>
                        <div className="related-grid">
                            {related.slice(0, 4).map(p => (
                                <Link key={p._id} to={`/accessories/${p._id}`} className="related-card">
                                    <div className="related-image">
                                        {p.images?.[0] ? <img src={p.images[0]} alt={p.name} /> : <Package size={28} />}
                                    </div>
                                    <div className="related-body">
                                        <p className="related-name">{p.name}</p>
                                        <p className="related-price">
                                            {p.salePrice ? <>${p.salePrice}</> : <>${p.price}</>}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </div>

            <CustomerAuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
        </div>
    );
};

export default AccessoryDetail;
