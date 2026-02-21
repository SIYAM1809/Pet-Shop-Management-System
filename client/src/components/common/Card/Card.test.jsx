import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Card from './Card';

// Mock framer-motion
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, className, ...rest }) => (
            <div className={className} data-testid="motion-card">{children}</div>
        ),
    },
}));

vi.mock('../../../utils/animations', () => ({
    cardHoverVariants: { rest: {}, hover: { scale: 1.02 } },
}));

describe('Card Component', () => {
    it('renders children', () => {
        render(<Card><p>Card Content</p></Card>);
        expect(screen.getByText('Card Content')).toBeInTheDocument();
    });

    it('applies default "card" class', () => {
        const { container } = render(<Card>Content</Card>);
        expect(container.firstChild.className).toContain('card');
    });

    it('does not add variant class for default variant', () => {
        const { container } = render(<Card>Content</Card>);
        expect(container.firstChild.className).not.toContain('card-default');
    });

    it('applies variant class for non-default variant', () => {
        const { container } = render(<Card variant="elevated">Content</Card>);
        expect(container.firstChild.className).toContain('card-elevated');
    });

    it('applies card-no-padding class when padding is false', () => {
        const { container } = render(<Card padding={false}>Content</Card>);
        expect(container.firstChild.className).toContain('card-no-padding');
    });

    it('does not apply card-no-padding when padding is true (default)', () => {
        const { container } = render(<Card>Content</Card>);
        expect(container.firstChild.className).not.toContain('card-no-padding');
    });

    it('renders as motion.div (with hover animation) when hover is true', () => {
        render(<Card hover>Hoverable</Card>);
        expect(screen.getByTestId('motion-card')).toBeInTheDocument();
    });

    it('renders as plain div when hover is false (default)', () => {
        const { container } = render(<Card>Static</Card>);
        // Should be a regular div, not motion-card
        expect(container.firstChild.tagName).toBe('DIV');
    });

    it('applies custom className', () => {
        const { container } = render(<Card className="my-card">Content</Card>);
        expect(container.firstChild.className).toContain('my-card');
    });

    it('passes extra props through (e.g. data-testid)', () => {
        render(<Card data-testid="custom-card">Content</Card>);
        expect(screen.getByTestId('custom-card')).toBeInTheDocument();
    });
});
