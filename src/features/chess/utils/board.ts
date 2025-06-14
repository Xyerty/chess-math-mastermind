
import { ChessPiece, Player, ChessMove } from '../types';
import { isValidMoveInternal } from './moveValidation';

export const findKing = (board: ChessPiece[][], player: Player): { row: number, col: number } | null => {
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

export const isSquareAttacked = (board: ChessPiece[][], row: number, col: number, attackerColor: Player): boolean => {
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const piece = board[r][c];
            if (piece && piece[0] === attackerColor[0]) {
                if (isValidMoveInternal(board, { row: r, col: c }, { row, col }, null)) {
                    return true;
                }
            }
        }
    }
    return false;
};

export const isKingInCheck = (board: ChessPiece[][], playerColor: Player): boolean => {
    const kingPos = findKing(board, playerColor);
    if (!kingPos) return true; // Should not happen, but if king is gone, it's a game-over state.
    const opponentColor = playerColor === 'white' ? 'black' : 'white';
    return isSquareAttacked(board, kingPos.row, kingPos.col, opponentColor);
};

export const hasAnyValidMoves = (board: ChessPiece[][], player: Player, lastMove: ChessMove | null): boolean => {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece && piece[0] === player[0]) {
        // This piece belongs to the player, check for any valid moves
        for (let toRow = 0; toRow < 8; toRow++) {
          for (let toCol = 0; toCol < 8; toCol++) {
            if (isValidMoveInternal(board, { row: r, col: c }, { row: toRow, col: toCol }, lastMove)) {
              // It's a pseudo-legal move, now check if it's a fully legal move
              const tempBoard = board.map(row => [...row]);
              const movingPiece = tempBoard[r][c];
              tempBoard[toRow][toCol] = movingPiece;
              tempBoard[r][c] = null;
              
              // Special handling for en-passant capture simulation
              if (movingPiece?.[1] === 'p' && c !== toCol && !board[toRow][toCol]) {
                  tempBoard[r][toCol] = null;
              }

              if (!isKingInCheck(tempBoard, player)) {
                // Found at least one valid move
                return true;
              }
            }
          }
        }
      }
    }
  }
  return false;
};
