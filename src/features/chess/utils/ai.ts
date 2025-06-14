
import { ChessMove, ChessPiece, Player } from '../types';
import { pieceValues } from '../constants';
import { isValidMoveInternal } from './moveValidation';
import { isKingInCheck } from './board';

// Helper to check if a square is attacked by a player.
// This is crucial for the AI to understand threats.
const isSquareAttacked = (board: ChessPiece[][], square: {row: number, col: number}, attacker: Player): boolean => {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece && piece[0] === attacker[0]) {
        // Check if the piece has a valid move to the target square
        if (isValidMoveInternal(board, { row: r, col: c }, square)) {
            // A move is only a threat if it doesn't leave the king in check (i.e., it's a legal move)
            const tempBoard = board.map(r => [...r]);
            tempBoard[square.row][square.col] = piece;
            tempBoard[r][c] = null;
            if (!isKingInCheck(tempBoard, attacker)) {
                return true;
            }
        }
      }
    }
  }
  return false;
};


// Enhanced AI move generator
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
    // Easy: return a completely random move
    return possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
  }

  // For medium and hard, we score moves to find the best one
  let bestScore = -Infinity;
  let bestMoves: ChessMove[] = [];
  const opponent = player === 'white' ? 'black' : 'white';

  for (const move of possibleMoves) {
    let score = 0;
    const capturedValue = move.captured ? pieceValues[move.captured[1] as keyof typeof pieceValues] : 0;
    const movingPieceValue = pieceValues[move.piece![1] as keyof typeof pieceValues];
    
    const tempBoard = board.map(r => [...r]);
    tempBoard[move.to.row][move.to.col] = move.piece;
    tempBoard[move.from.row][move.from.col] = null;
    
    if (difficulty === 'medium') {
      // Medium: Prefers captures, avoids simple blunders.
      score = capturedValue * 10;
      // Check if the move is a blunder (losing a valuable piece for a less valuable or no piece)
      if (isSquareAttacked(tempBoard, move.to, opponent)) {
          score -= movingPieceValue * 5;
      }
    } else { // 'hard'
      // Material advantage
      score += capturedValue * 10;
      
      // Piece safety: penalize moving to an attacked square
      if (isSquareAttacked(tempBoard, move.to, opponent)) {
        score -= movingPieceValue;
      }

      // Center control: bonus for moving pawns or knights/bishops to central squares
      const isCenterSquare = (r: number, c: number) => (r >= 2 && r <= 5) && (c >= 2 && c <= 5);
      if (isCenterSquare(move.to.row, move.to.col)) {
        if (move.piece![1] === 'p' || move.piece![1] === 'n' || move.piece![1] === 'b') {
            score += 1;
        }
      }

      // Development bonus: moving pieces out of their starting positions (not pawns or king)
      const startRow = player === 'white' ? 7 : 0;
      if ((move.from.row === startRow) && (move.piece![1] !== 'p' && move.piece![1] !== 'k')) {
          score += 1.5;
      }
    }
    
    if (score > bestScore) {
      bestScore = score;
      bestMoves = [move];
    } else if (score === bestScore) {
      bestMoves.push(move);
    }
  }
  
  // For medium difficulty, if no move has a positive score (e.g. no captures or good moves), pick a random one.
  if (difficulty === 'medium' && bestScore <= 0) {
      return possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
  }

  if (bestMoves.length > 0) {
    return bestMoves[Math.floor(Math.random() * bestMoves.length)];
  }
  
  // Fallback to a random move if no suitable move is found
  return possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
};
