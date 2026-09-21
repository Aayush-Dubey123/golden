import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import PageTransition from './components/PageTransition';
import { CartProvider } from './context/CartContext';

// Pages
import GoldenLandingPage from './pages/GoldenLandingPage';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Dashboard from './pages/dashboard/Dashboard';
import CreateOrder from './pages/orders/CreateOrder';
import MyOrders from './pages/orders/MyOrders';
import OrderDetails from './pages/orders/OrderDetails';
import { useAuth } from './hooks/useAuth';
import Loader from './components/Loader';

const App = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader />
      </div>
    );
  }

  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Landing & Ordering Page */}
          <Route path="/" element={<PageTransition><GoldenLandingPage /></PageTransition>} />

          {/* Auth Pages */}
          <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
          <Route path="/signup" element={<PageTransition><Signup /></PageTransition>} />

          {/* Protected Customer Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
              <Route path="/create-order" element={<PageTransition><CreateOrder /></PageTransition>} />
              <Route path="/orders" element={<PageTransition><MyOrders /></PageTransition>} />
              <Route path="/orders/:id" element={<PageTransition><OrderDetails /></PageTransition>} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
};

export default App;
