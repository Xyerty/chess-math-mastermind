import React, { useState, useCallback, useEffect } from 'react';
import { ChessGameState, ChessMove, GameStatus, ChessPiece, GameMode, Player } from '../features/chess/types';
import { defaultPosition } from '../features/chess/constants';
import { isKingInCheck, hasAnyValidMoves } from '../features/chess/utils/board';
import { isValidMoveInternal } from '../features/chess/utils/moveValidation';
import { generateAIMove } from '../features/chess/utils/ai';
import { useOpponent } from '../contexts/OpponentContext';

type HandleSquareClickResult = 
  | { type: 'selected'; payload: { row: number; col: number } }
  | { type: 'deselected' }
  | { type: 'move_attempt'; payload: { from: { row: number; col: number }; to: { row: number; col: number } } };

const getInitialTime = (gameMode: GameMode) => {
  switch (gameMode) {
    case 'speed':
      return 180; // 3 minutes
    case 'classic':
    case 'math-master':
    default:
      return 600; // 10 minutes
  }
};

export const useChessGame = (aiDifficulty: 'easy' | 'medium' | 'hard', gameMode: GameMode) => {
  const { opponentType, playerColor } = useOpponent();
  const [isAIThinking, setIsAIThinking] = useState(false);
  
  const [gameState, setGameState] = useState<ChessGameState>(() => {
    const initialTime = getInitialTime(gameMode);
    return {
      board: defaultPosition.map(row => [...row]),
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
  });

  // AI move logic
  const makeAIMove = useCallback(async () => {
    if (opponentType !== 'ai' || gameState.gameStatus !== 'playing' && gameState.gameStatus !== 'check') {
      return;
    }

    const aiPlayer = playerColor === 'white' ? 'black' : 'white';
    if (gameState.currentPlayer !== aiPlayer) {
      return;
    }

    setIsAIThinking(true);
    
    // Add a small delay to make AI moves feel more natural
    const minThinkingTime = aiDifficulty === 'easy' ? 500 : aiDifficulty === 'medium' ? 1000 : 1500;
    
    setTimeout(() => {
      const aiMoveResult = generateAIMove(gameState.board, aiPlayer, aiDifficulty, gameState.lastMove);
      
      if (aiMoveResult) {
        const { move, score, thinkingTime } = aiMoveResult;
        console.log(`AI (${aiDifficulty}) move:`, move, `Score: ${score}, Time: ${thinkingTime}ms`);
        
        // Execute the AI move
        const tempBoard = gameState.board.map(row => [...row]);
        const piece = tempBoard[move.from.row][move.from.col];
        let captured = gameState.board[move.to.row][move.to.col];

        const isEnPassant = piece?.[1] === 'p' && move.from.col !== move.to.col && !captured;

        tempBoard[move.to.row][move.to.col] = piece;
        tempBoard[move.from.row][move.from.col] = null;
        
        if (isEnPassant) {
          const capturedPawnRow = move.from.row;
          const capturedPawnCol = move.to.col;
          captured = gameState.board[capturedPawnRow][capturedPawnCol];
          tempBoard[capturedPawnRow][capturedPawnCol] = null;
        }

        const nextPlayer = aiPlayer === 'white' ? 'black' : 'white';
        const newIsInCheck = isKingInCheck(tempBoard, nextPlayer);
        const opponentHasMoves = hasAnyValidMoves(tempBoard, nextPlayer, move);

        let newGameStatus: GameStatus = 'playing';
        if (!opponentHasMoves) {
          newGameStatus = newIsInCheck ? 'checkmate' : 'stalemate';
        } else if (newIsInCheck) {
          newGameStatus = 'check';
        }

        setGameState(prev => {
          const newTime = { ...prev.time };
          if (gameMode === 'speed') {
            newTime[aiPlayer] += 2; // +2s increment
          }

          return {
            ...prev,
            board: tempBoard,
            currentPlayer: nextPlayer,
            moveHistory: [...prev.moveHistory, { ...move, captured: captured || undefined }],
            selectedSquare: null,
            lastMove: { ...move, captured: captured || undefined },
            isInCheck: newIsInCheck,
            gameStatus: newGameStatus,
            moveCount: aiPlayer === 'black' ? prev.moveCount + 1 : prev.moveCount,
            time: newTime,
            aiStats: { score, thinkingTime },
          };
        });
      }
      
      setIsAIThinking(false);
    }, minThinkingTime);
  }, [gameState, aiDifficulty, opponentType, playerColor, gameMode]);

  // Trigger AI move when it's AI's turn
  useEffect(() => {
    if (opponentType === 'ai' && !isAIThinking) {
      const aiPlayer = playerColor === 'white' ? 'black' : 'white';
      if (gameState.currentPlayer === aiPlayer && (gameState.gameStatus === 'playing' || gameState.gameStatus === 'check')) {
        makeAIMove();
      }
    }
  }, [gameState.currentPlayer, gameState.gameStatus, opponentType, playerColor, isAIThinking, makeAIMove]);

  useEffect(() => {
    let timerId: NodeJS.Timeout | undefined;

    if (gameState.gameStatus === 'playing' || gameState.gameStatus === 'check') {
      timerId = setInterval(() => {
        setGameState(prev => {
          if (prev.gameStatus !== 'playing' && prev.gameStatus !== 'check') {
            return prev;
          }

          const newTime = { ...prev.time };
          const newCurrentPlayerTime = newTime[prev.currentPlayer] - 1;

          if (newCurrentPlayerTime <= 0) {
            return {
              ...prev,
              time: { ...newTime, [prev.currentPlayer]: 0 },
              gameStatus: 'timeout',
            };
          }

          return {
            ...prev,
            time: { ...newTime, [prev.currentPlayer]: newCurrentPlayerTime },
          };
        });
      }, 1000);
    }

    return () => {
      if (timerId) {
        clearInterval(timerId);
      }
    };
  }, [gameState.gameStatus]);

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
  }, [gameState, gameMode, opponentType, playerColor]);

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
  }, [gameState.board, gameState.selectedSquare, gameState.currentPlayer, gameState.gameStatus, opponentType, playerColor, isAIThinking]);

  const clearSelection = useCallback(() => {
    setGameState(prev => ({ ...prev, selectedSquare: null }));
  }, []);
  
  const resignGame = useCallback(() => {
    setGameState(prev => {
        if (prev.gameStatus === 'playing' || prev.gameStatus === 'check') {
            return { ...prev, gameStatus: 'resigned' };
        }
        return prev;
    });
  }, []);

  const resetGame = useCallback(() => {
    const initialTime = getInitialTime(gameMode);
    setGameState({
      board: defaultPosition.map(row => [...row]),
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
    });
    setIsAIThinking(false);
  }, [gameMode]);

  return {
    gameState,
    handleSquareClick,
    makeMove,
    clearSelection,
    resetGame,
    resignGame,
    isAIThinking,
  };
};
