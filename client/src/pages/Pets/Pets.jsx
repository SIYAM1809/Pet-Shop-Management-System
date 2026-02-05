import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Search,
    Filter,
    Grid3X3,
    List,
    Edit2,
    Trash2,
    PawPrint,
    X
} from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import { petAPI } from '../../services/api';
import { containerVariants, itemVariants } from '../../utils/animations';
import toast from 'react-hot-toast';
import './Pets.css';

const SPECIES = ['Dog', 'Cat', 'Bird', 'Fish', 'Rabbit', 'Hamster', 'Reptile', 'Other'];
const GENDERS = ['Male', 'Female'];
const STATUSES = ['Available', 'Sold', 'Reserved', 'Adopted'];

const initialFormData = {
    name: '',
    species: 'Dog',
    breed: '',
    age: { value: 1, unit: 'months' },
    gender: 'Male',
    price: '',
    status: 'Available',
    description: '',
    color: '',
    weight: '',
    image: '',
    health: { vaccinated: false, neutered: false, microchipped: false }
};

const Pets = () => {
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('grid');
    const [search, setSearch] = useState('');
    const [filterSpecies, setFilterSpecies] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [editingPet, setEditingPet] = useState(null);
    const [formData, setFormData] = useState(initialFormData);
    const [submitting, setSubmitting] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [petToDelete, setPetToDelete] = useState(null);
    const [imageError, setImageError] = useState({});

    useEffect(() => {
        fetchPets();
    }, [filterSpecies, filterStatus]);

    const fetchPets = async () => {
        try {
            console.log("Fetching pets...");
            const params = {};
            if (filterSpecies) params.species = filterSpecies;
            if (filterStatus) params.status = filterStatus;
            console.log("Params:", params);

            const response = await petAPI.getAll(params);
            console.log("API Response:", response);

            setPets(response.data);
            console.log("Pets set to:", response.data);
        } catch (error) {
            console.error('Failed to fetch pets:', error);
            toast.error('Failed to fetch pets');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (pet = null) => {
        if (pet) {
            setEditingPet(pet);
            setFormData({
                ...pet,
                price: pet.price.toString(),
                weight: pet.weight?.toString() || ''
            });
        } else {
            setEditingPet(null);
            setFormData(initialFormData);
        }
        setModalOpen(true);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name.startsWith('health.')) {
            const healthField = name.split('.')[1];
            setFormData({
                ...formData,
                health: { ...formData.health, [healthField]: checked }
            });
        } else if (name.startsWith('age.')) {
            const ageField = name.split('.')[1];
            setFormData({
                ...formData,
                age: { ...formData.age, [ageField]: ageField === 'value' ? parseInt(value) : value }
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const submitData = {
                ...formData,
                price: parseFloat(formData.price),
                weight: formData.weight ? parseFloat(formData.weight) : undefined
            };

            if (editingPet) {
                await petAPI.update(editingPet._id, submitData);
                toast.success('Pet updated successfully!');
            } else {
                await petAPI.create(submitData);
                toast.success('Pet added successfully!');
            }
            setModalOpen(false);
            fetchPets();
        } catch (error) {
            toast.error(error.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        try {
            await petAPI.delete(petToDelete._id);
            toast.success('Pet deleted successfully!');
            setDeleteModalOpen(false);
            setPetToDelete(null);
            fetchPets();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const filteredPets = pets.filter(pet =>
        pet.name.toLowerCase().includes(search.toLowerCase()) ||
        pet.breed.toLowerCase().includes(search.toLowerCase())
    );

    const getStatusBadge = (status) => {
        const statusMap = {
            'Available': 'success',
            'Sold': 'error',
            'Reserved': 'warning',
            'Adopted': 'info'
        };
        return statusMap[status] || 'neutral';
    };

    return (
        <motion.div
            className="pets-page"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="page-header">
                <div>
                    <h1 className="page-title">Pets</h1>
                    <p className="page-subtitle">Manage your pet inventory</p>
                </div>
                <Button
                    variant="primary"
                    icon={<Plus size={18} />}
                    onClick={() => handleOpenModal()}
                >
                    Add Pet
                </Button>
            </div>



            {/* Filters */}
            <Card className="filters-card">
                <div className="filters-row">
                    <div className="search-filter">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search pets..."
                            className="search-input"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="filter-group">
                        <select
                            className="input select"
                            value={filterSpecies}
                            onChange={(e) => setFilterSpecies(e.target.value)}
                        >
                            <option value="">All Species</option>
                            {SPECIES.map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>

                        <select
                            className="input select"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="">All Status</option>
                            {STATUSES.map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>

                    <div className="view-toggle">
                        <button
                            className={`view-btn ${view === 'grid' ? 'active' : ''}`}
                            onClick={() => setView('grid')}
                        >
                            <Grid3X3 size={18} />
                        </button>
                        <button
                            className={`view-btn ${view === 'list' ? 'active' : ''}`}
                            onClick={() => setView('list')}
                        >
                            <List size={18} />
                        </button>
                    </div>
                </div>
            </Card>

            {/* Pets Grid/List */}
            {loading ? (
                <div className="loading-container">
                    <div className="spinner" />
                </div>
            ) : filteredPets.length === 0 ? (
                <div className="empty-state">
                    <PawPrint size={64} className="empty-state-icon" />
                    <h3 className="empty-state-title">No pets found</h3>
                    <p className="empty-state-description">
                        Add your first pet to get started
                    </p>
                    <Button variant="primary" onClick={() => handleOpenModal()}>
                        Add Pet
                    </Button>
                </div>
            ) : (
                <div className={view === 'grid' ? 'pets-grid' : 'pets-list'}>
                    {filteredPets.map((pet, index) => (
                        <div key={pet._id} className="pet-item-wrapper">
                            <Card hover className="pet-card">
                                <div className="pet-image">
                                    {pet.image && !imageError[pet._id] ? (
                                        <img
                                            src={pet.image}
                                            alt={pet.name}
                                            onError={() => setImageError(prev => ({ ...prev, [pet._id]: true }))}
                                        />
                                    ) : (
                                        <div className="pet-image-placeholder">
                                            <PawPrint size={32} />
                                        </div>
                                    )}
                                    <span className={`badge badge-${getStatusBadge(pet.status)}`}>
                                        {pet.status}
                                    </span>
                                </div>
                                <div className="pet-info">
                                    <h3 className="pet-name">{pet.name}</h3>
                                    <p className="pet-breed">{pet.species} • {pet.breed}</p>
                                    <div className="pet-details">
                                        <span>{pet.age.value} {pet.age.unit}</span>
                                        <span>{pet.gender}</span>
                                    </div>
                                    <div className="pet-footer">
                                        <span className="pet-price">${pet.price}</span>
                                        <div className="pet-actions">
                                            <button
                                                className="action-btn edit"
                                                onClick={() => handleOpenModal(pet)}
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                className="action-btn delete"
                                                onClick={() => {
                                                    setPetToDelete(pet);
                                                    setDeleteModalOpen(true);
                                                }}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    ))}
                </div>
            )}

            {/* Add/Edit Modal */}
            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={editingPet ? 'Edit Pet' : 'Add New Pet'}
                size="lg"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleSubmit}
                            loading={submitting}
                        >
                            {editingPet ? 'Save Changes' : 'Add Pet'}
                        </Button>
                    </>
                }
            >
                <form className="pet-form" onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <Input
                            label="Pet Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                        <div className="input-group">
                            <label className="input-label">Species</label>
                            <select
                                name="species"
                                className="input select"
                                value={formData.species}
                                onChange={handleChange}
                            >
                                {SPECIES.map(s => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>
                        <Input
                            label="Breed"
                            name="breed"
                            value={formData.breed}
                            onChange={handleChange}
                            required
                        />
                        <div className="input-group">
                            <label className="input-label">Gender</label>
                            <select
                                name="gender"
                                className="input select"
                                value={formData.gender}
                                onChange={handleChange}
                            >
                                {GENDERS.map(g => (
                                    <option key={g} value={g}>{g}</option>
                                ))}
                            </select>
                        </div>
                        <div className="age-inputs">
                            <Input
                                label="Age"
                                type="number"
                                name="age.value"
                                value={formData.age.value}
                                onChange={handleChange}
                                min="0"
                                required
                            />
                            <select
                                name="age.unit"
                                className="input select"
                                value={formData.age.unit}
                                onChange={handleChange}
                            >
                                <option value="days">Days</option>
                                <option value="weeks">Weeks</option>
                                <option value="months">Months</option>
                                <option value="years">Years</option>
                            </select>
                        </div>
                        <Input
                            label="Price ($)"
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            min="0"
                            step="0.01"
                            required
                        />
                        <Input
                            label="Color"
                            name="color"
                            value={formData.color}
                            onChange={handleChange}
                        />
                        <Input
                            label="Weight (kg)"
                            type="number"
                            name="weight"
                            value={formData.weight}
                            onChange={handleChange}
                            min="0"
                            step="0.1"
                        />
                        <Input
                            label="Image URL"
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                            placeholder="https://example.com/pet-image.jpg"
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label">Description</label>
                        <textarea
                            name="description"
                            className="input textarea"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Enter pet description..."
                        />
                    </div>

                    <div className="health-options">
                        <label className="input-label">Health Status</label>
                        <div className="checkbox-group">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    name="health.vaccinated"
                                    checked={formData.health.vaccinated}
                                    onChange={handleChange}
                                />
                                <span>Vaccinated</span>
                            </label>
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    name="health.neutered"
                                    checked={formData.health.neutered}
                                    onChange={handleChange}
                                />
                                <span>Neutered</span>
                            </label>
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    name="health.microchipped"
                                    checked={formData.health.microchipped}
                                    onChange={handleChange}
                                />
                                <span>Microchipped</span>
                            </label>
                        </div>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                title="Confirm Delete"
                size="sm"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={handleDelete}>
                            Delete
                        </Button>
                    </>
                }
            >
                <p>Are you sure you want to delete <strong>{petToDelete?.name}</strong>? This action cannot be undone.</p>
            </Modal>
        </motion.div>
    );
};

export default Pets;
