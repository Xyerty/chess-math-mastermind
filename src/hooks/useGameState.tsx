
import { useState, useCallback } from 'react';
import { ChessGameState, GameStatus, GameMode } from '../features/chess/types';
import { defaultPosition } from '../features/chess/constants';

const getInitialTime = (gameMode: GameMode) => {
  switch (gameMode) {
    case 'speed':
      return 180; // 3 minutes
    case 'ranked':
    case 'classic':
    case 'math-master':
    default:
      return 600; // 10 minutes
  }
};

export const useGameState = (gameMode: GameMode) => {
  const [gameState, setGameState] = useState<ChessGameState>(() => {
    const initialTime = getInitialTime(gameMode);
    return {
      board: defaultPosition.map(row => [...row]),
      currentPlayer: 'white',
      gameStatus: 'playing',
      moveHistory: [],
      selectedSquare: null,
      lastMove: null,
      isInCheck: false,
      gameStartTime: Date.now(),
      moveCount: 1,
      time: { white: initialTime, black: initialTime },
      aiStats: null,
    };
  });

  const resetGame = useCallback(() => {
    const initialTime = getInitialTime(gameMode);
    setGameState({
      board: defaultPosition.map(row => [...row]),
      currentPlayer: 'white',
      gameStatus: 'playing',
      moveHistory: [],
      selectedSquare: null,
      lastMove: null,
      isInCheck: false,
      gameStartTime: Date.now(),
      moveCount: 1,
      time: { white: initialTime, black: initialTime },
      aiStats: null,
    });
  }, [gameMode]);

  const resignGame = useCallback(() => {
    setGameState(prev => {
      if (prev.gameStatus === 'playing' || prev.gameStatus === 'check') {
        return { ...prev, gameStatus: 'resigned' };
      }
      return prev;
    });
  }, []);

  const clearSelection = useCallback(() => {
    setGameState(prev => ({ ...prev, selectedSquare: null }));
  }, []);

  return {
    gameState,
    setGameState,
    resetGame,
    resignGame,
    clearSelection,
  };
};
