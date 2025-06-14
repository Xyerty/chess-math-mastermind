
import { useState, useCallback, useEffect } from 'react';
import { ChessGameState, ChessMove, GameStatus, GameMode, Player } from '../features/chess/types';
import { generateAIMove } from '../features/chess/utils/ai';
import { isKingInCheck, hasAnyValidMoves } from '../features/chess/utils/board';
import { pythonEngine } from '../services/pythonEngine';
import { boardToFen } from '../utils/fenConverter';

interface UseAIEngineProps {
  gameState: ChessGameState;
  setGameState: React.Dispatch<React.SetStateAction<ChessGameState>>;
  aiDifficulty: 'easy' | 'medium' | 'hard';
  gameMode: GameMode;
  opponentType: 'ai' | 'human';
  playerColor: 'white' | 'black';
}

export const useAIEngine = ({
  gameState,
  setGameState,
  aiDifficulty,
  gameMode,
  opponentType,
  playerColor
}: UseAIEngineProps) => {
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [usingPythonEngine, setUsingPythonEngine] = useState(false);

  // Check Python engine availability on mount
  useEffect(() => {
    const checkPythonEngine = async () => {
      const available = await pythonEngine.checkAvailability();
      setUsingPythonEngine(available);
      if (available) {
        console.log('Python chess engine is available - using enhanced AI');
      } else {
        console.log('Python chess engine not available - using JavaScript fallback');
      }
    };
    checkPythonEngine();
  }, []);

  const makeAIMove = useCallback(async () => {
    if (opponentType !== 'ai' || gameState.gameStatus !== 'playing' && gameState.gameStatus !== 'check') {
      return;
    }

    const aiPlayer = playerColor === 'white' ? 'black' : 'white';
    if (gameState.currentPlayer !== aiPlayer) {
      return;
    }

    setIsAIThinking(true);
    
    try {
      let aiMoveResult = null;
      
      // Try Python engine first
      if (usingPythonEngine) {
        const fen = boardToFen(gameState.board, gameState.currentPlayer);
        const timeLimit = aiDifficulty === 'easy' ? 1.0 : aiDifficulty === 'medium' ? 2.0 : 3.0;
        
        const pythonResult = await pythonEngine.getMove(fen, aiDifficulty, timeLimit);
        
        if (pythonResult) {
          console.log(`Python AI (${aiDifficulty}) move:`, pythonResult);
          aiMoveResult = {
            move: {
              from: pythonResult.move.from,
              to: pythonResult.move.to,
              piece: gameState.board[pythonResult.move.from.row][pythonResult.move.from.col],
              timestamp: Date.now()
            },
            score: pythonResult.score,
            thinkingTime: pythonResult.thinking_time
          };
        } else {
          console.log('Python engine failed, falling back to JavaScript AI');
          setUsingPythonEngine(false);
        }
      }
      
      // Fallback to JavaScript AI
      if (!aiMoveResult) {
        const jsResult = generateAIMove(gameState.board, aiPlayer, aiDifficulty, gameState.lastMove);
        if (jsResult) {
          aiMoveResult = jsResult;
          console.log(`JavaScript AI (${aiDifficulty}) move:`, jsResult);
        }
      }
      
      if (aiMoveResult) {
        const { move, score, thinkingTime } = aiMoveResult;
        
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
    } catch (error) {
      console.error('Error in AI move generation:', error);
      setUsingPythonEngine(false);
    } finally {
      setIsAIThinking(false);
    }
  }, [gameState, aiDifficulty, opponentType, playerColor, gameMode, usingPythonEngine, setGameState]);

  // Trigger AI move when it's AI's turn
  useEffect(() => {
    if (opponentType === 'ai' && !isAIThinking) {
      const aiPlayer = playerColor === 'white' ? 'black' : 'white';
      if (gameState.currentPlayer === aiPlayer && (gameState.gameStatus === 'playing' || gameState.gameStatus === 'check')) {
        makeAIMove();
      }
    }
  }, [gameState.currentPlayer, gameState.gameStatus, opponentType, playerColor, isAIThinking, makeAIMove]);

  return {
    isAIThinking,
    usingPythonEngine,
    makeAIMove,
  };
};
