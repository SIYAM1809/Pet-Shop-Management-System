import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus, Search, Edit2, Trash2, Package, X,
    Star, Tag, ImagePlus, ChevronDown, ToggleLeft, ToggleRight
} from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import { productAPI } from '../../services/api';
import { containerVariants, itemVariants } from '../../utils/animations';
import toast from 'react-hot-toast';
import './Products.css';

const ANIMAL_CATEGORIES = ['Dog', 'Cat', 'Bird', 'Fish', 'Rabbit', 'Small Animal', 'Reptile', 'All Pets'];
const PRODUCT_TYPES = [
    'Food & Treats', 'Grooming', 'Toys', 'Beds & Housing',
    'Collars & Harnesses', 'Health & Wellness', 'Clothing', 'Travel', 'Training', 'Other'
];
const STATUSES = ['Active', 'Out of Stock', 'Discontinued'];

const initialFormData = {
    name: '',
    animalCategory: 'Dog',
    productType: 'Food & Treats',
    brand: '',
    description: '',
    price: '',
    salePrice: '',
    stock: '0',
    tags: '',
    status: 'Active',
    featured: false,
    images: []
};

const statusColors = {
    'Active': 'success',
    'Out of Stock': 'warning',
    'Discontinued': 'error'
};

const animalEmoji = {
    'Dog': '🐕', 'Cat': '🐈', 'Bird': '🦜', 'Fish': '🐠',
    'Rabbit': '🐇', 'Small Animal': '🐹', 'Reptile': '🦎', 'All Pets': '🐾'
};

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [filterType, setFilterType] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState(initialFormData);
    const [submitting, setSubmitting] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [stats, setStats] = useState({ total: 0, active: 0, outOfStock: 0 });
    const [imagePreview, setImagePreview] = useState([]);
    const fileInputRef = useRef();

    useEffect(() => {
        fetchProducts();
        fetchStats();
    }, [filterCategory, filterType, filterStatus]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const params = { limit: 100 };
            if (filterCategory) params.animalCategory = filterCategory;
            if (filterType) params.productType = filterType;
            if (filterStatus) params.status = filterStatus;
            const response = await productAPI.getAll(params);
            setProducts(response.data);
        } catch (err) {
            toast.error('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const res = await productAPI.getStats();
            setStats(res.data);
        } catch (_) {}
    };

    const handleOpenModal = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                ...product,
                price: product.price.toString(),
                salePrice: product.salePrice?.toString() || '',
                stock: product.stock.toString(),
                tags: Array.isArray(product.tags) ? product.tags.join(', ') : '',
            });
            setImagePreview(product.images || []);
        } else {
            setEditingProduct(null);
            setFormData(initialFormData);
            setImagePreview([]);
        }
        setModalOpen(true);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const remaining = 3 - imagePreview.length;
        if (remaining <= 0) { toast.error('Maximum 3 images allowed'); return; }

        files.slice(0, remaining).forEach(file => {
            const reader = new FileReader();
            reader.onload = (ev) => {
                setImagePreview(prev => {
                    const updated = [...prev, ev.target.result];
                    setFormData(fd => ({ ...fd, images: updated }));
                    return updated;
                });
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (idx) => {
        setImagePreview(prev => {
            const updated = prev.filter((_, i) => i !== idx);
            setFormData(fd => ({ ...fd, images: updated }));
            return updated;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.price) {
            toast.error('Name and price are required');
            return;
        }
        setSubmitting(true);
        try {
            const submitData = {
                ...formData,
                price: parseFloat(formData.price),
                salePrice: formData.salePrice ? parseFloat(formData.salePrice) : null,
                stock: parseInt(formData.stock) || 0,
                images: imagePreview,
            };
            if (editingProduct) {
                await productAPI.update(editingProduct._id, submitData);
                toast.success('Product updated!');
            } else {
                await productAPI.create(submitData);
                toast.success('Product added!');
            }
            setModalOpen(false);
            fetchProducts();
            fetchStats();
        } catch (err) {
            toast.error(err.message || 'Failed to save product');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        try {
            await productAPI.delete(productToDelete._id);
            toast.success('Product deleted');
            setDeleteModalOpen(false);
            setProductToDelete(null);
            fetchProducts();
            fetchStats();
        } catch (err) {
            toast.error(err.message);
        }
    };

    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.brand || '').toLowerCase().includes(search.toLowerCase())
    );

    return (
        <motion.div className="products-admin-page" variants={containerVariants} initial="hidden" animate="visible">
            {/* Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">Products</h1>
                    <p className="page-subtitle">Manage pet accessories & supplies</p>
                </div>
                <Button variant="primary" icon={<Plus size={18} />} onClick={() => handleOpenModal()}>
                    Add Product
                </Button>
            </div>

            {/* Stats */}
            <div className="products-stats-row">
                {[
                    { label: 'Total Products', value: stats.total, color: 'var(--primary-500)' },
                    { label: 'Active', value: stats.active, color: 'var(--success)' },
                    { label: 'Out of Stock', value: stats.outOfStock, color: '#f59e0b' },
                    { label: 'Discontinued', value: stats.discontinued || 0, color: 'var(--error)' },
                ].map(s => (
                    <Card key={s.label} className="product-stat-card">
                        <div className="product-stat-value" style={{ color: s.color }}>{s.value}</div>
                        <div className="product-stat-label">{s.label}</div>
                    </Card>
                ))}
            </div>

            {/* Filters */}
            <Card className="filters-card">
                <div className="filters-row">
                    <div className="search-filter">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search products or brands..."
                            className="search-input"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="filter-group">
                        <select className="input select" value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
                            <option value="">All Animals</option>
                            {ANIMAL_CATEGORIES.map(c => <option key={c} value={c}>{animalEmoji[c]} {c}</option>)}
                        </select>
                        <select className="input select" value={filterType} onChange={e => setFilterType(e.target.value)}>
                            <option value="">All Types</option>
                            {PRODUCT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                        <select className="input select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                            <option value="">All Status</option>
                            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                </div>
            </Card>

            {/* Table */}
            {loading ? (
                <Card><div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading products...</div></Card>
            ) : filtered.length === 0 ? (
                <div className="empty-state">
                    <Package size={64} className="empty-state-icon" />
                    <h3 className="empty-state-title">No products found</h3>
                    <p className="empty-state-description">Add your first accessory product to get started</p>
                    <Button variant="primary" onClick={() => handleOpenModal()}>Add Product</Button>
                </div>
            ) : (
                <Card>
                    <div className="products-table-wrap">
                        <table className="products-table">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Category</th>
                                    <th>Type</th>
                                    <th>Price</th>
                                    <th>Stock</th>
                                    <th>Status</th>
                                    <th>Featured</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <AnimatePresence>
                                    {filtered.map(product => (
                                        <motion.tr
                                            key={product._id}
                                            variants={itemVariants}
                                            initial="hidden"
                                            animate="visible"
                                            exit={{ opacity: 0, height: 0 }}
                                            layout
                                        >
                                            <td>
                                                <div className="product-table-item">
                                                    <div className="product-table-thumb">
                                                        {product.images?.[0] ? (
                                                            <img src={product.images[0]} alt={product.name} />
                                                        ) : (
                                                            <div className="product-thumb-placeholder"><Package size={18} /></div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="product-table-name">{product.name}</div>
                                                        <div className="product-table-brand">{product.brand || '—'}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td><span className="category-chip">{animalEmoji[product.animalCategory]} {product.animalCategory}</span></td>
                                            <td><span className="type-chip">{product.productType}</span></td>
                                            <td>
                                                <div className="price-cell">
                                                    {product.salePrice ? (
                                                        <>
                                                            <span className="sale-price">${product.salePrice}</span>
                                                            <span className="original-price">${product.price}</span>
                                                        </>
                                                    ) : (
                                                        <span>${product.price}</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`stock-cell ${product.stock === 0 ? 'zero' : ''}`}>
                                                    {product.stock}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`badge badge-${statusColors[product.status]}`}>
                                                    {product.status}
                                                </span>
                                            </td>
                                            <td>
                                                {product.featured
                                                    ? <Star size={16} style={{ color: '#f59e0b', fill: '#f59e0b' }} />
                                                    : <span style={{ color: 'var(--text-tertiary)' }}>—</span>}
                                            </td>
                                            <td>
                                                <div className="pet-actions">
                                                    <button className="action-btn edit" onClick={() => handleOpenModal(product)}>
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button className="action-btn delete" onClick={() => { setProductToDelete(product); setDeleteModalOpen(true); }}>
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}

            {/* Add/Edit Modal */}
            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={editingProduct ? 'Edit Product' : 'Add New Product'}
                size="lg"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
                        <Button variant="primary" onClick={handleSubmit} loading={submitting}>
                            {editingProduct ? 'Save Changes' : 'Add Product'}
                        </Button>
                    </>
                }
            >
                <form className="product-form" onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <Input label="Product Name *" name="name" value={formData.name} onChange={handleChange} required placeholder="e.g. Premium Dog Kibble" />
                        <Input label="Brand" name="brand" value={formData.brand} onChange={handleChange} placeholder="e.g. Royal Canin" />

                        <div className="input-group">
                            <label className="input-label">Animal Category *</label>
                            <select name="animalCategory" className="input select" value={formData.animalCategory} onChange={handleChange}>
                                {ANIMAL_CATEGORIES.map(c => <option key={c} value={c}>{animalEmoji[c]} {c}</option>)}
                            </select>
                        </div>

                        <div className="input-group">
                            <label className="input-label">Product Type *</label>
                            <select name="productType" className="input select" value={formData.productType} onChange={handleChange}>
                                {PRODUCT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>

                        <Input label="Price ($) *" type="number" name="price" value={formData.price} onChange={handleChange} min="0" step="0.01" required />
                        <Input label="Sale Price ($)" type="number" name="salePrice" value={formData.salePrice} onChange={handleChange} min="0" step="0.01" placeholder="Leave empty if no sale" />
                        <Input label="Stock Quantity *" type="number" name="stock" value={formData.stock} onChange={handleChange} min="0" required />

                        <div className="input-group">
                            <label className="input-label">Status</label>
                            <select name="status" className="input select" value={formData.status} onChange={handleChange}>
                                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="input-group" style={{ marginTop: '16px' }}>
                        <label className="input-label">Description</label>
                        <textarea name="description" className="input textarea" value={formData.description} onChange={handleChange} rows={3} placeholder="Describe this product..." />
                    </div>

                    <Input label="Tags (comma-separated)" name="tags" value={formData.tags} onChange={handleChange} placeholder="organic, vet-approved, premium" />

                    {/* Featured toggle */}
                    <div className="featured-toggle" style={{ marginTop: '12px' }}>
                        <label className="input-label">Featured Product</label>
                        <button type="button" className="toggle-btn" onClick={() => setFormData(p => ({ ...p, featured: !p.featured }))}>
                            {formData.featured
                                ? <><ToggleRight size={28} style={{ color: 'var(--primary-500)' }} /><span>Featured</span></>
                                : <><ToggleLeft size={28} style={{ color: 'var(--text-tertiary)' }} /><span>Not Featured</span></>}
                        </button>
                    </div>

                    {/* Image upload */}
                    <div className="input-group" style={{ marginTop: '16px' }}>
                        <label className="input-label">Product Images (max 3)</label>
                        <div className="image-upload-area">
                            {imagePreview.map((src, i) => (
                                <div key={i} className="image-preview-thumb">
                                    <img src={src} alt={`Preview ${i + 1}`} />
                                    <button type="button" className="remove-image-btn" onClick={() => removeImage(i)}><X size={12} /></button>
                                    {i === 0 && <span className="primary-badge">Main</span>}
                                </div>
                            ))}
                            {imagePreview.length < 3 && (
                                <button type="button" className="image-upload-btn" onClick={() => fileInputRef.current?.click()}>
                                    <ImagePlus size={24} />
                                    <span>Upload</span>
                                </button>
                            )}
                        </div>
                        <input ref={fileInputRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleImageUpload} />
                    </div>
                </form>
            </Modal>

            {/* Delete Modal */}
            <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Confirm Delete" size="sm"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
                        <Button variant="danger" onClick={handleDelete}>Delete</Button>
                    </>
                }
            >
                <p>Are you sure you want to delete <strong>{productToDelete?.name}</strong>? This cannot be undone.</p>
            </Modal>
        </motion.div>
    );
};

export default Products;
