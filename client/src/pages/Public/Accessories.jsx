import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, ShoppingCart, Star, Package, X, ChevronDown } from 'lucide-react';
import { productAPI } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import CustomerAuthModal from '../../components/common/CustomerAuthModal';
import toast from 'react-hot-toast';
import './Accessories.css';

const ANIMAL_CATEGORIES = ['Dog', 'Cat', 'Bird', 'Fish', 'Rabbit', 'Small Animal', 'Reptile', 'All Pets'];
const PRODUCT_TYPES = [
    'Food & Treats', 'Grooming', 'Toys', 'Beds & Housing',
    'Collars & Harnesses', 'Health & Wellness', 'Clothing', 'Travel', 'Training', 'Other'
];
const SORT_OPTIONS = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price_asc', label: 'Price: Low → High' },
    { value: 'price_desc', label: 'Price: High → Low' },
    { value: 'name', label: 'Name A–Z' },
];

const animalEmoji = {
    'Dog': '🐕', 'Cat': '🐈', 'Bird': '🦜', 'Fish': '🐠',
    'Rabbit': '🐇', 'Small Animal': '🐹', 'Reptile': '🦎', 'All Pets': '🐾'
};

const PAGE_SIZE = 12;

const Accessories = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();
    const { addToCart, cartItems } = useCart();
    const isCustomer = isAuthenticated && user?.role === 'customer';

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [activeAnimal, setActiveAnimal] = useState('');
    const [activeType, setActiveType] = useState('');
    const [sort, setSort] = useState('newest');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [total, setTotal] = useState(0);
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

    const fetchProducts = useCallback(async (reset = false) => {
        setLoading(true);
        try {
            const params = { sort, limit: PAGE_SIZE, page: reset ? 1 : page };
            if (activeAnimal) params.animalCategory = activeAnimal;
            if (activeType) params.productType = activeType;
            if (search) params.search = search;

            const res = await productAPI.getAll(params);
            if (reset) {
                setProducts(res.data);
                setPage(1);
            } else {
                setProducts(prev => [...prev, ...res.data]);
            }
            setTotal(res.total);
            setHasMore(res.currentPage < res.totalPages);
        } catch {
            toast.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    }, [activeAnimal, activeType, sort, page, search]);

    useEffect(() => {
        fetchProducts(true);
    }, [activeAnimal, activeType, sort]);

    // Debounced search
    useEffect(() => {
        const t = setTimeout(() => fetchProducts(true), 400);
        return () => clearTimeout(t);
    }, [search]);

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        // fetch next page
        (async () => {
            setLoading(true);
            try {
                const params = { sort, limit: PAGE_SIZE, page: nextPage };
                if (activeAnimal) params.animalCategory = activeAnimal;
                if (activeType) params.productType = activeType;
                if (search) params.search = search;
                const res = await productAPI.getAll(params);
                setProducts(prev => [...prev, ...res.data]);
                setHasMore(res.currentPage < res.totalPages);
            } catch {
                toast.error('Failed to load more');
            } finally {
                setLoading(false);
            }
        })();
    };

    const handleAddToCart = (e, product) => {
        e.stopPropagation();
        e.preventDefault();
        if (!isCustomer) {
            setAuthModalOpen(true);
            return;
        }
        addToCart({ ...product, itemType: 'accessory' });
        toast.success(`${product.name} added to cart! 🛒`);
    };

    const isInCart = (productId) => cartItems.some(item => item._id === productId);

    const clearFilters = () => {
        setActiveAnimal('');
        setActiveType('');
        setSearch('');
        setSort('newest');
    };

    const hasActiveFilters = activeAnimal || activeType || search;

    return (
        <div className="accessories-page">

            {/* Hero */}
            <section className="accessories-hero">
                <div className="accessories-hero-bg" />
                <div className="container">
                    <motion.div
                        className="accessories-hero-content"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.55 }}
                    >
                        <span className="accessories-hero-badge">🛍️ Pet Accessories & Supplies</span>
                        <h1 className="accessories-hero-title">
                            Everything Your<br />
                            <span className="gradient-text">Pet Needs</span>
                        </h1>
                        <p className="accessories-hero-sub">
                            Premium food, toys, grooming essentials and more — for dogs, cats, birds and every pet you love.
                        </p>
                        <div className="accessories-hero-search">
                            <Search size={18} className="hero-search-icon" />
                            <input
                                type="text"
                                placeholder="Search accessories, brands, or tags..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="hero-search-input"
                            />
                            {search && (
                                <button className="hero-search-clear" onClick={() => setSearch('')}><X size={16} /></button>
                            )}
                        </div>
                    </motion.div>
                </div>
            </section>

            <div className="container accessories-body">

                {/* Animal Category Tabs */}
                <div className="category-tabs-wrap">
                    <div className="category-tabs">
                        <button
                            className={`cat-tab ${!activeAnimal ? 'active' : ''}`}
                            onClick={() => setActiveAnimal('')}
                        >
                            🐾 All
                        </button>
                        {ANIMAL_CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                className={`cat-tab ${activeAnimal === cat ? 'active' : ''}`}
                                onClick={() => setActiveAnimal(activeAnimal === cat ? '' : cat)}
                            >
                                {animalEmoji[cat]} {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Filter row */}
                <div className="accessories-filter-row">
                    <div className="filter-left">
                        <span className="results-count">
                            {total > 0 ? `${total} product${total !== 1 ? 's' : ''} found` : ''}
                        </span>
                        {hasActiveFilters && (
                            <button className="clear-filters-btn" onClick={clearFilters}>
                                <X size={14} /> Clear filters
                            </button>
                        )}
                    </div>
                    <div className="filter-right">
                        {/* Product type filter */}
                        <select
                            className="filter-select"
                            value={activeType}
                            onChange={e => setActiveType(e.target.value)}
                        >
                            <option value="">All Types</option>
                            {PRODUCT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>

                        {/* Sort */}
                        <select
                            className="filter-select"
                            value={sort}
                            onChange={e => setSort(e.target.value)}
                        >
                            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                    </div>
                </div>

                {/* Active filters pills */}
                {hasActiveFilters && (
                    <div className="active-filter-pills">
                        {activeAnimal && (
                            <span className="filter-pill">
                                {animalEmoji[activeAnimal]} {activeAnimal}
                                <button onClick={() => setActiveAnimal('')}><X size={12} /></button>
                            </span>
                        )}
                        {activeType && (
                            <span className="filter-pill">
                                {activeType}
                                <button onClick={() => setActiveType('')}><X size={12} /></button>
                            </span>
                        )}
                        {search && (
                            <span className="filter-pill">
                                "{search}"
                                <button onClick={() => setSearch('')}><X size={12} /></button>
                            </span>
                        )}
                    </div>
                )}

                {/* Product Grid */}
                {products.length === 0 && !loading ? (
                    <motion.div className="accessories-empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <Package size={64} />
                        <h3>No products found</h3>
                        <p>Try adjusting your filters or search term</p>
                        <button className="clear-filters-btn large" onClick={clearFilters}>Clear all filters</button>
                    </motion.div>
                ) : (
                    <motion.div
                        className="accessories-grid"
                    >
                        <AnimatePresence>
                            {products.map(product => (
                                <motion.div
                                    key={product._id}
                                    className="accessory-card"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.2 }}
                                    whileHover={{ y: -4 }}
                                >
                                    <Link to={`/accessories/${product._id}`} className="accessory-card-link">
                                        {/* Image */}
                                        <div className="accessory-card-image">
                                            {product.images?.[0] ? (
                                                <img src={product.images[0]} alt={product.name} loading="lazy" />
                                            ) : (
                                                <div className="accessory-image-placeholder"><Package size={40} /></div>
                                            )}
                                            {product.onSale && <span className="sale-badge">SALE</span>}
                                            {product.featured && <span className="featured-badge">⭐ Featured</span>}
                                            {product.status === 'Out of Stock' && (
                                                <div className="out-of-stock-overlay">Out of Stock</div>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="accessory-card-body">
                                            <div className="accessory-card-cats">
                                                <span className="acc-cat-chip">{animalEmoji[product.animalCategory]} {product.animalCategory}</span>
                                                <span className="acc-type-chip">{product.productType}</span>
                                            </div>
                                            <h3 className="accessory-card-name">{product.name}</h3>
                                            {product.brand && <p className="accessory-card-brand">{product.brand}</p>}

                                            <div className="accessory-card-footer">
                                                <div className="accessory-price">
                                                    {product.salePrice ? (
                                                        <>
                                                            <span className="acc-sale-price">${product.salePrice}</span>
                                                            <span className="acc-original-price">${product.price}</span>
                                                        </>
                                                    ) : (
                                                        <span className="acc-price">${product.price}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>

                                    {/* Add to Cart button */}
                                    <div className="accessory-card-action">
                                        <button
                                            className={`acc-cart-btn ${isInCart(product._id) ? 'in-cart' : ''} ${product.status === 'Out of Stock' ? 'disabled' : ''}`}
                                            onClick={e => {
                                                if (product.status === 'Out of Stock') return;
                                                handleAddToCart(e, product);
                                            }}
                                            disabled={product.status === 'Out of Stock'}
                                        >
                                            <ShoppingCart size={15} />
                                            {isInCart(product._id) ? 'In Cart' : product.status === 'Out of Stock' ? 'Out of Stock' : 'Add to Cart'}
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}

                {/* Skeleton loading */}
                {loading && products.length === 0 && (
                    <div className="accessories-grid">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="accessory-card-skeleton">
                                <div className="skeleton skeleton-image-acc" />
                                <div style={{ padding: '16px' }}>
                                    <div className="skeleton" style={{ height: '12px', width: '60%', borderRadius: '4px', marginBottom: '8px' }} />
                                    <div className="skeleton" style={{ height: '18px', width: '90%', borderRadius: '4px', marginBottom: '6px' }} />
                                    <div className="skeleton" style={{ height: '14px', width: '40%', borderRadius: '4px' }} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Load More */}
                {hasMore && !loading && (
                    <div className="load-more-wrap">
                        <button className="load-more-btn" onClick={handleLoadMore}>
                            Load More Products
                            <ChevronDown size={16} />
                        </button>
                    </div>
                )}

                {loading && products.length > 0 && (
                    <div className="load-more-wrap">
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Loading more...</span>
                    </div>
                )}
            </div>

            <CustomerAuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
        </div>
    );
};

export default Accessories;
