
import { useState, useCallback } from 'react';
import { GameMode } from '../features/chess/types';

export interface MathChallengeState {
  isActive: boolean;
  pendingMove: { from: { row: number; col: number }; to: { row: number; col: number } } | null;
  difficulty: 'easy' | 'medium' | 'hard';
  correctAnswers: number;
  totalAttempts: number;
  streak: number;
}

interface UseMathChallengeProps {
  gameMode: GameMode;
  moveCount: number;
}

export const useMathChallenge = ({ gameMode, moveCount }: UseMathChallengeProps) => {
  const [mathState, setMathState] = useState<MathChallengeState>({
    isActive: false,
    pendingMove: null,
    difficulty: 'easy',
    correctAnswers: 0,
    totalAttempts: 0,
    streak: 0,
  });

  // Determine math difficulty based on game progress
  const getMathDifficulty = useCallback((): 'easy' | 'medium' | 'hard' => {
    if (moveCount <= 10) return 'easy';
    if (moveCount <= 20) return 'medium';
    return 'hard';
  }, [moveCount]);

  const startMathChallenge = useCallback((pendingMove: { from: { row: number; col: number }; to: { row: number; col: number } }) => {
    if (gameMode !== 'math-master') return false;
    
    setMathState(prev => ({
      ...prev,
      isActive: true,
      pendingMove,
      difficulty: getMathDifficulty(),
    }));
    return true;
  }, [gameMode, getMathDifficulty]);

  const completeMathChallenge = useCallback((success: boolean) => {
    setMathState(prev => ({
      ...prev,
      isActive: false,
      correctAnswers: success ? prev.correctAnswers + 1 : prev.correctAnswers,
      totalAttempts: prev.totalAttempts + 1,
      streak: success ? prev.streak + 1 : 0,
    }));
  }, []);

  const cancelMathChallenge = useCallback(() => {
    setMathState(prev => ({
      ...prev,
      isActive: false,
      pendingMove: null,
    }));
  }, []);

  const resetMathStats = useCallback(() => {
    setMathState(prev => ({
      ...prev,
      correctAnswers: 0,
      totalAttempts: 0,
      streak: 0,
    }));
  }, []);

  const accuracy = mathState.totalAttempts > 0 ? Math.round((mathState.correctAnswers / mathState.totalAttempts) * 100) : 100;

  return {
    mathState,
    startMathChallenge,
    completeMathChallenge,
    cancelMathChallenge,
    resetMathStats,
    accuracy,
  };
};
