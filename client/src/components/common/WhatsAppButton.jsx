import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const WhatsAppButton = () => {
    const phoneNumber = '8801304054566'; // Added country code
    const message = "Hi! I'm interested in a pet from Siyam's Praniseba.";

    const handleClick = () => {
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    return (
        <motion.button
            onClick={handleClick}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            style={{
                position: 'fixed',
                bottom: '30px',
                right: '30px',
                backgroundColor: '#25D366', // WhatsApp Brand Color
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '60px',
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 15px rgba(37, 211, 102, 0.4)',
                cursor: 'pointer',
                zIndex: 1000
            }}
            aria-label="Chat on WhatsApp"
        >
            <MessageCircle size={32} />
        </motion.button>
    );
};

export default WhatsAppButton;
