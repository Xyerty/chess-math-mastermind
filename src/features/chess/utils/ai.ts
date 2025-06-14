
import { ChessMove, ChessPiece, Player } from '../types';
import { pieceValues } from '../constants';
import { isValidMoveInternal } from './moveValidation';
import { isKingInCheck } from './board';

// Simple AI move generator
export const generateAIMove = (board: ChessPiece[][], player: Player, difficulty: 'easy' | 'medium' | 'hard'): ChessMove | null => {
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
