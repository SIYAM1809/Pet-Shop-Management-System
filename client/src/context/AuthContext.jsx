import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            if (token) {
                try {
                    const data = await authAPI.getMe();
                    setUser(data.user);
                } catch (error) {
                    // Only log out on 401 (invalid/expired token).
                    // Network errors (server restarting) should NOT clear the session.
                    const isAuthError =
                        error.message?.includes('Not authorized') ||
                        error.message?.includes('token') ||
                        error.message?.includes('401');
                    if (isAuthError) {
                        console.error('Auth token invalid — logging out:', error.message);
                        logout();
                    } else {
                        console.warn('Could not reach server during auth init (server may be starting up):', error.message);
                        // Keep the token; user can retry actions manually
                    }
                }
            }
            setLoading(false);
        };

        initAuth();
    }, [token]);

    const login = async (email, password) => {
        const data = await authAPI.login({ email, password });
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data.user);
        return data;
    };

    const register = async (name, email, password) => {
        const data = await authAPI.register({ name, email, password });
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data.user);
        return data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    const value = {
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
