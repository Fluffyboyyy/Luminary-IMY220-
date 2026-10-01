import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    fetch('http://localhost:5000/api/auth/me', { credentials: 'include' })
      .then((res) => setStatus(res.ok ? 'in' : 'out'))
      .catch(() => setStatus('out'));
  }, []);

  if (status === 'checking') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="inline-block w-10 h-10 border-4 border-[color:var(--color-gray-light)] border-t-[color:var(--color-primary)] rounded-full animate-spin" />
      </div>
    );
  }

  return status === 'in' ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;