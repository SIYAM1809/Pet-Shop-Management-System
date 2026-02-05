import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('light'); // Force light mode

    // Legacy support: Clear any saved theme preference
    useEffect(() => {
        localStorage.removeItem('theme');
        document.documentElement.setAttribute('data-theme', 'light');
    }, []);

    const toggleTheme = () => {
        // Disabled: Always stay in light mode
        setTheme('light');
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeContext;
