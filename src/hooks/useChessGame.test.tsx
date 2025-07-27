
import { renderHook, act } from '@testing-library/react';
import { useChessGame } from './useChessGame';

// Mocking dependencies
jest.mock('../contexts/OpponentContext', () => ({
  useOpponent: () => ({
    opponentType: 'ai',
    playerColor: 'w',
  }),
}));

jest.mock('../config/environment', () => ({
  env: {
    pythonEngine: {
      url: 'ws://localhost:8765',
    },
    features: {
      pythonEngine: true,
    },
  },
}));

describe('useChessGame', () => {
  it('should clear a pending move after execution', () => {
    const { result } = renderHook(() => useChessGame('easy', 'math'));

    // Initialize the game board
    act(() => {
      result.current.resetGame();
    });

    // Simulate starting a math challenge to set a pending move
    act(() => {
      result.current.handleSquareClick(2, 4); // Corresponds to 'e2'
      result.current.handleSquareClick(4, 4); // Corresponds to 'e4'
    });

    // At this point, a math challenge should be active with a pending move
    expect(result.current.mathState.isChallengeActive).toBe(true);
    expect(result.current.mathState.pendingMove).not.toBeNull();

    // Execute the move once
    act(() => {
      const success = result.current.executePendingMove();
      expect(success).toBe(true);
    });

    // After execution, the pending move should be cleared
    // This is the key expectation for the bug fix
    expect(result.current.mathState.pendingMove).toBeNull();

    // Try to execute again and expect it to fail because the move is cleared
    act(() => {
      const success = result.current.executePendingMove();
      expect(success).toBe(false);
    });
  });
});
