
import { useState, useCallback } from 'react';

export const usePlayFab = () => {
  const [playFabData] = useState({
    isLoggedIn: false,
    connectionStatus: 'disconnected',
    error: 'PlayFab is temporarily disabled.',
  });

  const emptyFunc = useCallback(() => {
    console.log('PlayFab feature is temporarily disabled.');
    return Promise.resolve(null);
  }, []);

  return {
    playFabData,
    loading: false,
    loginToPlayFab: emptyFunc,
    submitGameResult: emptyFunc,
    getLeaderboard: emptyFunc,
    trackMathChallenge: emptyFunc,
    retryConnection: emptyFunc,
  };
};
