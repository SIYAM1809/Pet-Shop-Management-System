import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, PawPrint } from 'lucide-react';
import { petAPI } from '../../services/api';
import Button from '../../components/common/Button';
import './Public.css';

const BrowsePets = () => {
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterSpecies, setFilterSpecies] = useState('');

    useEffect(() => {
        const fetchPets = async () => {
            try {
                const response = await petAPI.getAll({ status: 'Available' });
                setPets(response.data);
            } catch (error) {
                console.error("Failed to load pets");
            } finally {
                setLoading(false);
            }
        };
        fetchPets();
    }, []);

    const filteredPets = pets.filter(pet => {
        const matchesSearch = pet.name.toLowerCase().includes(search.toLowerCase()) ||
            pet.breed.toLowerCase().includes(search.toLowerCase());
        const matchesSpecies = filterSpecies ? pet.species === filterSpecies : true;
        return matchesSearch && matchesSpecies;
    });

    const speciesList = [...new Set(pets.map(p => p.species))];

    return (
        <div className="browse-page">
            <div className="page-header-public">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1>Available Pets</h1>
                        <p>Find the perfect companion waiting for a home</p>
                    </motion.div>
                </div>
            </div>

            <div className="container">
                {/* Search & Filter Bar */}
                <div className="filters-card-public" style={{ background: 'var(--surface)', padding: '20px', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', marginBottom: '30px', display: 'flex', gap: '15px', flexWrap: 'wrap', border: '1px solid var(--border-light)' }}>
                    <div className="search-filter" style={{ flex: 1, minWidth: '250px', display: 'flex', alignItems: 'center', background: 'var(--bg-tertiary)', padding: '0 15px', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                        <Search size={18} style={{ color: 'var(--text-secondary)' }} />
                        <input
                            type="text"
                            placeholder="Search by name or breed..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="text-primary placeholder:text-gray-500" // Added Tailwind-like classes or ensure global styles pick this up
                            style={{ border: 'none', background: 'transparent', padding: '12px', width: '100%', outline: 'none', color: 'var(--gray-900)', fontSize: '1rem' }}
                        />
                    </div>
                    <div className="filter-group" style={{ minWidth: '200px' }}>
                        <select
                            value={filterSpecies}
                            onChange={(e) => setFilterSpecies(e.target.value)}
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-light)', background: 'var(--surface)', color: 'var(--text-primary)' }}
                        >
                            <option value="">All Species</option>
                            {speciesList.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
                        <div className="spinner" />
                    </div>
                ) : filteredPets.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '50px', color: '#64748b' }}>
                        <PawPrint size={48} style={{ marginBottom: '15px', opacity: 0.5 }} />
                        <h3>No pets found</h3>
                        <p>Try adjusting your search criteria</p>
                    </div>
                ) : (
                    <div className="browse-grid">
                        {filteredPets.map((pet, index) => (
                            <motion.div
                                key={pet._id}
                                className="public-pet-card"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                            >
                                <div className="pet-image-container">
                                    {pet.image ? (
                                        <img src={pet.image} alt={pet.name} onError={(e) => e.target.style.display = 'none'} />
                                    ) : (
                                        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9' }}>
                                            <PawPrint size={48} color="#cbd5e1" />
                                        </div>
                                    )}
                                    <span className="pet-status-badge" style={{ color: '#10b981' }}>{pet.status}</span>
                                </div>
                                <div className="pet-content">
                                    <h3 className="pet-title">{pet.name}</h3>
                                    <p className="pet-subtitle">{pet.breed}</p>

                                    <div className="pet-attributes">
                                        <div className="attribute">{pet.species}</div>
                                        <div className="attribute">{pet.gender}</div>
                                        <div className="attribute">{pet.age.value} {pet.age.unit}</div>
                                        <div className="attribute">{pet.color}</div>
                                    </div>

                                    <div className="pet-price-row">
                                        <span className="price">${pet.price}</span>
                                        <Button size="sm" variant="primary">Inquire</Button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BrowsePets;
