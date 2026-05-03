import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
    Bike, Plus, MapPin, Edit2, Check, X, Trash2,
    AlertTriangle, Search, RefreshCw, Phone, Mail
} from 'lucide-react';
import toast from 'react-hot-toast';
import { riderAPI, authAPI } from '../../services/api';
import { containerVariants, itemVariants } from '../../utils/animations';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import './Riders.css';

const DHAKA_AREAS = [
    'Uttara', 'Mirpur', 'Dhanmondi', 'Mohammadpur', 'Gulshan',
    'Banani', 'Motijheel', 'Rampura', 'Badda', 'Khilgaon',
    'Bashundhara', 'Wari', 'Lalbagh', 'Jatrabari'
];

const Riders = () => {
    const [riders, setRiders]           = useState([]);
    const [loading, setLoading]         = useState(true);
    const [search, setSearch]           = useState('');

    // Edit areas
    const [editingId, setEditingId]     = useState(null);
    const [editAreas, setEditAreas]     = useState([]);
    const [savingAreas, setSavingAreas] = useState(false);

    // Add rider modal
    const [addOpen, setAddOpen]         = useState(false);
    const [addForm, setAddForm]         = useState({ name: '', email: '', password: '', phone: '', assignedAreas: [] });
    const [adding, setAdding]           = useState(false);

    // Delete confirmation
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting]         = useState(false);

    const fetchRiders = useCallback(async () => {
        setLoading(true);
        try {
            const res = await riderAPI.getAvailableRiders();
            setRiders(res.data || []);
        } catch {
            toast.error('Failed to load riders');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchRiders(); }, [fetchRiders]);

    const startEdit = (rider) => {
        setEditingId(rider._id);
        setEditAreas(rider.assignedAreas || []);
    };

    const cancelEdit = () => { setEditingId(null); setEditAreas([]); };

    const toggleArea = (area) =>
        setEditAreas(prev => prev.includes(area) ? prev.filter(a => a !== area) : [...prev, area]);

    const saveAreas = async (riderId) => {
        setSavingAreas(true);
        try {
            await riderAPI.updateRiderAreas(riderId, editAreas);
            toast.success('Delivery zones updated!');
            setRiders(prev => prev.map(r => r._id === riderId ? { ...r, assignedAreas: editAreas } : r));
            setEditingId(null);
        } catch (err) {
            toast.error(err.message || 'Failed to save zones');
        } finally {
            setSavingAreas(false);
        }
    };

    const handleAddRider = async (e) => {
        e.preventDefault();
        if (!addForm.name || !addForm.email || !addForm.password) {
            toast.error('Name, email and password are required');
            return;
        }
        setAdding(true);
        try {
            await authAPI.register({ ...addForm, role: 'staff' });
            toast.success(`Rider "${addForm.name}" added successfully!`);
            setAddOpen(false);
            setAddForm({ name: '', email: '', password: '', phone: '', assignedAreas: [] });
            fetchRiders();
        } catch (err) {
            toast.error(err.message || 'Failed to add rider');
        } finally {
            setAdding(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            const res = await authAPI.deleteUser(deleteTarget._id);
            toast.success(res.message || 'Rider deleted');
            setDeleteTarget(null);
            fetchRiders();
        } catch (err) {
            toast.error(err.message || 'Failed to delete rider');
        } finally {
            setDeleting(false);
        }
    };

    const filtered = riders.filter(r =>
        r.name?.toLowerCase().includes(search.toLowerCase()) ||
        r.email?.toLowerCase().includes(search.toLowerCase()) ||
        r.assignedAreas?.some(a => a.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <motion.div
            className="riders-page"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">Riders</h1>
                    <p className="page-subtitle">{riders.length} rider{riders.length !== 1 ? 's' : ''} · Manage zones &amp; accounts</p>
                </div>
                <Button variant="primary" icon={<Plus size={18} />} onClick={() => setAddOpen(true)}>
                    Add Rider
                </Button>
            </div>

            {/* Search + Refresh */}
            <motion.div variants={itemVariants} className="riders-toolbar">
                <div className="riders-search-wrap">
                    <Search size={16} className="riders-search-icon" />
                    <input
                        type="text"
                        className="riders-search"
                        placeholder="Search by name, email or zone..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <button className="riders-refresh-btn" onClick={fetchRiders} title="Refresh">
                    <RefreshCw size={15} />
                </button>
            </motion.div>

            {/* Rider Cards */}
            {loading ? (
                <div className="riders-loading">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="rider-card skeleton-card">
                            <div className="skeleton-pulse" style={{ width: 52, height: 52, borderRadius: '50%', flexShrink: 0 }} />
                            <div style={{ flex: 1 }}>
                                <div className="skeleton-pulse" style={{ height: 14, width: '40%', marginBottom: 8 }} />
                                <div className="skeleton-pulse" style={{ height: 12, width: '60%' }} />
                            </div>
                        </div>
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div className="riders-empty">
                    <Bike size={56} />
                    <h3>{search ? 'No riders match your search' : 'No riders registered yet'}</h3>
                    <p>{search ? 'Try a different search term.' : 'Click "Add Rider" to create the first one.'}</p>
                    {!search && (
                        <Button variant="primary" icon={<Plus size={16} />} onClick={() => setAddOpen(true)}>
                            Add Rider
                        </Button>
                    )}
                </div>
            ) : (
                <div className="riders-list">
                    {filtered.map((rider, i) => (
                        <motion.div
                            key={rider._id}
                            className="rider-card"
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            {/* Avatar + Info */}
                            <div className="rider-card-left">
                                <div className="rider-card-avatar">
                                    {rider.name?.charAt(0)?.toUpperCase()}
                                </div>
                                <div className="rider-card-info">
                                    <div className="rider-card-name">{rider.name}</div>
                                    <div className="rider-card-meta">
                                        <span><Mail size={11} /> {rider.email}</span>
                                        {rider.phone && <span><Phone size={11} /> {rider.phone}</span>}
                                    </div>
                                </div>
                            </div>

                            {/* Zones */}
                            <div className="rider-card-zones">
                                {editingId === rider._id ? (
                                    <div className="zone-editor">
                                        <p className="zone-editor-label">Select coverage areas:</p>
                                        <div className="zone-chips-editor">
                                            {DHAKA_AREAS.map(area => (
                                                <button
                                                    key={area}
                                                    className={`zone-chip-btn ${editAreas.includes(area) ? 'selected' : ''}`}
                                                    onClick={() => toggleArea(area)}
                                                >
                                                    {area}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="zone-chips-display">
                                        {rider.assignedAreas?.length > 0
                                            ? rider.assignedAreas.map(a => (
                                                <span key={a} className="zone-chip">
                                                    <MapPin size={10} /> {a}
                                                </span>
                                            ))
                                            : <span className="zone-none">No zones assigned</span>
                                        }
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="rider-card-actions">
                                {editingId === rider._id ? (
                                    <>
                                        <button
                                            className="rc-btn save"
                                            onClick={() => saveAreas(rider._id)}
                                            disabled={savingAreas}
                                            title="Save zones"
                                        >
                                            {savingAreas
                                                ? <div className="mini-spinner" />
                                                : <Check size={15} />
                                            }
                                        </button>
                                        <button className="rc-btn cancel" onClick={cancelEdit} title="Cancel">
                                            <X size={15} />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            className="rc-btn edit"
                                            onClick={() => startEdit(rider)}
                                            title="Edit delivery zones"
                                        >
                                            <Edit2 size={15} />
                                        </button>
                                        <button
                                            className="rc-btn delete"
                                            onClick={() => setDeleteTarget(rider)}
                                            title="Delete rider"
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* ── Add Rider Modal ───────────────────────────── */}
            <Modal
                isOpen={addOpen}
                onClose={() => { setAddOpen(false); setAddForm({ name: '', email: '', password: '', phone: '', assignedAreas: [] }); }}
                title="Add New Rider"
                size="md"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setAddOpen(false)}>Cancel</Button>
                        <Button variant="primary" type="button" loading={adding} onClick={handleAddRider}>
                            Create Rider
                        </Button>
                    </>
                }
            >
                <form onSubmit={handleAddRider} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <Input label="Full Name" value={addForm.name} onChange={e => setAddForm({ ...addForm, name: e.target.value })} required placeholder="e.g. Rahim Hossain" />
                    <Input label="Email Address" type="email" value={addForm.email} onChange={e => setAddForm({ ...addForm, email: e.target.value })} required placeholder="rider@example.com" />
                    <Input label="Password" type="password" value={addForm.password} onChange={e => setAddForm({ ...addForm, password: e.target.value })} required placeholder="Min. 6 characters" />
                    <Input label="Phone (optional)" type="tel" value={addForm.phone} onChange={e => setAddForm({ ...addForm, phone: e.target.value })} placeholder="01XXXXXXXXX" />

                    <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                            Delivery Zones (optional — can set later)
                        </label>
                        <div className="zone-chips-editor" style={{ marginTop: 0 }}>
                            {DHAKA_AREAS.map(area => (
                                <button
                                    key={area}
                                    type="button"
                                    className={`zone-chip-btn ${addForm.assignedAreas.includes(area) ? 'selected' : ''}`}
                                    onClick={() => setAddForm(prev => ({
                                        ...prev,
                                        assignedAreas: prev.assignedAreas.includes(area)
                                            ? prev.assignedAreas.filter(a => a !== area)
                                            : [...prev.assignedAreas, area]
                                    }))}
                                >
                                    {area}
                                </button>
                            ))}
                        </div>
                    </div>
                </form>
            </Modal>

            {/* ── Delete Confirmation ───────────────────────── */}
            {deleteTarget && (
                <div
                    style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}
                    onClick={() => !deleting && setDeleteTarget(null)}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.93 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{ background: 'var(--surface)', borderRadius: 18, padding: '2rem', width: '100%', maxWidth: 400, border: '1px solid var(--border-light)', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                            <AlertTriangle size={24} color="#ef4444" />
                        </div>
                        <h3 style={{ textAlign: 'center', fontWeight: 800, marginBottom: '0.4rem' }}>Delete Rider?</h3>
                        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>
                            This will permanently remove:
                        </p>
                        <div style={{ textAlign: 'center', background: 'var(--background)', borderRadius: 10, padding: '0.75rem', border: '1px solid var(--border-light)', marginBottom: '1.25rem' }}>
                            <div style={{ fontWeight: 700 }}>{deleteTarget.name}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{deleteTarget.email}</div>
                        </div>
                        <p style={{ textAlign: 'center', color: '#ef4444', fontSize: '0.8rem', fontWeight: 600, marginBottom: '1.5rem' }}>
                            ⚠️ This action cannot be undone.
                        </p>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button
                                onClick={() => setDeleteTarget(null)}
                                disabled={deleting}
                                style={{ flex: 1, padding: '0.7rem', borderRadius: 10, border: '1px solid var(--border-light)', background: 'transparent', color: 'var(--text-primary)', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem' }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                style={{ flex: 1, padding: '0.7rem', borderRadius: 10, border: 'none', background: deleting ? 'var(--border-light)' : '#ef4444', color: 'white', fontWeight: 700, cursor: deleting ? 'not-allowed' : 'pointer', fontSize: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                            >
                                {deleting ? <><div className="mini-spinner" /> Deleting...</> : <><Trash2 size={14} /> Delete</>}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </motion.div>
    );
};

export default Riders;
