import { PawPrint } from 'lucide-react';
import './PetMarquee.css';

const PetCard = ({ pet, imageErrors, onImageError }) => (
    <div className="marquee-pet-card">
        <div className="marquee-pet-image">
            {pet.image && !imageErrors[pet._id] ? (
                <img
                    src={pet.image}
                    alt={pet.name}
                    onError={() => onImageError(pet._id)}
                />
            ) : (
                <div className="marquee-pet-placeholder">
                    <PawPrint size={28} />
                </div>
            )}
            <span className={`marquee-badge badge-${pet.status === 'Available' ? 'success' : pet.status === 'Sold' ? 'error' : 'warning'}`}>
                {pet.status}
            </span>
        </div>
        <div className="marquee-pet-info">
            <h4 className="marquee-pet-name">{pet.name}</h4>
            <p className="marquee-pet-breed">{pet.species} · {pet.breed}</p>
            <p className="marquee-pet-price">${pet.price}</p>
        </div>
    </div>
);

const PetMarquee = ({ pets = [], imageErrors = {}, onImageError = () => { } }) => {
    if (!pets.length) return null;

    // Duplicate the list to create a seamless infinite loop
    const doubled = [...pets, ...pets];

    return (
        <div className="pet-marquee-section">
            <div className="pet-marquee-header">
                <PawPrint size={20} className="pet-marquee-icon" />
                <h3 className="pet-marquee-title">Our Pets</h3>
            </div>

            <div className="pet-marquee-wrapper">
                {/* Fade-out edges */}
                <div className="marquee-fade marquee-fade-left" />
                <div className="marquee-fade marquee-fade-right" />

                <div className="marquee-track">
                    {doubled.map((pet, idx) => (
                        <PetCard
                            key={`${pet._id}-${idx}`}
                            pet={pet}
                            imageErrors={imageErrors}
                            onImageError={onImageError}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PetMarquee;
