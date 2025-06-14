import { useOpponent } from '../contexts/OpponentContext';
import { GameMode } from '../features/chess/types';
import { useGameState } from './useGameState';
import { useGameTimer } from './useGameTimer';
import { useAIEngine } from './useAIEngine';
import { useMoveHandler } from './useMoveHandler';
import { useHint } from './useHint';
import { useMathChallenge } from './useMathChallenge';

export const useChessGame = (aiDifficulty: 'easy' | 'medium' | 'hard', gameMode: GameMode) => {
  const { opponentType, playerColor } = useOpponent();
  
  const {
    gameState,
    setGameState,
    resetGame,
    resignGame,
    clearSelection,
  } = useGameState(gameMode);

  useGameTimer({ gameState, setGameState, gameMode });

  const {
    isAIThinking,
    usingPythonEngine,
  } = useAIEngine({
    gameState,
    setGameState,
    aiDifficulty,
    gameMode,
    opponentType,
    playerColor
  });

  const {
    mathState,
    startMathChallenge,
    completeMathChallenge,
    cancelMathChallenge,
    resetMathStats,
    accuracy,
  } = useMathChallenge({
    gameMode,
    moveCount: gameState.moveCount,
  });

  const {
    makeMove,
    handleSquareClick,
  } = useMoveHandler({
    gameState,
    setGameState,
    gameMode,
    opponentType,
    playerColor,
    isAIThinking,
    onMathChallenge: (from, to) => startMathChallenge({ from, to }),
  });

  const {
    currentHint,
    isAnalyzing,
    hintsUsed,
    maxHints,
    canRequestHint,
    requestHint,
    clearHint,
    resetHints,
  } = useHint({
    gameState,
    gameMode,
    aiDifficulty,
    usingPythonEngine
  });

  const handleResetGame = () => {
    resetGame();
    resetHints();
    resetMathStats();
  };

  const executePendingMove = () => {
    if (mathState.pendingMove) {
      const success = makeMove(mathState.pendingMove.from, mathState.pendingMove.to);
      return success;
    }
    return false;
  };

  return {
    gameState,
    handleSquareClick,
    makeMove,
    clearSelection,
    resetGame: handleResetGame,
    resignGame,
    isAIThinking,
    usingPythonEngine,
    // Hint functionality
    currentHint,
    isAnalyzing,
    hintsUsed,
    maxHints,
    canRequestHint,
    requestHint,
    clearHint,
    // Math challenge functionality
    mathState,
    completeMathChallenge,
    cancelMathChallenge,
    executePendingMove,
    mathAccuracy: accuracy,
  };
};
