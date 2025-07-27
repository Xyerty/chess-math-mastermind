
import { useSession } from '@supabase/auth-helpers-react';
import { Navigate, Outlet } from 'react-router-dom';

export const ProtectedRoute = () => {
  const session = useSession();

  if (!session) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};
