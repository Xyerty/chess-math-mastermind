import { ChessPiece, ChessMove } from '../types';

export const isPathClear = (board: ChessPiece[][], from: { row: number; col: number }, to: { row: number; col: number }): boolean => {
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

export const isValidMoveInternal = (board: ChessPiece[][], from: { row: number; col: number }, to: { row: number; col: number }, lastMove: ChessMove | null): boolean => {
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
      
      // Standard forward move
      if (from.col === to.col) {
        if (to.row === from.row + direction && !targetPiece) return true;
        if (from.row === startRow && to.row === from.row + 2 * direction && !targetPiece && !board[from.row+direction][from.col]) return true;
      } 
      // Standard capture
      else if (Math.abs(from.col - to.col) === 1 && to.row === from.row + direction && targetPiece) {
        return true;
      }
      // En-passant
      else if (
        lastMove &&
        Math.abs(from.col - to.col) === 1 &&
        to.row === from.row + direction &&
        !targetPiece &&
        lastMove.to.row === from.row &&
        lastMove.to.col === to.col &&
        lastMove.piece?.[1] === 'p' &&
        Math.abs(lastMove.from.row - lastMove.to.row) === 2
      ) {
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
