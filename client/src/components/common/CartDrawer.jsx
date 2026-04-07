import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import './CartDrawer.css';

const CartDrawer = ({ isOpen, onClose }) => {
    const { cartItems, cartTotal, removeFromCart, updateQuantity, clearCart } = useCart();

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="cart-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Drawer */}
                    <motion.div
                        className="cart-drawer"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', stiffness: 320, damping: 35 }}
                    >
                        {/* Header */}
                        <div className="cart-drawer-header">
                            <div className="cart-drawer-title">
                                <ShoppingCart size={20} />
                                <span>My Cart</span>
                                {cartItems.length > 0 && (
                                    <span className="cart-count-pill">{cartItems.length}</span>
                                )}
                            </div>
                            <div className="cart-header-actions">
                                {cartItems.length > 0 && (
                                    <button className="cart-clear-btn" onClick={clearCart} title="Clear cart">
                                        <Trash2 size={15} />
                                        Clear
                                    </button>
                                )}
                                <button className="cart-close-btn" onClick={onClose} aria-label="Close">
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="cart-drawer-body">
                            {cartItems.length === 0 ? (
                                <div className="cart-empty">
                                    <ShoppingBag size={52} className="cart-empty-icon" />
                                    <h3>Your cart is empty</h3>
                                    <p>Browse our pets and add companions to your cart!</p>
                                </div>
                            ) : (
                                <div className="cart-items-list">
                                    <AnimatePresence>
                                        {cartItems.map(item => (
                                            <motion.div
                                                key={item._id}
                                                className="cart-item"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0, padding: 0 }}
                                                transition={{ duration: 0.2 }}
                                                layout
                                            >
                                                {/* Image */}
                                                <div className="cart-item-image">
                                                    {item.image ? (
                                                        <img src={item.image} alt={item.name} />
                                                    ) : (
                                                        <div className="cart-item-image-placeholder">🐾</div>
                                                    )}
                                                </div>

                                                {/* Info */}
                                                <div className="cart-item-info">
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                                                        <p className="cart-item-name">{item.name}</p>
                                                        <span style={{
                                                            fontSize: '0.62rem', fontWeight: 700,
                                                            padding: '1px 6px', borderRadius: '10px',
                                                            background: item.itemType === 'accessory' ? 'rgba(6,182,212,0.12)' : 'rgba(139,92,246,0.12)',
                                                            color: item.itemType === 'accessory' ? '#0891b2' : 'var(--primary-500)',
                                                            flexShrink: 0, textTransform: 'uppercase'
                                                        }}>
                                                            {item.itemType === 'accessory' ? 'Accessory' : 'Pet'}
                                                        </span>
                                                    </div>
                                                    <p className="cart-item-meta">
                                                        {item.itemType === 'accessory'
                                                            ? `${item.animalCategory ?? ''} · ${item.productType ?? ''}`
                                                            : `${item.breed ?? ''} · ${item.species ?? ''}`}
                                                    </p>
                                                    <p className="cart-item-price">${((item.salePrice || item.price) * item.quantity).toLocaleString()}</p>
                                                </div>

                                                {/* Quantity + Remove */}
                                                <div className="cart-item-controls">
                                                    <div className="qty-control">
                                                        <button
                                                            className="qty-btn"
                                                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                                        >
                                                            <Minus size={12} />
                                                        </button>
                                                        <span className="qty-value">{item.quantity}</span>
                                                        <button
                                                            className="qty-btn"
                                                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                                        >
                                                            <Plus size={12} />
                                                        </button>
                                                    </div>
                                                    <button
                                                        className="cart-item-remove"
                                                        onClick={() => removeFromCart(item._id)}
                                                        title="Remove"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {cartItems.length > 0 && (
                            <div className="cart-drawer-footer">
                                <div className="cart-total-row">
                                    <span className="cart-total-label">Estimated Total</span>
                                    <span className="cart-total-value">${cartTotal.toLocaleString()}</span>
                                </div>
                                <p className="cart-footer-note">
                                    💡 Use <strong>Inquire</strong> for pets · Browse <strong>Accessories</strong> for supplies
                                </p>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CartDrawer;
