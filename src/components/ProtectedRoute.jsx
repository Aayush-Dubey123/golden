import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Loader from './Loader';

const ProtectedRoute = ({ requireAdmin = false }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <Loader />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin) {
    const isAdmin = user?.user_role === 'SUPERADMIN' || user?.user_role === 'ADMIN';
    if (!isAdmin) {
      return <Navigate to="/orders" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
