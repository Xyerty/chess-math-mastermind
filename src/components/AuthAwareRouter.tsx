
import React, { useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useLocation, useNavigate } from 'react-router-dom';

interface AuthAwareRouterProps {
  children: React.ReactNode;
}

const AuthAwareRouter: React.FC<AuthAwareRouterProps> = ({ children }) => {
  const { isSignedIn, isLoaded } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Only redirect if auth is loaded and user is signed in
    if (isLoaded && isSignedIn && location.pathname === '/auth') {
      // Immediate redirect to main dashboard using replace to avoid back button issues
      navigate('/', { replace: true });
    }
  }, [isSignedIn, isLoaded, location.pathname, navigate]);

  return <>{children}</>;
};

export default AuthAwareRouter;
