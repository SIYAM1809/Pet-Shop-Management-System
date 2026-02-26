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

    const chunk1Size = Math.ceil(pets.length / 3);
    const chunk2Size = Math.ceil((pets.length - chunk1Size) / 2);

    const line1Pets = pets.slice(0, chunk1Size);
    const line2Pets = pets.slice(chunk1Size, chunk1Size + chunk2Size);
    const line3Pets = pets.slice(chunk1Size + chunk2Size);

    const doubled1 = [...line1Pets, ...line1Pets];
    const doubled2 = [...line2Pets, ...line2Pets];
    const doubled3 = [...line3Pets, ...line3Pets];

    const renderTrack = (doubledList, directionClass, lineIndex) => {
        if (!doubledList.length) return null;
        return (
            <div className={`marquee-track ${directionClass}`}>
                {doubledList.map((pet, idx) => (
                    <PetCard
                        key={`${pet._id}-line${lineIndex}-${idx}`}
                        pet={pet}
                        imageErrors={imageErrors}
                        onImageError={onImageError}
                    />
                ))}
            </div>
        );
    };

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

                <div className="marquee-tracks-container">
                    {renderTrack(doubled1, 'marquee-track-rtl', 1)}
                    {renderTrack(doubled2, 'marquee-track-ltr', 2)}
                    {renderTrack(doubled3, 'marquee-track-rtl', 3)}
                </div>
            </div>
        </div>
    );
};

export default PetMarquee;
