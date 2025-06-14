
import React, { useState, useCallback } from 'react';
import { ChessGameState, ChessMove, GameStatus } from '../features/chess/types';
import { defaultPosition } from '../features/chess/constants';
import { isKingInCheck } from '../features/chess/utils/board';
import { isValidMoveInternal } from '../features/chess/utils/moveValidation';
import { generateAIMove } from '../features/chess/utils/ai';

export const useChessGame = (aiDifficulty: 'easy' | 'medium' | 'hard') => {
  const [gameState, setGameState] = useState<ChessGameState>({
    board: defaultPosition.map(row => [...row]),
    currentPlayer: 'white',
    gameStatus: 'playing',
    moveHistory: [],
    selectedSquare: null,
    lastMove: null,
    isInCheck: false,
    gameStartTime: Date.now(),
    moveCount: 1
  });

  const makeMove = useCallback((from: { row: number; col: number }, to: { row: number; col: number }): boolean => {
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

    setGameState(prev => ({
      ...prev,
      board: newBoard,
      currentPlayer: nextPlayer,
      moveHistory: [...prev.moveHistory, move],
      selectedSquare: null,
      lastMove: move,
      isInCheck: newIsInCheck,
      gameStatus: newGameStatus,
      moveCount: prev.currentPlayer === 'black' ? prev.moveCount + 1 : prev.moveCount
    }));

    if (nextPlayer === 'black' && newGameStatus !== 'checkmate' && newGameStatus !== 'stalemate') {
      setTimeout(() => {
        setGameState(prev => {
          if (prev.currentPlayer !== 'black') return prev;

          const aiMove = generateAIMove(prev.board, 'black', aiDifficulty);
          if (aiMove) {
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

            return {
              ...prev,
              board: aiBoardCopy,
              currentPlayer: playerAfterAI,
              moveHistory: [...prev.moveHistory, aiMove],
              lastMove: aiMove,
              isInCheck: isPlayerInCheckAfterAI,
              gameStatus: gameStatusAfterAI,
            };
          } else {
             // This case is handled by the check at the start of the AI turn.
          }
          return prev;
        });
      }, 1000);
    }

    return true;
  }, [gameState.board, gameState.currentPlayer, aiDifficulty]);

  const selectSquare = useCallback((row: number, col: number) => {
    const piece = gameState.board[row][col];
    
    if (gameState.gameStatus === 'checkmate' || gameState.gameStatus === 'stalemate') {
        return; // Game is over
    }

    if (gameState.selectedSquare) {
      const selected = gameState.selectedSquare;
      if (selected.row === row && selected.col === col) {
        // Deselect
        setGameState(prev => ({ ...prev, selectedSquare: null }));
      } else {
        // Try to move
        const success = makeMove(selected, { row, col });
        if (!success) {
          // Select new piece if it belongs to current player
          if (piece && piece[0] === gameState.currentPlayer[0]) {
            setGameState(prev => ({ ...prev, selectedSquare: { row, col } }));
          } else {
            setGameState(prev => ({ ...prev, selectedSquare: null }));
          }
        }
      }
    } else {
      // Select piece if it belongs to current player
      if (piece && piece[0] === gameState.currentPlayer[0]) {
        setGameState(prev => ({ ...prev, selectedSquare: { row, col } }));
      }
    }
  }, [gameState.board, gameState.selectedSquare, gameState.currentPlayer, gameState.gameStatus, makeMove]);

  const resetGame = useCallback(() => {
    setGameState({
      board: defaultPosition.map(row => [...row]),
      currentPlayer: 'white',
      gameStatus: 'playing',
      moveHistory: [],
      selectedSquare: null,
      lastMove: null,
      isInCheck: false,
      gameStartTime: Date.now(),
      moveCount: 1
    });
  }, []);

  return {
    gameState,
    selectSquare,
    resetGame,
  };
};
