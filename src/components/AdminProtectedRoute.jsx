import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!user || !['admin', 'super-admin'].includes(user.role)) {
    return <Navigate to="/admin/login" />;
  }

  return children;
}
