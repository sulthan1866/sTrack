import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { JSX } from 'react';

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { currentUser } = useAuth();

  return currentUser ? children : <Navigate to="/login" replace />;
}
