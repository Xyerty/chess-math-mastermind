
import { useCallback } from 'react';
import { ChessGameState, ChessMove, GameStatus, GameMode } from '../features/chess/types';
import { isValidMoveInternal } from '../features/chess/utils/moveValidation';
import { isKingInCheck, hasAnyValidMoves } from '../features/chess/utils/board';

type HandleSquareClickResult = 
  | { type: 'selected'; payload: { row: number; col: number } }
  | { type: 'deselected' }
  | { type: 'move_attempt'; payload: { from: { row: number; col: number }; to: { row: number; col: number } } };

interface UseMoveHandlerProps {
  gameState: ChessGameState;
  setGameState: React.Dispatch<React.SetStateAction<ChessGameState>>;
  gameMode: GameMode;
  opponentType: 'ai' | 'human';
  playerColor: 'white' | 'black';
  isAIThinking: boolean;
}

export const useMoveHandler = ({
  gameState,
  setGameState,
  gameMode,
  opponentType,
  playerColor,
  isAIThinking
}: UseMoveHandlerProps) => {
  const makeMove = useCallback((from: { row: number; col: number }, to: { row: number; col: number }): boolean => {
    if (gameState.gameStatus !== 'playing' && gameState.gameStatus !== 'check') return false;
    
    // Prevent human moves when it's AI's turn
    if (opponentType === 'ai') {
      const aiPlayer = playerColor === 'white' ? 'black' : 'white';
      if (gameState.currentPlayer === aiPlayer) return false;
    }
    
    if (!isValidMoveInternal(gameState.board, from, to, gameState.lastMove)) return false;

    const tempBoard = gameState.board.map(row => [...row]);
    const piece = tempBoard[from.row][from.col];
    let captured = gameState.board[to.row][to.col];

    const isEnPassant = piece?.[1] === 'p' && from.col !== to.col && !captured;

    tempBoard[to.row][to.col] = piece;
    tempBoard[from.row][from.col] = null;
    
    if (isEnPassant) {
        const capturedPawnRow = from.row;
        const capturedPawnCol = to.col;
        captured = gameState.board[capturedPawnRow][capturedPawnCol];
        tempBoard[capturedPawnRow][capturedPawnCol] = null;
    }

    if (isKingInCheck(tempBoard, gameState.currentPlayer)) {
      console.log("Illegal move: king would be in check.");
      return false;
    }

    const newBoard = tempBoard;
    const nextPlayer = gameState.currentPlayer === 'white' ? 'black' : 'white';

    const move: ChessMove = { from, to, piece, captured: captured || undefined, timestamp: Date.now() };

    const newIsInCheck = isKingInCheck(newBoard, nextPlayer);
    const opponentHasMoves = hasAnyValidMoves(newBoard, nextPlayer, move); 

    let newGameStatus: GameStatus = 'playing';
    if (!opponentHasMoves) {
      newGameStatus = newIsInCheck ? 'checkmate' : 'stalemate';
    } else if (newIsInCheck) {
      newGameStatus = 'check';
    }

    setGameState(prev => {
      const newTime = { ...prev.time };
      if (gameMode === 'speed') {
        newTime[prev.currentPlayer] += 2; // +2s increment
      }

      return {
        ...prev,
        board: newBoard,
        currentPlayer: nextPlayer,
        moveHistory: [...prev.moveHistory, move],
        selectedSquare: null,
        lastMove: move,
        isInCheck: newIsInCheck,
        gameStatus: newGameStatus,
        moveCount: prev.currentPlayer === 'black' ? prev.moveCount + 1 : prev.moveCount,
        time: newTime,
        aiStats: null,
      }
    });

    return true;
  }, [gameState, gameMode, opponentType, playerColor, setGameState]);

  const handleSquareClick = useCallback((row: number, col: number): HandleSquareClickResult | null => {
    if (gameState.gameStatus !== 'playing' && gameState.gameStatus !== 'check') {
        return null;
    }

    // Prevent clicks when AI is thinking or when it's AI's turn
    if (opponentType === 'ai') {
      if (isAIThinking) return null;
      const aiPlayer = playerColor === 'white' ? 'black' : 'white';
      if (gameState.currentPlayer === aiPlayer) return null;
    }

    const piece = gameState.board[row][col];
    
    if (gameState.selectedSquare) {
      if (gameState.selectedSquare.row === row && gameState.selectedSquare.col === col) {
        setGameState(prev => ({ ...prev, selectedSquare: null }));
        return { type: 'deselected' };
      } else {
        return { type: 'move_attempt', payload: { from: gameState.selectedSquare, to: { row, col } } };
      }
    } else {
      if (piece && piece[0] === gameState.currentPlayer[0]) {
        setGameState(prev => ({ ...prev, selectedSquare: { row, col } }));
        return { type: 'selected', payload: { row, col } };
      }
    }
    return null;
  }, [gameState.board, gameState.selectedSquare, gameState.currentPlayer, gameState.gameStatus, opponentType, playerColor, isAIThinking, setGameState]);

  return {
    makeMove,
    handleSquareClick,
  };
};
