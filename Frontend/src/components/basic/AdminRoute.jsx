import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const [status, setStatus] = React.useState('checking');

  React.useEffect(() => {
    fetch('http://localhost:5000/api/auth/me', { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : null))
      .then((user) => setStatus(user?.isAdmin ? 'admin' : 'not-admin'))
      .catch(() => setStatus('not-admin'));
  }, []);

  if (status === 'checking') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="inline-block w-10 h-10 border-4 border-[color:var(--color-gray-light)] border-t-[color:var(--color-primary)] rounded-full animate-spin" />
      </div>
    );
  }

  if (status === 'not-admin') {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default AdminRoute;