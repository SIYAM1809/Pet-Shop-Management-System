import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Save, Bike, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/api';
import { containerVariants, itemVariants } from '../../utils/animations';

const cardStyle = {
    background: 'var(--surface)',
    border: '1px solid var(--border-light)',
    borderRadius: 16,
    padding: '1.5rem'
};

const inputStyle = {
    width: '100%',
    padding: '0.65rem 0.875rem',
    background: 'var(--background)',
    border: '1px solid var(--border-light)',
    borderRadius: 10,
    color: 'var(--text-primary)',
    fontSize: '0.875rem',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s'
};

const labelStyle = {
    display: 'block',
    fontSize: '0.8rem',
    fontWeight: 600,
    color: 'var(--text-secondary)',
    marginBottom: '0.375rem'
};

const RiderProfile = () => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        name:  user?.name  || '',
        email: user?.email || '',
        phone: user?.phone || ''
    });
    const [saving, setSaving] = useState(false);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await authAPI.updateProfile(formData);
            toast.success('Profile updated successfully!');
        } catch (err) {
            toast.error(err.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const assignedAreas = user?.assignedAreas || [];

    return (
        <motion.div
            style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="rider-page-header">
                <div>
                    <h1 className="rider-page-title">My Profile</h1>
                    <p className="rider-page-subtitle">Manage your account information</p>
                </div>
            </div>

            {/* Avatar + Info */}
            <motion.div style={cardStyle} variants={itemVariants}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.5rem' }}>
                    <div style={{
                        width: 72, height: 72, borderRadius: '50%',
                        background: 'linear-gradient(135deg, #f97316, #fbbf24)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.75rem', fontWeight: 800, color: 'white',
                        boxShadow: '0 4px 16px rgba(249,115,22,0.35)', flexShrink: 0
                    }}>
                        {user?.name?.charAt(0)?.toUpperCase() || 'R'}
                    </div>
                    <div>
                        <div style={{ fontWeight: 800, fontSize: '1.125rem', color: 'var(--text-primary)' }}>
                            {user?.name}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                            {user?.email}
                        </div>
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                            marginTop: '0.5rem', padding: '0.2rem 0.625rem',
                            background: 'rgba(249,115,22,0.12)', borderRadius: 999,
                            fontSize: '0.7rem', fontWeight: 700, color: '#f97316'
                        }}>
                            <Bike size={12} />
                            Rider
                        </div>
                    </div>
                </div>

                {/* Edit form */}
                <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={labelStyle}>
                            <User size={13} style={{ display: 'inline', marginRight: '0.375rem' }} />
                            Full Name
                        </label>
                        <input
                            style={inputStyle}
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Your full name"
                            required
                            onFocus={(e) => (e.target.style.borderColor = '#f97316')}
                            onBlur={(e) => (e.target.style.borderColor = 'var(--border-light)')}
                        />
                    </div>
                    <div>
                        <label style={labelStyle}>
                            <Mail size={13} style={{ display: 'inline', marginRight: '0.375rem' }} />
                            Email Address
                        </label>
                        <input
                            type="email"
                            style={inputStyle}
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="your@email.com"
                            required
                            onFocus={(e) => (e.target.style.borderColor = '#f97316')}
                            onBlur={(e) => (e.target.style.borderColor = 'var(--border-light)')}
                        />
                    </div>
                    <div>
                        <label style={labelStyle}>
                            <Phone size={13} style={{ display: 'inline', marginRight: '0.375rem' }} />
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            style={inputStyle}
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="01XXXXXXXXX"
                            onFocus={(e) => (e.target.style.borderColor = '#f97316')}
                            onBlur={(e) => (e.target.style.borderColor = 'var(--border-light)')}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={saving}
                        style={{
                            padding: '0.7rem 1.5rem', borderRadius: 10, border: 'none',
                            background: saving ? 'var(--border-light)' : 'linear-gradient(135deg, #f97316, #ea580c)',
                            color: 'white', fontWeight: 700, fontSize: '0.875rem',
                            cursor: saving ? 'not-allowed' : 'pointer',
                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                            alignSelf: 'flex-start', transition: 'opacity 0.2s',
                            boxShadow: saving ? 'none' : '0 4px 12px rgba(249,115,22,0.3)'
                        }}
                    >
                        <Save size={16} />
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>
            </motion.div>

            {/* Assigned Coverage Areas (read-only) */}
            <motion.div style={cardStyle} variants={itemVariants}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <MapPin size={16} color="#f97316" />
                    <h3 style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem' }}>My Delivery Zones</h3>
                </div>
                {assignedAreas.length === 0 ? (
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)' }}>
                        No delivery zones assigned yet. Contact your admin.
                    </p>
                ) : (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {assignedAreas.map(area => (
                            <span
                                key={area}
                                style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                                    background: 'rgba(249,115,22,0.1)', color: '#f97316',
                                    padding: '0.35rem 0.875rem', borderRadius: 999,
                                    fontSize: '0.82rem', fontWeight: 700,
                                    border: '1px solid rgba(249,115,22,0.2)'
                                }}
                            >
                                📍 {area}
                            </span>
                        ))}
                    </div>
                )}
                <p style={{ marginTop: '0.75rem', fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
                    Zone assignments are managed by your admin.
                </p>
            </motion.div>
        </motion.div>
    );
};

export default RiderProfile;
