
import { usePlayFab } from '@/hooks/usePlayFab';
import { useAuth } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { CLERK_ENABLED } from '@/config/clerk';

export const usePlayFabInitialization = () => {
  const { isSignedIn } = useAuth();
  const { loginToPlayFab, playFabData } = usePlayFab();

  useEffect(() => {
    if (CLERK_ENABLED && isSignedIn && !playFabData.isLoggedIn && playFabData.connectionStatus !== 'connecting' && playFabData.connectionStatus !== 'connected') {
      // Use setTimeout to ensure this doesn't block the main thread
      setTimeout(() => {
        loginToPlayFab().catch((error) => {
          console.warn('PlayFab initialization failed, but user can still access the app:', error);
        });
      }, 100);
    }
  }, [isSignedIn, loginToPlayFab, playFabData]);

  return CLERK_ENABLED ? playFabData : {
    isLoggedIn: false,
    connectionStatus: 'disconnected' as const,
    error: null,
    sessionTicket: null,
    playFabId: null,
  };
};
