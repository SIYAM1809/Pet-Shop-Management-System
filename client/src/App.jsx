import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';
import MainLayout from './components/layout/MainLayout';
import PublicLayout from './components/layout/PublicLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Pets from './pages/Pets';
import Customers from './pages/Customers';
import Orders from './pages/Orders';
import Appointments from './pages/Admin/Appointments'; // Import Appointments
import Reviews from './pages/Admin/Reviews'; // Import Reviews
import Subscribers from './pages/Admin/Subscribers'; // Import Subscribers
import Settings from './pages/Settings';
import Home from './pages/Public/Home';
import BrowsePets from './pages/Public/BrowsePets';
import TrackOrder from './pages/Public/TrackOrder';
import SubmitReview from './pages/Public/SubmitReview';
import Accessories from './pages/Public/Accessories';
import AccessoryDetail from './pages/Public/AccessoryDetail';
import Products from './pages/Admin/Products';
import AdminRoute from './components/layout/AdminRoute';
import RiderRoute from './components/layout/RiderRoute';
import RiderLayout from './pages/Rider/RiderLayout';
import RiderDashboard from './pages/Rider/RiderDashboard';
import MyDeliveries from './pages/Rider/MyDeliveries';
import RiderProfile from './pages/Rider/RiderProfile';
import RiderSettings from './pages/Rider/RiderSettings';
import AdminDeliveries from './pages/Admin/Deliveries';
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
    // Redirect staff (riders) to their portal, admins to dashboard, customers to home
    if (user?.role === 'admin') {
      return <Navigate to="/dashboard" replace />;
    }
    if (user?.role === 'staff') {
      return <Navigate to="/rider" replace />;
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
        <Route path="accessories" element={<Accessories />} />
        <Route path="accessories/:id" element={<AccessoryDetail />} />
        <Route path="track" element={<TrackOrder />} />
        <Route path="submit-review" element={<SubmitReview />} />
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
        <Route path="appointments" element={<Appointments />} />
        <Route path="pets" element={<Pets />} />
        <Route path="products" element={<Products />} />
        <Route path="customers" element={<Customers />} />
        <Route path="orders" element={<Orders />} />
        <Route path="deliveries" element={<AdminDeliveries />} />
        <Route path="reviews" element={<Reviews />} />
        <Route path="subscribers" element={<Subscribers />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Rider Portal Routes */}
      <Route
        path="/rider"
        element={
          <RiderRoute>
            <RiderLayout />
          </RiderRoute>
        }
      >
        <Route index element={<RiderDashboard />} />
        <Route path="deliveries" element={<MyDeliveries />} />
        <Route path="profile" element={<RiderProfile />} />
        <Route path="settings" element={<RiderSettings />} />
      </Route>

      {/* Admin Redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
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
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
