import { forwardRef } from 'react';
import './Input.css';

const Input = forwardRef(({
    label,
    error,
    icon,
    type = 'text',
    className = '',
    containerClassName = '',
    ...props
}, ref) => {
    const inputClasses = [
        'input',
        error && 'input-error',
        className
    ].filter(Boolean).join(' ');

    const containerClasses = [
        'input-group',
        icon && 'input-with-icon',
        containerClassName
    ].filter(Boolean).join(' ');

    return (
        <div className={containerClasses}>
            {label && <label className="input-label">{label}</label>}
            <div className="input-wrapper">
                {icon && <span className="input-icon">{icon}</span>}
                <input
                    ref={ref}
                    type={type}
                    className={inputClasses}
                    {...props}
                />
            </div>
            {error && <span className="error-message">{error}</span>}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
