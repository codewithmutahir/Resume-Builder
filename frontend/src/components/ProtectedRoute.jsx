import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AppleLoader } from '@/components/ui/AppleLoader';

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-secondary/20">
        <div className="rounded-2xl bg-white shadow-xl shadow-black/5 border border-border/60 px-8 py-6">
          <AppleLoader size={22} label="Loading" />
        </div>
      </div>
    );
  }

  if (!currentUser) {
    const next = `${location.pathname}${location.search || ''}`;
    return <Navigate to={`/login?next=${encodeURIComponent(next)}`} replace />;
  }

  return children;
};

export default ProtectedRoute;
