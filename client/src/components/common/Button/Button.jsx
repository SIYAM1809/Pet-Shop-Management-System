import { motion } from 'framer-motion';
import { buttonTapVariants } from '../../../utils/animations';
import './Button.css';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    icon,
    iconPosition = 'left',
    loading = false,
    disabled = false,
    fullWidth = false,
    onClick,
    type = 'button',
    className = '',
    ...props
}) => {
    const classes = [
        'btn',
        `btn-${variant}`,
        `btn-${size}`,
        fullWidth && 'btn-full',
        loading && 'btn-loading',
        className
    ].filter(Boolean).join(' ');

    return (
        <motion.button
            type={type}
            className={classes}
            onClick={onClick}
            disabled={disabled || loading}
            whileTap={!disabled && !loading ? buttonTapVariants.tap : undefined}
            {...props}
        >
            {loading ? (
                <span className="btn-spinner" />
            ) : (
                <>
                    {icon && iconPosition === 'left' && <span className="btn-icon">{icon}</span>}
                    {children && <span>{children}</span>}
                    {icon && iconPosition === 'right' && <span className="btn-icon">{icon}</span>}
                </>
            )}
        </motion.button>
    );
};

export default Button;
