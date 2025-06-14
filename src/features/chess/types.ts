
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

export interface ChessGameState {
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
