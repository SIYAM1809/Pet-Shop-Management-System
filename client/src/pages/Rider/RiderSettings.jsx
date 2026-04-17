import { motion } from 'framer-motion';
import { Sun, Moon, Bell, Shield } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { containerVariants, itemVariants } from '../../utils/animations';

const cardStyle = {
    background: 'var(--surface)',
    border: '1px solid var(--border-light)',
    borderRadius: 16,
    padding: '1.5rem',
    marginBottom: '1rem'
};

const sectionHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '1.25rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid var(--border-light)'
};

const iconBoxStyle = (color) => ({
    width: 40, height: 40, borderRadius: 10,
    background: color, display: 'flex',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0
});

const RiderSettings = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <motion.div
            style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="rider-page-header">
                <div>
                    <h1 className="rider-page-title">Settings</h1>
                    <p className="rider-page-subtitle">Preferences and account security</p>
                </div>
            </div>

            {/* Appearance */}
            <motion.div style={cardStyle} variants={itemVariants}>
                <div style={sectionHeaderStyle}>
                    <div style={iconBoxStyle('rgba(249,115,22,0.12)')}>
                        {theme === 'light' ? <Sun size={20} color="#f97316" /> : <Moon size={20} color="#f97316" />}
                    </div>
                    <div>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Appearance</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Customize the look and feel</div>
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>Theme Mode</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                            Currently: {theme === 'light' ? 'Light' : 'Dark'} mode
                        </div>
                    </div>
                    <button
                        onClick={toggleTheme}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                            padding: '0.5rem 1rem', borderRadius: 10,
                            border: '1.5px solid var(--border-light)',
                            background: 'transparent', cursor: 'pointer',
                            color: 'var(--text-primary)', fontWeight: 600,
                            fontSize: '0.875rem', transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#f97316';
                            e.currentTarget.style.color = '#f97316';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'var(--border-light)';
                            e.currentTarget.style.color = 'var(--text-primary)';
                        }}
                    >
                        {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
                        Switch to {theme === 'light' ? 'Dark' : 'Light'}
                    </button>
                </div>
            </motion.div>

            {/* Notifications */}
            <motion.div style={cardStyle} variants={itemVariants}>
                <div style={sectionHeaderStyle}>
                    <div style={iconBoxStyle('rgba(59,130,246,0.12)')}>
                        <Bell size={20} color="#3b82f6" />
                    </div>
                    <div>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Notifications</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Alert preferences</div>
                    </div>
                </div>
                {[
                    { label: 'New Delivery Assignment', sub: 'Get notified when a delivery is assigned to you' },
                    { label: 'Delivery Reminders',      sub: 'Reminders for pending pickups' }
                ].map((item) => (
                    <div key={item.label} style={{
                        display: 'flex', justifyContent: 'space-between',
                        alignItems: 'center', marginBottom: '1rem'
                    }}>
                        <div>
                            <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                                {item.label}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                                {item.sub}
                            </div>
                        </div>
                        <input type="checkbox" defaultChecked style={{ accentColor: '#f97316', width: 18, height: 18, cursor: 'pointer' }} />
                    </div>
                ))}
            </motion.div>

            {/* Security */}
            <motion.div style={cardStyle} variants={itemVariants}>
                <div style={sectionHeaderStyle}>
                    <div style={iconBoxStyle('rgba(34,197,94,0.12)')}>
                        <Shield size={20} color="#22c55e" />
                    </div>
                    <div>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Security</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Keep your account secure</div>
                    </div>
                </div>
                <button
                    style={{
                        width: '100%', padding: '0.7rem', borderRadius: 10,
                        border: '1.5px solid var(--border-light)',
                        background: 'transparent', cursor: 'pointer',
                        color: 'var(--text-primary)', fontWeight: 600,
                        fontSize: '0.875rem', transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#f97316';
                        e.currentTarget.style.color = '#f97316';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'var(--border-light)';
                        e.currentTarget.style.color = 'var(--text-primary)';
                    }}
                >
                    🔒 Change Password
                </button>
            </motion.div>
        </motion.div>
    );
};

export default RiderSettings;
