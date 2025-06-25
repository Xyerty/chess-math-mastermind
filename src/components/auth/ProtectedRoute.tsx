
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { Navigate, Outlet } from 'react-router-dom';

export const ProtectedRoute = () => {
  const session = useSession();
  const supabase = useSupabaseClient();

  if (!session) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};
