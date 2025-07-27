
import { ChessPiece } from '../features/chess/types';

export const boardToFen = (board: ChessPiece[][], currentPlayer: 'white' | 'black'): string => {
  let fen = '';
  
  // Convert board to FEN notation
  for (let row = 0; row < 8; row++) {
    let emptyCount = 0;
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece) {
        if (emptyCount > 0) {
          fen += emptyCount.toString();
          emptyCount = 0;
        }
        // Convert piece notation (e.g., 'wp' -> 'P', 'bn' -> 'n')
        const pieceChar = piece[1]; // Get piece type (p, r, n, b, q, k)
        const isWhite = piece[0] === 'w';
        fen += isWhite ? pieceChar.toUpperCase() : pieceChar.toLowerCase();
      } else {
        emptyCount++;
      }
    }
    if (emptyCount > 0) {
      fen += emptyCount.toString();
    }
    if (row < 7) {
      fen += '/';
    }
  }
  
  // Add active color
  fen += ` ${currentPlayer === 'white' ? 'w' : 'b'}`;
  
  // Add castling availability (simplified - always allow all castling for now)
  fen += ' KQkq';
  
  // Add en passant target square (simplified - none for now)
  fen += ' -';
  
  // Add halfmove clock (simplified - 0 for now)
  fen += ' 0';
  
  // Add fullmove number (simplified - 1 for now)
  fen += ' 1';
  
  return fen;
};
