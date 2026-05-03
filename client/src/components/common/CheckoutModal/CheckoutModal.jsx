import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Truck, Store, Minus, Plus, Banknote, CreditCard, Box, Phone } from 'lucide-react';
import { orderAPI, customerAPI } from '../../../services/api';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import './CheckoutModal.css';

const INSIDE_DHAKA = [
    'Uttara', 'Mirpur', 'Dhanmondi', 'Mohammadpur', 'Gulshan',
    'Banani', 'Motijheel', 'Rampura', 'Badda', 'Khilgaon',
    'Bashundhara', 'Wari', 'Lalbagh', 'Jatrabari'
];

const CheckoutModal = ({ isOpen, onClose, product }) => {
    const [qty, setQty] = useState(1);
    const [deliveryType, setDeliveryType] = useState('home_delivery');
    const [deliveryArea, setDeliveryArea] = useState('');
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [deliveryPhone, setDeliveryPhone] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('Cash');
    
    const [loading, setLoading] = useState(false);
    const [successOrder, setSuccessOrder] = useState(null);

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setQty(1);
            setDeliveryType('home_delivery');
            setDeliveryArea('');
            setDeliveryAddress('');
            setDeliveryPhone('');
            setPaymentMethod('Cash');
            setSuccessOrder(null);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const price = product.salePrice ? product.salePrice : product.price;
    const subtotal = price * qty;
    
    let deliveryCharge = 0;
    if (deliveryType === 'home_delivery' && deliveryArea) {
        deliveryCharge = INSIDE_DHAKA.includes(deliveryArea) ? 70 : 120;
    }
    
    const total = subtotal + deliveryCharge;

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (deliveryType === 'home_delivery') {
            if (!deliveryArea || !deliveryAddress || !deliveryPhone) {
                toast.error('Please fill in all delivery details');
                return;
            }
        }

        setLoading(true);
        try {
            // First, ensure we have a customer profile for the logged in user
            let customerRes;
            try {
                customerRes = await customerAPI.getMe();
            } catch (err) {
                throw new Error('Could not verify customer profile');
            }
            
            const customerId = customerRes.data._id;

            // Prepare checkout payload
            const orderData = {
                customerId,
                items: [{ productId: product._id, quantity: qty }],
                paymentMethod,
                deliveryType,
            };

            if (deliveryType === 'home_delivery') {
                orderData.deliveryArea = deliveryArea;
                orderData.deliveryAddress = deliveryAddress;
                orderData.deliveryPhone = deliveryPhone;
            }

            // Submit order
            const res = await orderAPI.checkout(orderData);
            setSuccessOrder(res.data.orderNumber);
            toast.success('Order placed successfully!');
        } catch (error) {
            toast.error(error.message || 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            <div className="checkout-modal-overlay">
                <motion.div 
                    className="checkout-modal-content"
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                >
                    <div className="checkout-modal-header">
                        <h2>Order Checkout</h2>
                        {!successOrder && (
                            <button className="close-btn" onClick={onClose}><X size={20} /></button>
                        )}
                    </div>

                    {successOrder ? (
                        <div className="checkout-success">
                            <div className="success-icon-container">
                                <Box size={48} className="success-box-icon" />
                            </div>
                            <h3>Order Placed Successfully!</h3>
                            <p>Your order number is:</p>
                            <div className="order-number-display">{successOrder}</div>
                            
                            <div className="success-actions">
                                <Link to={`/track?order=${successOrder}`} className="track-order-btn">
                                    Track Order
                                </Link>
                                <button className="continue-shopping-btn" onClick={onClose}>
                                    Continue Shopping
                                </button>
                            </div>
                        </div>
                    ) : (
                        <form className="checkout-form" onSubmit={handleSubmit}>
                            {/* Product Summary */}
                            <div className="checkout-product-summary">
                                <img src={product.images[0]} alt={product.name} />
                                <div className="product-info-checkout">
                                    <h4>{product.name}</h4>
                                    <p className="product-price-checkout">৳{price}</p>
                                </div>
                                <div className="qty-selector-checkout">
                                    <button type="button" onClick={() => setQty(q => Math.max(1, q - 1))} disabled={qty <= 1}>
                                        <Minus size={14} />
                                    </button>
                                    <span>{qty}</span>
                                    <button type="button" onClick={() => setQty(q => Math.min(product.stock, q + 1))} disabled={qty >= product.stock}>
                                        <Plus size={14} />
                                    </button>
                                </div>
                            </div>

                            {/* Delivery Options */}
                            <div className="checkout-section">
                                <h3 className="section-title">Delivery Option</h3>
                                <div className="delivery-type-options">
                                    <label className={`delivery-card ${deliveryType === 'home_delivery' ? 'selected' : ''}`}>
                                        <input 
                                            type="radio" 
                                            name="deliveryType" 
                                            value="home_delivery" 
                                            checked={deliveryType === 'home_delivery'} 
                                            onChange={() => setDeliveryType('home_delivery')} 
                                        />
                                        <Truck size={20} />
                                        <span>Home Delivery</span>
                                    </label>
                                    <label className={`delivery-card ${deliveryType === 'store_pickup' ? 'selected' : ''}`}>
                                        <input 
                                            type="radio" 
                                            name="deliveryType" 
                                            value="store_pickup" 
                                            checked={deliveryType === 'store_pickup'} 
                                            onChange={() => setDeliveryType('store_pickup')} 
                                        />
                                        <Store size={20} />
                                        <span>Store Pickup</span>
                                    </label>
                                </div>
                            </div>

                            {/* Home Delivery Details */}
                            {deliveryType === 'home_delivery' && (
                                <div className="checkout-section fade-in">
                                    <h3 className="section-title"><MapPin size={16} /> Delivery Address</h3>
                                    <div className="form-group">
                                        <label>Area</label>
                                        <select 
                                            value={deliveryArea} 
                                            onChange={(e) => setDeliveryArea(e.target.value)}
                                            required
                                        >
                                            <option value="">Select Area...</option>
                                            <optgroup label="Inside Dhaka (৳70)">
                                                {INSIDE_DHAKA.map(area => (
                                                    <option key={area} value={area}>{area}</option>
                                                ))}
                                            </optgroup>
                                            <optgroup label="Outside Dhaka (৳120)">
                                                <option value="Outside Dhaka">Other / Outside Dhaka</option>
                                            </optgroup>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Full Address</label>
                                        <textarea 
                                            value={deliveryAddress} 
                                            onChange={(e) => setDeliveryAddress(e.target.value)}
                                            placeholder="House, Road, Block, etc."
                                            rows="2"
                                            required
                                        ></textarea>
                                    </div>
                                    <div className="form-group">
                                        <label><Phone size={14} style={{ display: 'inline', marginRight: '4px' }}/>Phone Number</label>
                                        <input 
                                            type="tel" 
                                            value={deliveryPhone} 
                                            onChange={(e) => setDeliveryPhone(e.target.value)}
                                            placeholder="e.g. 017..."
                                            required
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Payment Method */}
                            <div className="checkout-section">
                                <h3 className="section-title"><Banknote size={16} /> Payment Method</h3>
                                <div className="payment-options">
                                    {['Cash', 'Bkash', 'Nagad', 'Credit Card'].map(method => (
                                        <label key={method} className={`payment-method-label ${paymentMethod === method ? 'selected' : ''}`}>
                                            <input 
                                                type="radio" 
                                                name="paymentMethod" 
                                                value={method} 
                                                checked={paymentMethod === method} 
                                                onChange={() => setPaymentMethod(method)} 
                                            />
                                            {method === 'Credit Card' ? <CreditCard size={18} /> : <Banknote size={18} />}
                                            {method === 'Cash' ? 'Cash on Delivery' : method}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Price Summary */}
                            <div className="checkout-summary">
                                <div className="summary-row">
                                    <span>Subtotal ({qty} item{qty > 1 ? 's' : ''})</span>
                                    <span>৳{subtotal}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Delivery Charge</span>
                                    <span>{deliveryCharge > 0 ? `৳${deliveryCharge}` : 'Free'}</span>
                                </div>
                                <div className="summary-row total">
                                    <span>Total to Pay</span>
                                    <span>৳{total}</span>
                                </div>
                            </div>

                            <div className="checkout-actions">
                                <button type="button" className="checkout-cancel-btn" onClick={onClose} disabled={loading}>
                                    Cancel
                                </button>
                                <button type="submit" className="checkout-submit-btn" disabled={loading}>
                                    {loading ? <div className="spinner-small"></div> : 'Place Order'}
                                </button>
                            </div>
                        </form>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default CheckoutModal;
