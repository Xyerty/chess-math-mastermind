
import { useCallback } from 'react';
import { usePlayFabContext } from '@/contexts/PlayFabContext';
import { useGameMode } from '@/contexts/GameModeContext';
import { useDifficulty } from '@/contexts/DifficultyContext';

export const usePlayFabGameTracking = () => {
  const { submitGameResult, trackMathChallenge } = usePlayFabContext();
  const { gameMode } = useGameMode();
  const { aiDifficulty, mathDifficulty } = useDifficulty();

  const trackGameEnd = useCallback(async (gameData: {
    winner: 'white' | 'black' | null;
    gameStatus: string;
    timeSpent: number;
    moveCount: number;
    playerColor?: 'white' | 'black';
    mathStats?: {
      correct: number;
      total: number;
      accuracy: number;
    };
  }) => {
    const won = gameData.winner === gameData.playerColor;
    
    await submitGameResult({
      won,
      gameMode,
      difficulty: aiDifficulty,
      timeSpent: gameData.timeSpent,
      mathAccuracy: gameData.mathStats?.accuracy,
      moveCount: gameData.moveCount,
      gameStatus: gameData.gameStatus
    });
  }, [submitGameResult, gameMode, aiDifficulty]);

  const trackMathChallengeResult = useCallback(async (challengeData: {
    correct: boolean;
    timeSpent: number;
    problemType: string;
  }) => {
    await trackMathChallenge({
      difficulty: mathDifficulty,
      correct: challengeData.correct,
      timeSpent: challengeData.timeSpent,
      problemType: challengeData.problemType
    });
  }, [trackMathChallenge, mathDifficulty]);

  return {
    trackGameEnd,
    trackMathChallengeResult
  };
};
