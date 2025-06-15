
export type ChessPiece = 'wp' | 'wn' | 'wb' | 'wr' | 'wq' | 'wk' | 'bp' | 'bn' | 'bb' | 'br' | 'bq' | 'bk' | null;
export type GameStatus = 'playing' | 'check' | 'checkmate' | 'stalemate' | 'timeout' | 'resigned';
export type Player = 'white' | 'black';
export type GameMode = 'classic' | 'speed' | 'math-master' | 'ranked' | 'royale';

export interface ChessMove {
  from: { row: number; col: number };
  to: { row: number; col: number };
  piece: ChessPiece;
  captured?: ChessPiece;
  timestamp: number;
}

export interface AIStats {
  score: number;
  thinkingTime: number; // in ms
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
  time: { white: number; black: number };
  aiStats: AIStats | null;
}
