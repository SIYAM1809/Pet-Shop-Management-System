import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
    motion: {
        button: ({ children, onClick, disabled, className, type, ...rest }) => (
            <button
                onClick={onClick}
                disabled={disabled}
                className={className}
                type={type}
                data-testid="motion-button"
            >
                {children}
            </button>
        ),
    },
}));

// Mock animation utils
vi.mock('../../../utils/animations', () => ({
    buttonTapVariants: { tap: { scale: 0.98 } },
}));

describe('Button Component', () => {
    it('renders children text', () => {
        render(<Button>Click Me</Button>);
        expect(screen.getByText('Click Me')).toBeInTheDocument();
    });

    it('applies default primary variant class', () => {
        render(<Button>Test</Button>);
        const btn = screen.getByTestId('motion-button');
        expect(btn.className).toContain('btn-primary');
    });

    it('applies custom variant class', () => {
        render(<Button variant="secondary">Test</Button>);
        const btn = screen.getByTestId('motion-button');
        expect(btn.className).toContain('btn-secondary');
    });

    it('applies size class', () => {
        render(<Button size="lg">Test</Button>);
        const btn = screen.getByTestId('motion-button');
        expect(btn.className).toContain('btn-lg');
    });

    it('applies btn-full class when fullWidth is true', () => {
        render(<Button fullWidth>Test</Button>);
        const btn = screen.getByTestId('motion-button');
        expect(btn.className).toContain('btn-full');
    });

    it('is disabled when disabled prop is true', () => {
        render(<Button disabled>Test</Button>);
        const btn = screen.getByTestId('motion-button');
        expect(btn).toBeDisabled();
    });

    it('is disabled when loading is true', () => {
        render(<Button loading>Test</Button>);
        const btn = screen.getByTestId('motion-button');
        expect(btn).toBeDisabled();
    });

    it('shows spinner when loading is true', () => {
        render(<Button loading>Test</Button>);
        // Children text should not be visible when loading
        expect(screen.queryByText('Test')).not.toBeInTheDocument();
    });

    it('calls onClick handler when clicked', () => {
        const handleClick = vi.fn();
        render(<Button onClick={handleClick}>Click Me</Button>);
        fireEvent.click(screen.getByTestId('motion-button'));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when disabled', () => {
        const handleClick = vi.fn();
        render(<Button disabled onClick={handleClick}>Click Me</Button>);
        fireEvent.click(screen.getByTestId('motion-button'));
        expect(handleClick).not.toHaveBeenCalled();
    });

    it('renders with correct type attribute', () => {
        render(<Button type="submit">Submit</Button>);
        expect(screen.getByTestId('motion-button')).toHaveAttribute('type', 'submit');
    });

    it('renders icon on the left by default', () => {
        const icon = <span data-testid="icon">★</span>;
        render(<Button icon={icon}>With Icon</Button>);
        expect(screen.getByTestId('icon')).toBeInTheDocument();
    });

    it('applies additional className', () => {
        render(<Button className="my-custom-class">Test</Button>);
        const btn = screen.getByTestId('motion-button');
        expect(btn.className).toContain('my-custom-class');
    });
});
