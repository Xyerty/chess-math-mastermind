
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChessGame } from './useChessGame';
import { Player } from '../features/chess/types';

type ChessGameHook = ReturnType<typeof useChessGame>;

type UseGameControllerProps = {
  chessGame: ChessGameHook;
  navigate: ReturnType<typeof useNavigate>;
};

export const useGameController = ({ chessGame, navigate }: UseGameControllerProps) => {
  const {
    gameState,
    handleSquareClick,
    makeMove,
    clearSelection,
    resetGame,
    resignGame,
    requestHint,
    clearHint,
    completeMathChallenge,
    cancelMathChallenge,
    executePendingMove,
  } = chessGame;

  const [showHint, setShowHint] = useState(false);

  const onChessBoardClick = useCallback((row: number, col: number) => {
    try {
      const result = handleSquareClick(row, col);

      if (result?.type === 'move_attempt') {
        const moveSuccessful = makeMove(result.payload.from, result.payload.to);
        if (!moveSuccessful) {
          clearSelection();
        }
      } else if (result?.type === 'math_challenge') {
        console.log('Math challenge triggered for move:', result.payload);
      }
    } catch (error) {
      console.error('Error handling chess board click:', error);
      clearSelection();
    }
  }, [handleSquareClick, makeMove, clearSelection]);

  const handleNewGame = () => {
    try {
      resetGame();
      setShowHint(false);
    } catch (error) {
      console.error('Error starting new game:', error);
    }
  };

  const handleHintRequest = async () => {
    try {
      await requestHint();
      setShowHint(true);
    } catch (error) {
      console.error('Error requesting hint:', error);
    }
  };

  const handleCloseHint = () => {
    setShowHint(false);
    clearHint();
  };

  const handleMathSuccess = useCallback(() => {
    try {
      const moveExecuted = executePendingMove();
      completeMathChallenge(true);
      if (!moveExecuted) {
        console.error('Failed to execute pending move after math success');
      }
    } catch (error) {
      console.error('Error executing move after math success:', error);
      completeMathChallenge(false);
    }
  }, [executePendingMove, completeMathChallenge]);

  const handleMathFailure = useCallback(() => {
    try {
      completeMathChallenge(false);
      clearSelection(); // Clear selection since move failed
    } catch (error) {
      console.error('Error handling math failure:', error);
    }
  }, [completeMathChallenge, clearSelection]);

  const handleMathCancel = useCallback(() => {
    try {
      cancelMathChallenge();
      clearSelection();
    } catch (error) {
      console.error('Error canceling math challenge:', error);
    }
  }, [cancelMathChallenge, clearSelection]);

  const handleGoHome = () => {
    navigate('/');
  };

  const isGameOver = ['checkmate', 'stalemate', 'timeout', 'resigned'].includes(gameState.gameStatus);
  
  let winner: Player | null = null;
  if (gameState.gameStatus === 'checkmate' || gameState.gameStatus === 'timeout') {
    winner = gameState.currentPlayer === 'white' ? 'black' : 'white';
  } else if (gameState.gameStatus === 'resigned') {
    winner = gameState.currentPlayer === 'white' ? 'black' : 'white';
  }

  return {
    showHint,
    onChessBoardClick,
    handleNewGame,
    handleHintRequest,
    handleCloseHint,
    handleMathSuccess,
    handleMathFailure,
    handleMathCancel,
    handleGoHome,
    isGameOver,
    winner,
    resignGame,
  };
};
