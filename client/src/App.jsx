import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import MainLayout from './components/layout/MainLayout';
import PublicLayout from './components/layout/PublicLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Pets from './pages/Pets';
import Customers from './pages/Customers';
import Orders from './pages/Orders';
import Settings from './pages/Settings';
import Home from './pages/Public/Home';
import BrowsePets from './pages/Public/BrowsePets';
import TrackOrder from './pages/Public/TrackOrder';
import AdminRoute from './components/layout/AdminRoute';
import './styles/index.css';
import './styles/components.css';

const PublicRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
      </div>
    );
  }

  if (isAuthenticated) {
    // Redirect admins/staff to dashboard, others to home
    if (user?.role === 'admin' || user?.role === 'staff') {
      return <Navigate to="/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      {/* Admin Redirect */}
      <Route path="/admin" element={<Navigate to="/dashboard" replace />} />

      {/* Public Storefront Routes */}
      <Route element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="browse" element={<BrowsePets />} />
        <Route path="track" element={<TrackOrder />} />
      </Route>

      {/* Admin Dashboard Routes */}
      <Route
        path="/dashboard"
        element={
          <AdminRoute>
            <MainLayout />
          </AdminRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="pets" element={<Pets />} />
        <Route path="customers" element={<Customers />} />
        <Route path="orders" element={<Orders />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: 'var(--surface)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-lg)'
              },
              success: {
                iconTheme: {
                  primary: 'var(--success)',
                  secondary: 'white'
                }
              },
              error: {
                iconTheme: {
                  primary: 'var(--error)',
                  secondary: 'white'
                }
              }
            }}
          />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
