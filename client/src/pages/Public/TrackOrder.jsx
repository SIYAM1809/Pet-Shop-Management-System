import { useState } from 'react';
import { Search, Package, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { orderAPI } from '../../services/api';
import { toast } from 'react-hot-toast';
import './Public.css'; // Reusing public styles

const TrackOrder = () => {
    const [orderNumber, setOrderNumber] = useState('');
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleTrack = async (e) => {
        e.preventDefault();
        if (!orderNumber.trim()) {
            toast.error('Please enter an order number');
            return;
        }

        setLoading(true);
        setError('');
        setOrder(null);

        try {
            const data = await orderAPI.track(orderNumber);
            setOrder(data.data);
        } catch (err) {
            setError(err.message);
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': return 'text-success';
            case 'Processing': return 'text-info';
            case 'Cancelled': return 'text-error';
            default: return 'text-warning';
        }
    };

    return (
        <div className="container" style={{ padding: '4rem 1rem', minHeight: '60vh' }}>
            <div className="card glass" style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h2 className="gradient-text" style={{ fontSize: '2rem', marginBottom: '1rem' }}>Track Your Order</h2>
                    <p className="text-secondary">Enter your Order ID to check the current status.</p>
                </div>

                <form onSubmit={handleTrack} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                    <input
                        type="text"
                        value={orderNumber}
                        onChange={(e) => setOrderNumber(e.target.value)}
                        placeholder="e.g. ORD-240208-1234"
                        className="input"
                        style={{ flex: 1 }}
                    />
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Tracking...' : 'Track'}
                    </button>
                </form>

                {error && (
                    <div className="p-4 mb-4 text-error bg-error-light rounded-lg flex items-center gap-2">
                        <AlertCircle size={20} />
                        <span>{error}</span>
                    </div>
                )}

                {order && (
                    <div className="space-y-6 animate-fade-in">
                        <div className="border-b border-border-light pb-4">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="text-xl font-bold text-primary-900">Order #{order.orderNumber}</h3>
                                    <p className="text-sm text-secondary">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div className={`badge ${getStatusColor(order.status)}`} style={{ fontWeight: 'bold' }}>
                                    {order.status}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="font-medium text-primary-800">Items</h4>
                            {order.items.map((item, index) => (
                                <div key={index} className="flex items-center gap-4 bg-bg-secondary p-3 rounded-lg border border-border-light">
                                    <div className="w-12 h-12 bg-bg-primary rounded-md flex items-center justify-center text-2xl">
                                        {/* Use pet image if available, otherwise emoji based on species */}
                                        {item.petSpecies === 'Dog' ? '🐕' : item.petSpecies === 'Cat' ? '🐈' : '🐾'}
                                    </div>
                                    <div>
                                        <p className="font-medium text-primary-900 dashed-underline">{item.petName || item.pet?.name}</p>
                                        <p className="text-sm text-secondary">{item.petSpecies || item.pet?.species}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-border-light pt-4 mt-4">
                            <div className="flex justify-between items-center text-sm mb-2">
                                <span className="text-secondary">Payment Method:</span>
                                <span className="font-medium text-primary-900">{order.paymentMethod}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm mb-2">
                                <span className="text-secondary">Payment Status:</span>
                                <span className={`font-medium ${order.paymentStatus === 'Paid' ? 'text-success' : 'text-warning'}`}>
                                    {order.paymentStatus}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-lg font-bold mt-4">
                                <span className="text-primary-900">Total:</span>
                                <span className="text-primary-600">${order.totalAmount}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrackOrder;
