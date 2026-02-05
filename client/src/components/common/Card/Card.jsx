import { motion } from 'framer-motion';
import { cardHoverVariants } from '../../../utils/animations';
import './Card.css';

const Card = ({
    children,
    variant = 'default',
    hover = false,
    className = '',
    padding = true,
    ...props
}) => {
    const classes = [
        'card',
        variant !== 'default' && `card-${variant}`,
        !padding && 'card-no-padding',
        className
    ].filter(Boolean).join(' ');

    if (hover) {
        return (
            <motion.div
                className={classes}
                variants={cardHoverVariants}
                initial="rest"
                whileHover="hover"
                {...props}
            >
                {children}
            </motion.div>
        );
    }

    return (
        <div className={classes} {...props}>
            {children}
        </div>
    );
};

export default Card;
