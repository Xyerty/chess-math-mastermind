import { ChessMove, ChessPiece, Player } from '../types';
import { pieceValues } from '../constants';
import { isValidMoveInternal } from './moveValidation';
import { isKingInCheck } from './board';

export interface AIMoveResult {
  move: ChessMove;
  score: number;
  thinkingTime: number; // in milliseconds
}

// Helper to check if a square is attacked by a player.
// This is crucial for the AI to understand threats.
const isSquareAttacked = (board: ChessPiece[][], square: {row: number, col: number}, attacker: Player): boolean => {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece && piece[0] === attacker[0]) {
        // Check if the piece has a valid move to the target square
        if (isValidMoveInternal(board, { row: r, col: c }, square, null)) {
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

const getKingPosition = (board: ChessPiece[][], player: Player): {row: number, col: number} | null => {
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (board[r][c] === `${player[0]}k`) {
                return { row: r, col: c };
            }
        }
    }
    return null;
};

const evaluateKingSafety = (board: ChessPiece[][], player: Player, opponent: Player): number => {
    const kingPos = getKingPosition(board, player);
    if (!kingPos) return 0;

    let safetyScore = 0;
    // Simple metric: check for nearby opponent pieces
    for (let dr = -2; dr <= 2; dr++) {
        for (let dc = -2; dc <= 2; dc++) {
            if (dr === 0 && dc === 0) continue;
            const r = kingPos.row + dr;
            const c = kingPos.col + dc;
            if (r >= 0 && r < 8 && c >= 0 && c < 8) {
                const piece = board[r][c];
                if (piece && piece[0] === opponent[0]) {
                    // Closer and more powerful pieces are a bigger threat
                    const distance = Math.sqrt(dr*dr + dc*dc);
                    const pieceValue = pieceValues[piece[1] as keyof typeof pieceValues];
                    safetyScore -= (pieceValue / distance);
                }
            }
        }
    }
    return safetyScore;
};

// Enhanced AI move generator
export const generateAIMove = (board: ChessPiece[][], player: Player, difficulty: 'easy' | 'medium' | 'hard', lastMove: ChessMove | null = null): AIMoveResult | null => {
  const startTime = performance.now();
  const possibleMoves: ChessMove[] = [];
  
  // Find all possible moves for AI player
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece[0] === player[0]) {
        for (let toRow = 0; toRow < 8; toRow++) {
          for (let toCol = 0; toCol < 8; toCol++) {
            if (isValidMoveInternal(board, { row, col }, { row: toRow, col: toCol }, lastMove)) {
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
    const move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    return { move, score: 0, thinkingTime: performance.now() - startTime };
  }

  // For medium and hard, we score moves to find the best one
  let bestScore = -Infinity;
  let bestMoves: ChessMove[] = [];
  const opponent = player === 'white' ? 'black' : 'white';

  for (const move of possibleMoves) {
    let score = 0;
    const tempBoard = board.map(r => [...r]);
    tempBoard[move.to.row][move.to.col] = move.piece;
    tempBoard[move.from.row][move.from.col] = null;

    const capturedValue = move.captured ? pieceValues[move.captured[1] as keyof typeof pieceValues] : 0;
    const movingPieceValue = pieceValues[move.piece![1] as keyof typeof pieceValues];

    score += capturedValue * 10;

    if (difficulty === 'medium') {
      // Medium: Prefers captures, avoids simple blunders.
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

      // Center control: bonus for moving to/controlling central squares
      const isCenterSquare = (r: number, c: number) => (r >= 3 && r <= 4) && (c >= 3 && c <= 4);
      if (isCenterSquare(move.to.row, move.to.col)) {
          score += 1.5;
      }

      // Development bonus: moving pieces out of their starting positions
      const startRow = player === 'white' ? 7 : 0;
      if ((move.from.row === startRow) && (move.piece![1] !== 'p' && move.piece![1] !== 'k')) {
          score += 2;
      }

      // King Safety
      score += evaluateKingSafety(tempBoard, opponent, player) * 0.5; // Our move makes their king less safe
      score -= evaluateKingSafety(tempBoard, player, opponent); // Our move makes our king less safe

      // Add bonus for check
      if (isKingInCheck(tempBoard, opponent)) {
          score += 2.5;
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
      const move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
      return { move, score: bestScore, thinkingTime: performance.now() - startTime };
  }

  if (bestMoves.length > 0) {
    const move = bestMoves[Math.floor(Math.random() * bestMoves.length)];
    return { move, score: bestScore, thinkingTime: performance.now() - startTime };
  }
  
  // Fallback to a random move if no suitable move is found
  const move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
  return { move, score: bestScore, thinkingTime: performance.now() - startTime };
};
