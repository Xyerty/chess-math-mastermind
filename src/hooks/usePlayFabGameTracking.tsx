
import { useCallback } from 'react';

export const usePlayFabGameTracking = () => {
  const trackGameEnd = useCallback(async (gameData: unknown) => {
    // This feature is temporarily disabled.
    console.log('Game tracking is disabled.', gameData);
    return Promise.resolve();
  }, []);

  const trackMathChallengeResult = useCallback(async (challengeData: unknown) => {
    // This feature is temporarily disabled.
    console.log('Math challenge tracking is disabled.', challengeData);
    return Promise.resolve();
  }, []);

  return {
    trackGameEnd,
    trackMathChallengeResult,
  };
};
