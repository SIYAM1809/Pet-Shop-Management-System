import { useState, useEffect } from 'react';
import { Mail, Search, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import '../Dashboard/Dashboard.css'; // Reusing dashboard styles

const Subscribers = () => {
    const [subscribers, setSubscribers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchSubscribers();
    }, []);

    const fetchSubscribers = async () => {
        try {
            const token = localStorage.getItem('token');
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

            const res = await fetch(`${API_URL}/subscribers`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await res.json();

            if (data.success) {
                setSubscribers(data.data);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Error fetching subscribers:', error);
            toast.error('Failed to load subscribers');
        } finally {
            setLoading(false);
        }
    };

    const filteredSubscribers = subscribers.filter(sub =>
        sub.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div className="loading-spinner">Loading...</div>;
    }

    return (
        <div className="dashboard-content">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Newsletter Subscribers</h1>
                    <p className="text-gray-500">Manage your newsletter subscription list</p>
                </div>
                <div className="header-actions">
                    <div className="search-box">
                        <Search size={20} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search emails..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon bg-primary-100 text-primary-600">
                        <Mail size={24} />
                    </div>
                    <div className="stat-info">
                        <p className="stat-label">Total Subscribers</p>
                        <h3 className="stat-value">{subscribers.length}</h3>
                    </div>
                </div>
            </div>

            <div className="recent-orders-card">
                <div className="card-header">
                    <h2 className="card-title">Subscriber List</h2>
                </div>
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Email</th>
                                <th>Subscribed Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSubscribers.length > 0 ? (
                                filteredSubscribers.map((sub) => (
                                    <tr key={sub._id}>
                                        <td>
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center text-primary-600">
                                                    <Mail size={16} />
                                                </div>
                                                <span className="font-medium">{sub.email}</span>
                                            </div>
                                        </td>
                                        <td>
                                            {new Date(sub.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="2" className="text-center py-4">
                                        No subscribers found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Subscribers;
