
import React, { useState, useCallback, useEffect } from 'react';
import { ChessGameState, ChessMove, GameStatus, ChessPiece, GameMode } from '../features/chess/types';
import { defaultPosition } from '../features/chess/constants';
import { isKingInCheck } from '../features/chess/utils/board';
import { isValidMoveInternal } from '../features/chess/utils/moveValidation';
import { generateAIMove } from '../features/chess/utils/ai';

type HandleSquareClickResult = 
  | { type: 'selected'; payload: { row: number; col: number } }
  | { type: 'deselected' }
  | { type: 'move_attempt'; payload: { from: { row: number; col: number }; to: { row: number; col: number } } };

const getInitialTime = (gameMode: GameMode) => {
  switch (gameMode) {
    case 'speed':
      return 180; // 3 minutes
    case 'classic':
    case 'math-master':
    default:
      return 600; // 10 minutes
  }
};

export const useChessGame = (aiDifficulty: 'easy' | 'medium' | 'hard', gameMode: GameMode) => {
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

  useEffect(() => {
    if (gameState.gameStatus !== 'playing') {
      return;
    }
    const timer = setInterval(() => {
      setGameState(prev => {
        if (prev.gameStatus !== 'playing') {
            clearInterval(timer);
            return prev;
        }
        const newTime = { ...prev.time };
        const newCurrentPlayerTime = newTime[prev.currentPlayer] - 1;

        if (newCurrentPlayerTime <= 0) {
          clearInterval(timer);
          return { ...prev, time: { ...newTime, [prev.currentPlayer]: 0 }, gameStatus: 'timeout' };
        }
        return { ...prev, time: { ...newTime, [prev.currentPlayer]: newCurrentPlayerTime } };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState.gameStatus, gameState.currentPlayer]);

  const makeMove = useCallback((from: { row: number; col: number }, to: { row: number; col: number }): boolean => {
    if (gameState.gameStatus !== 'playing' && gameState.gameStatus !== 'check') return false;
    if (!isValidMoveInternal(gameState.board, from, to)) return false;

    const tempBoard = gameState.board.map(row => [...row]);
    const piece = tempBoard[from.row][from.col];
    const captured = gameState.board[to.row][to.col];

    tempBoard[to.row][to.col] = piece;
    tempBoard[from.row][from.col] = null;

    if (isKingInCheck(tempBoard, gameState.currentPlayer)) {
      console.log("Illegal move: king would be in check.");
      return false;
    }

    const newBoard = tempBoard;
    const nextPlayer = gameState.currentPlayer === 'white' ? 'black' : 'white';

    const newIsInCheck = isKingInCheck(newBoard, nextPlayer);
    const opponentHasMoves = generateAIMove(newBoard, nextPlayer, 'hard') !== null;

    let newGameStatus: GameStatus = 'playing';
    if (!opponentHasMoves) {
      newGameStatus = newIsInCheck ? 'checkmate' : 'stalemate';
    } else if (newIsInCheck) {
      newGameStatus = 'check';
    }

    const move: ChessMove = { from, to, piece, captured, timestamp: Date.now() };

    setGameState(prev => {
      const newTime = { ...prev.time };
      if (gameMode === 'speed') {
        newTime[prev.currentPlayer] += 2; // +2s increment
      }

      return {
        ...prev,
        board: newBoard,
        currentPlayer: nextPlayer,
        moveHistory: [...prev.moveHistory, move],
        selectedSquare: null,
        lastMove: move,
        isInCheck: newIsInCheck,
        gameStatus: newGameStatus,
        moveCount: prev.currentPlayer === 'black' ? prev.moveCount + 1 : prev.moveCount,
        time: newTime,
      }
    });

    if (nextPlayer === 'black' && newGameStatus !== 'checkmate' && newGameStatus !== 'stalemate') {
      setTimeout(() => {
        setGameState(prev => {
          if (prev.currentPlayer !== 'black' || (prev.gameStatus !== 'playing' && prev.gameStatus !== 'check')) return prev;

          const aiMoveResult = generateAIMove(prev.board, 'black', aiDifficulty);
          if (aiMoveResult) {
            const { move: aiMove, score, thinkingTime } = aiMoveResult;

            const aiBoardCopy = prev.board.map(row => [...row]);
            aiBoardCopy[aiMove.to.row][aiMove.to.col] = aiBoardCopy[aiMove.from.row][aiMove.from.col];
            aiBoardCopy[aiMove.from.row][aiMove.from.col] = null;

            const playerAfterAI = 'white';
            const isPlayerInCheckAfterAI = isKingInCheck(aiBoardCopy, playerAfterAI);
            const playerHasMovesAfterAI = generateAIMove(aiBoardCopy, playerAfterAI, 'hard') !== null;
            
            let gameStatusAfterAI: GameStatus = 'playing';
            if (!playerHasMovesAfterAI) {
                gameStatusAfterAI = isPlayerInCheckAfterAI ? 'checkmate' : 'stalemate';
            } else if (isPlayerInCheckAfterAI) {
                gameStatusAfterAI = 'check';
            }
            
            const newTime = { ...prev.time };
            if (gameMode === 'speed') {
                newTime.black += 2; // +2s increment for AI
            }

            return {
              ...prev,
              board: aiBoardCopy,
              currentPlayer: playerAfterAI,
              moveHistory: [...prev.moveHistory, aiMove],
              lastMove: aiMove,
              isInCheck: isPlayerInCheckAfterAI,
              gameStatus: gameStatusAfterAI,
              time: newTime,
              aiStats: { score, thinkingTime },
            };
          }
          return prev;
        });
      }, 1000);
    }

    return true;
  }, [gameState, aiDifficulty, gameMode]);

  const handleSquareClick = useCallback((row: number, col: number): HandleSquareClickResult | null => {
    if (gameState.gameStatus !== 'playing' && gameState.gameStatus !== 'check') {
        return null;
    }

    const piece = gameState.board[row][col];
    
    if (gameState.selectedSquare) {
      if (gameState.selectedSquare.row === row && gameState.selectedSquare.col === col) {
        setGameState(prev => ({ ...prev, selectedSquare: null }));
        return { type: 'deselected' };
      } else {
        return { type: 'move_attempt', payload: { from: gameState.selectedSquare, to: { row, col } } };
      }
    } else {
      if (piece && piece[0] === gameState.currentPlayer[0]) {
        setGameState(prev => ({ ...prev, selectedSquare: { row, col } }));
        return { type: 'selected', payload: { row, col } };
      }
    }
    return null;
  }, [gameState.board, gameState.selectedSquare, gameState.currentPlayer, gameState.gameStatus]);

  const clearSelection = useCallback(() => {
    setGameState(prev => ({ ...prev, selectedSquare: null }));
  }, []);
  
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

  return {
    gameState,
    handleSquareClick,
    makeMove,
    clearSelection,
    resetGame,
  };
};
