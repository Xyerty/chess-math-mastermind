
import { ChessGameState, GameMode, ChessMove, Player } from '../../features/chess/types';

export interface GameStateManager {
  getState(): ChessGameState;
  setState(state: ChessGameState): void;
  resetGame(gameMode: GameMode): void;
  makeMove(from: { row: number; col: number }, to: { row: number; col: number }): boolean;
  resignGame(): void;
  updateTimer(player: Player, timeRemaining: number): void;
  addMoveToHistory(move: ChessMove): void;
}

export interface GameStateService {
  createGameManager(gameMode: GameMode): GameStateManager;
  validateMove(state: ChessGameState, from: { row: number; col: number }, to: { row: number; col: number }): boolean;
  checkGameStatus(state: ChessGameState): { status: string; winner?: Player };
  calculateScore(state: ChessGameState): { white: number; black: number };
}

export class DefaultGameStateService implements GameStateService {
  createGameManager(gameMode: GameMode): GameStateManager {
    return new DefaultGameStateManager(gameMode);
  }

  validateMove(state: ChessGameState, from: { row: number; col: number }, to: { row: number; col: number }): boolean {
    // Implementation would use the existing chess validation logic
    return true; // Placeholder
  }

  checkGameStatus(state: ChessGameState): { status: string; winner?: Player } {
    return { status: state.gameStatus };
  }

  calculateScore(state: ChessGameState): { white: number; black: number } {
    // Calculate material value or other scoring metrics
    return { white: 0, black: 0 };
  }
}

class DefaultGameStateManager implements GameStateManager {
  private state: ChessGameState;

  constructor(private gameMode: GameMode) {
    this.state = this.createInitialState(gameMode);
  }

  getState(): ChessGameState {
    return { ...this.state };
  }

  setState(state: ChessGameState): void {
    this.state = { ...state };
  }

  resetGame(gameMode: GameMode): void {
    this.state = this.createInitialState(gameMode);
  }

  makeMove(from: { row: number; col: number }, to: { row: number; col: number }): boolean {
    // Implementation would use existing move logic
    return true; // Placeholder
  }

  resignGame(): void {
    this.state.gameStatus = 'resigned';
  }

  updateTimer(player: Player, timeRemaining: number): void {
    this.state.time[player] = timeRemaining;
  }

  addMoveToHistory(move: ChessMove): void {
    this.state.moveHistory.push(move);
    this.state.moveCount++;
  }

  private createInitialState(gameMode: GameMode): ChessGameState {
    // This would use the existing initial state logic
    const initialTime = gameMode === 'speed' ? 180 : 600;
    
    return {
      board: [], // Would use defaultPosition
      currentPlayer: 'white',
      gameStatus: 'playing',
      moveHistory: [],
      selectedSquare: null,
      lastMove: null,
      isInCheck: false,
      gameStartTime: Date.now(),
      moveCount: 1,
      time: { white: initialTime, black: initialTime },
      aiStats: null,
    };
  }
}
