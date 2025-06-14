import React, { useState, useCallback } from 'react';

export type ChessPiece = 'wp' | 'wn' | 'wb' | 'wr' | 'wq' | 'wk' | 'bp' | 'bn' | 'bb' | 'br' | 'bq' | 'bk' | null;
export type GameStatus = 'playing' | 'check' | 'checkmate' | 'stalemate';
export type Player = 'white' | 'black';

export interface ChessMove {
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

const pieceValues = { 'p': 1, 'n': 3, 'b': 3, 'r': 5, 'q': 9, 'k': 100 };

// Simple AI move generator
const generateAIMove = (board: ChessPiece[][], player: Player, difficulty: 'easy' | 'medium' | 'hard'): ChessMove | null => {
  const possibleMoves: ChessMove[] = [];
  
  // Find all possible moves for AI player
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece[0] === player[0]) {
        // Generate moves for this piece (simplified)
        for (let toRow = 0; toRow < 8; toRow++) {
          for (let toCol = 0; toCol < 8; toCol++) {
            if (isValidAIMove(board, { row, col }, { row: toRow, col: toCol })) {
              possibleMoves.push({
                from: { row, col },
                to: { row: toRow, col: toCol },
                piece,
                captured: board[toRow][toCol],
                timestamp: Date.now()
              });
            }
          }
        }
      }
    }
  }
  
  if (possibleMoves.length === 0) return null;

  if (difficulty === 'easy') {
    // Easy: return random move
    return possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
  }

  if (difficulty === 'medium') {
    // Medium: prefer captures, otherwise random
    const captureMoves = possibleMoves.filter(move => move.captured);
    if (captureMoves.length > 0) {
      return captureMoves[Math.floor(Math.random() * captureMoves.length)];
    }
    return possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
  }

  if (difficulty === 'hard') {
    // Hard: choose move with best outcome (simple evaluation)
    let bestScore = -Infinity;
    let bestMoves: ChessMove[] = [];

    for (const move of possibleMoves) {
      let score = 0;
      if (move.captured) {
        const pieceType = move.captured[1];
        score = pieceValues[pieceType as keyof typeof pieceValues] || 0;
      }
      
      if (score > bestScore) {
        bestScore = score;
        bestMoves = [move];
      } else if (score === bestScore) {
        bestMoves.push(move);
      }
    }
    
    if (bestMoves.length > 0) {
      return bestMoves[Math.floor(Math.random() * bestMoves.length)];
    }
    return possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
  }
  
  return possibleMoves.length > 0 ? possibleMoves[Math.floor(Math.random() * possibleMoves.length)] : null;
};

const isValidAIMove = (board: ChessPiece[][], from: { row: number; col: number }, to: { row: number; col: number }): boolean => {
  const piece = board[from.row][from.col];
  if (!piece) return false;

  const pieceColor = piece[0] as 'w' | 'b';
  const pieceType = piece[1];
  const targetPiece = board[to.row][to.col];

  // Can't capture own pieces
  if (targetPiece && targetPiece[0] === pieceColor) return false;

  // Can't move to same square
  if (from.row === to.row && from.col === to.col) return false;

  // Basic movement validation
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
      return (rowDiff === 0 || colDiff === 0) && isPathClearAI(board, from, to);

    case 'n': // Knight
      return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);

    case 'b': // Bishop
      return rowDiff === colDiff && isPathClearAI(board, from, to);

    case 'q': // Queen
      return (rowDiff === 0 || colDiff === 0 || rowDiff === colDiff) && isPathClearAI(board, from, to);

    case 'k': // King
      return rowDiff <= 1 && colDiff <= 1;

    default:
      return false;
  }
};

const isPathClearAI = (board: ChessPiece[][], from: { row: number; col: number }, to: { row: number; col: number }): boolean => {
  const rowStep = Math.sign(to.row - from.row);
  const colStep = Math.sign(to.col - from.col);
  let currentRow = from.row + rowStep;
  let currentCol = from.col + colStep;

  while (currentRow !== to.row || currentCol !== to.col) {
    if (board[currentRow][currentCol] !== null) return false;
    currentRow += rowStep;
    currentCol += colStep;
  }
  return true;
};

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

  const isValidMove = useCallback((from: { row: number; col: number }, to: { row: number; col: number }): boolean => {
    return isValidAIMove(gameState.board, from, to);
  }, [gameState.board]);

  const isPathClear = useCallback((from: { row: number; col: number }, to: { row: number; col: number }): boolean => {
    return isPathClearAI(gameState.board, from, to);
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

    // AI move after player move
    if (gameState.currentPlayer === 'white') {
      setTimeout(() => {
        const aiMove = generateAIMove(newBoard, 'black', aiDifficulty);
        if (aiMove) {
          const aiBoardCopy = newBoard.map(row => [...row]);
          aiBoardCopy[aiMove.to.row][aiMove.to.col] = aiBoardCopy[aiMove.from.row][aiMove.from.col];
          aiBoardCopy[aiMove.from.row][aiMove.from.col] = null;

          setGameState(prev => ({
            ...prev,
            board: aiBoardCopy,
            currentPlayer: 'white',
            moveHistory: [...prev.moveHistory, aiMove],
            lastMove: aiMove,
          }));
        }
      }, 1000);
    }

    return true;
  }, [gameState.board, gameState.currentPlayer, isValidMove, aiDifficulty]);

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
