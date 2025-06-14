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

const findKing = (board: ChessPiece[][], player: Player): { row: number, col: number } | null => {
  const kingPiece = player === 'white' ? 'wk' : 'bk';
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (board[r][c] === kingPiece) {
        return { row: r, col: c };
      }
    }
  }
  return null;
};

const isPathClear = (board: ChessPiece[][], from: { row: number; col: number }, to: { row: number; col: number }): boolean => {
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

const isValidMoveInternal = (board: ChessPiece[][], from: { row: number; col: number }, to: { row: number; col: number }): boolean => {
  const piece = board[from.row][from.col];
  if (!piece) return false;

  const pieceColor = piece[0] as 'w' | 'b';
  const pieceType = piece[1];
  const targetPiece = board[to.row][to.col];

  if (targetPiece && targetPiece[0] === pieceColor) return false;
  if (from.row === to.row && from.col === to.col) return false;

  const rowDiff = Math.abs(to.row - from.row);
  const colDiff = Math.abs(to.col - from.col);

  switch (pieceType) {
    case 'p':
      const direction = pieceColor === 'w' ? -1 : 1;
      const startRow = pieceColor === 'w' ? 6 : 1;
      
      if (from.col === to.col) {
        if (to.row === from.row + direction && !targetPiece) return true;
        if (from.row === startRow && to.row === from.row + 2 * direction && !targetPiece && !board[from.row+direction][from.col]) return true;
      } else if (Math.abs(from.col - to.col) === 1 && to.row === from.row + direction && targetPiece) {
        return true;
      }
      return false;
    case 'r': return (rowDiff === 0 || colDiff === 0) && isPathClear(board, from, to);
    case 'n': return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
    case 'b': return rowDiff === colDiff && isPathClear(board, from, to);
    case 'q': return (rowDiff === 0 || colDiff === 0 || rowDiff === colDiff) && isPathClear(board, from, to);
    case 'k': return rowDiff <= 1 && colDiff <= 1;
    default: return false;
  }
};

const isSquareAttacked = (board: ChessPiece[][], row: number, col: number, attackerColor: Player): boolean => {
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const piece = board[r][c];
            if (piece && piece[0] === attackerColor[0]) {
                if (isValidMoveInternal(board, { row: r, col: c }, { row, col })) {
                    return true;
                }
            }
        }
    }
    return false;
};

const isKingInCheck = (board: ChessPiece[][], playerColor: Player): boolean => {
    const kingPos = findKing(board, playerColor);
    if (!kingPos) return true; // Should not happen, but if king is gone, it's a game-over state.
    const opponentColor = playerColor === 'white' ? 'black' : 'white';
    return isSquareAttacked(board, kingPos.row, kingPos.col, opponentColor);
};


// Simple AI move generator
const generateAIMove = (board: ChessPiece[][], player: Player, difficulty: 'easy' | 'medium' | 'hard'): ChessMove | null => {
  const possibleMoves: ChessMove[] = [];
  
  // Find all possible moves for AI player
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece[0] === player[0]) {
        for (let toRow = 0; toRow < 8; toRow++) {
          for (let toCol = 0; toCol < 8; toCol++) {
            if (isValidMoveInternal(board, { row, col }, { row: toRow, col: toCol })) {
              const tempBoard = board.map(r => [...r]);
              tempBoard[toRow][toCol] = piece;
              tempBoard[row][col] = null;
              if (!isKingInCheck(tempBoard, player)) {
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
