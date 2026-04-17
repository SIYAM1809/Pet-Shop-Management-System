import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * RiderRoute — protects /rider/* routes.
 * Only accessible by users with role 'staff' (the rider role).
 * Admins are redirected to their own dashboard.
 * Unauthenticated users go to /login.
 */
const RiderRoute = ({ children }) => {
    const { user, isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="loading-screen" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #f97316', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                <style>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Admin should not access the rider portal
    if (user?.role === 'admin') {
        return <Navigate to="/dashboard" replace />;
    }

    // Only staff (riders) are allowed
    if (user?.role !== 'staff') {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default RiderRoute;
