
import { ChessMove } from '../types';

const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

/**
 * Converts a move object to a simple notation (e.g., "e2-e4").
 * This is not full algebraic notation but is clear and easy to implement.
 */
export const moveToNotation = (move: ChessMove): string => {
  const fromFile = files[move.from.col];
  const fromRank = 8 - move.from.row;
  const toFile = files[move.to.col];
  const toRank = 8 - move.to.row;
  
  return `${fromFile}${fromRank}-${toFile}${toRank}`;
};
