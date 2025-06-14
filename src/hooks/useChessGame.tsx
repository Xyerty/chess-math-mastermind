
import { useOpponent } from '../contexts/OpponentContext';
import { GameMode } from '../features/chess/types';
import { useGameState } from './useGameState';
import { useGameTimer } from './useGameTimer';
import { useAIEngine } from './useAIEngine';
import { useMoveHandler } from './useMoveHandler';
import { useHint } from './useHint';

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
    makeMove,
    handleSquareClick,
  } = useMoveHandler({
    gameState,
    setGameState,
    gameMode,
    opponentType,
    playerColor,
    isAIThinking
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
  };
};
