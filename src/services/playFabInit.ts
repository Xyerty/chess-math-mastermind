
import { usePlayFab } from '@/hooks/usePlayFab';
import { useAuth } from '@clerk/clerk-react';
import { useEffect } from 'react';

export const usePlayFabInitialization = () => {
  const { isSignedIn } = useAuth();
  const { loginToPlayFab, playFabData } = usePlayFab();

  useEffect(() => {
    // Initialize PlayFab in the background after successful authentication
    if (isSignedIn && !playFabData.isLoggedIn && playFabData.connectionStatus !== 'connecting' && playFabData.connectionStatus !== 'connected') {
      // Use setTimeout to ensure this doesn't block the main thread
      setTimeout(() => {
        loginToPlayFab().catch((error) => {
          console.warn('PlayFab initialization failed, but user can still access the app:', error);
        });
      }, 100);
    }
  }, [isSignedIn, loginToPlayFab, playFabData]);

  return playFabData;
};
