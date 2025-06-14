
import React, { useState, useCallback } from 'react';

export type ChessPiece = 'wp' | 'wn' | 'wb' | 'wr' | 'wq' | 'wk' | 'bp' | 'bn' | 'bb' | 'br' | 'bq' | 'bk' | null;
export type GameStatus = 'playing' | 'check' | 'checkmate' | 'stalemate';
export type Player = 'white' | 'black';

interface ChessMove {
  from: { row: number; col: number };
  to: { row: number; col: number };
  piece: ChessPiece;
  captured?: ChessPiece;
  timestamp: number;
}

interface ChessGameState {
  board: ChessPiece[][];
  currentPlayer: Player;
  gameStatus: GameStatus;
  moveHistory: ChessMove[];
  selectedSquare: { row: number; col: number } | null;
  lastMove: ChessMove | null;
  isInCheck: boolean;
  gameStartTime: number;
  moveCount: number;
}

const defaultPosition: ChessPiece[][] = [
  ["br", "bn", "bb", "bq", "bk", "bb", "bn", "br"],
  ["bp", "bp", "bp", "bp", "bp", "bp", "bp", "bp"],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ["wp", "wp", "wp", "wp", "wp", "wp", "wp", "wp"],
  ["wr", "wn", "wb", "wq", "wk", "wb", "wn", "wr"],
];

export const useChessGame = () => {
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

  const isValidMove = useCallback((from: { row: number; col: number }, to: { row: number; col: number }): boolean => {
    const piece = gameState.board[from.row][from.col];
    if (!piece) return false;

    const pieceColor = piece[0] as 'w' | 'b';
    const pieceType = piece[1];
    const targetPiece = gameState.board[to.row][to.col];

    // Can't capture own pieces
    if (targetPiece && targetPiece[0] === pieceColor) return false;

    // Basic movement validation (simplified)
    const rowDiff = Math.abs(to.row - from.row);
    const colDiff = Math.abs(to.col - from.col);

    switch (pieceType) {
      case 'p': // Pawn
        const direction = pieceColor === 'w' ? -1 : 1;
        const startRow = pieceColor === 'w' ? 6 : 1;
        
        if (from.col === to.col) {
          // Forward move
          if (to.row === from.row + direction && !targetPiece) return true;
          if (from.row === startRow && to.row === from.row + 2 * direction && !targetPiece) return true;
        } else if (Math.abs(from.col - to.col) === 1 && to.row === from.row + direction && targetPiece) {
          // Diagonal capture
          return true;
        }
        return false;

      case 'r': // Rook
        return (rowDiff === 0 || colDiff === 0) && isPathClear(from, to);

      case 'n': // Knight
        return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);

      case 'b': // Bishop
        return rowDiff === colDiff && isPathClear(from, to);

      case 'q': // Queen
        return (rowDiff === 0 || colDiff === 0 || rowDiff === colDiff) && isPathClear(from, to);

      case 'k': // King
        return rowDiff <= 1 && colDiff <= 1;

      default:
        return false;
    }
  }, [gameState.board]);

  const isPathClear = useCallback((from: { row: number; col: number }, to: { row: number; col: number }): boolean => {
    const rowStep = Math.sign(to.row - from.row);
    const colStep = Math.sign(to.col - from.col);
    let currentRow = from.row + rowStep;
    let currentCol = from.col + colStep;

    while (currentRow !== to.row || currentCol !== to.col) {
      if (gameState.board[currentRow][currentCol] !== null) return false;
      currentRow += rowStep;
      currentCol += colStep;
    }
    return true;
  }, [gameState.board]);

  const makeMove = useCallback((from: { row: number; col: number }, to: { row: number; col: number }): boolean => {
    if (!isValidMove(from, to)) return false;

    const newBoard = gameState.board.map(row => [...row]);
    const piece = newBoard[from.row][from.col];
    const captured = newBoard[to.row][to.col];

    newBoard[to.row][to.col] = piece;
    newBoard[from.row][from.col] = null;

    const move: ChessMove = {
      from,
      to,
      piece,
      captured,
      timestamp: Date.now()
    };

    setGameState(prev => ({
      ...prev,
      board: newBoard,
      currentPlayer: prev.currentPlayer === 'white' ? 'black' : 'white',
      moveHistory: [...prev.moveHistory, move],
      selectedSquare: null,
      lastMove: move,
      moveCount: prev.currentPlayer === 'black' ? prev.moveCount + 1 : prev.moveCount
    }));

    return true;
  }, [gameState.board, isValidMove]);

  const selectSquare = useCallback((row: number, col: number) => {
    const piece = gameState.board[row][col];
    
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
  }, [gameState.board, gameState.selectedSquare, gameState.currentPlayer, makeMove]);

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
    makeMove,
    resetGame,
    isValidMove
  };
};
