import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within CartProvider');
    return context;
};

const CART_KEY = 'praniseba_cart';

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        try {
            const saved = localStorage.getItem(CART_KEY);
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (pet) => {
        setCartItems(prev => {
            const exists = prev.find(item => item._id === pet._id);
            if (exists) {
                // Increment quantity if already in cart
                return prev.map(item =>
                    item._id === pet._id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { ...pet, quantity: 1 }];
        });
    };

    const removeFromCart = (petId) => {
        setCartItems(prev => prev.filter(item => item._id !== petId));
    };

    const updateQuantity = (petId, quantity) => {
        if (quantity < 1) {
            removeFromCart(petId);
            return;
        }
        setCartItems(prev =>
            prev.map(item => item._id === petId ? { ...item, quantity } : item)
        );
    };

    const clearCart = () => setCartItems([]);

    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <CartContext.Provider value={{
            cartItems, cartCount, cartTotal,
            addToCart, removeFromCart, updateQuantity, clearCart
        }}>
            {children}
        </CartContext.Provider>
    );
};

export default CartContext;
