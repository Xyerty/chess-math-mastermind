import { useState, useCallback } from 'react';
import { ChessGameState, GameMode } from '../features/chess/types';
import { pythonEngine } from '../services/pythonEngine';
import { boardToFen } from '../utils/fenConverter';
import { generateAIMove } from '../features/chess/utils/ai';
import { useToast } from '@/hooks/use-toast';

export interface HintAnalysis {
  bestMove?: {
    from: { row: number; col: number };
    to: { row: number; col: number };
  };
  evaluation: number;
  threats: string[];
  opportunities: string[];
  advice: string;
}

interface UseHintProps {
  gameState: ChessGameState;
  gameMode: GameMode;
  aiDifficulty: 'easy' | 'medium' | 'hard';
  usingPythonEngine: boolean;
}

export const useHint = ({ gameState, gameMode, aiDifficulty, usingPythonEngine }: UseHintProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentHint, setCurrentHint] = useState<HintAnalysis | null>(null);
  const [hintsUsed, setHintsUsed] = useState(0);
  const { toast } = useToast();

  const getMaxHints = useCallback(() => {
    if (aiDifficulty === 'easy') return 999; // Unlimited for learning
    if (gameMode === 'speed') return 1;
    if (aiDifficulty === 'medium') return 5;
    return 3; // Hard mode
  }, [gameMode, aiDifficulty]);

  const canRequestHint = useCallback(() => {
    if (gameState.gameStatus !== 'playing' && gameState.gameStatus !== 'check') {
      return false;
    }
    return hintsUsed < getMaxHints();
  }, [gameState.gameStatus, hintsUsed, getMaxHints]);

  const generateAdvice = useCallback((evaluation: number, threats: string[], opportunities: string[]): string => {
    if (Math.abs(evaluation) > 500) {
      return evaluation > 0 ? "You have a winning advantage! Look for tactics to finish the game." : "You're in trouble. Focus on defense and look for counterplay.";
    }
    if (Math.abs(evaluation) > 200) {
      return evaluation > 0 ? "You have a good position. Maintain pressure." : "You're slightly worse. Look for active moves.";
    }
    if (threats.length > 0) {
      return "Be careful of opponent threats. Consider defensive moves.";
    }
    if (opportunities.length > 0) {
      return "You have tactical opportunities available!";
    }
    return "The position is balanced. Focus on piece development and king safety.";
  }, []);

  const requestHint = useCallback(async () => {
    if (!canRequestHint()) {
      toast({
        title: "No hints available",
        description: `You've used all ${getMaxHints()} hints for this game.`,
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      let hintAnalysis: HintAnalysis;

      // Try Python engine first
      if (usingPythonEngine) {
        const fen = boardToFen(gameState.board, gameState.currentPlayer);
        const pythonResult = await pythonEngine.analyzePosition(fen, 3);
        
        if (pythonResult) {
          // Get best move using AI
          const moveResult = await pythonEngine.getMove(fen, aiDifficulty, 2.0);
          
          hintAnalysis = {
            bestMove: moveResult?.move ? {
              from: moveResult.move.from,
              to: moveResult.move.to
            } : undefined,
            evaluation: pythonResult.evaluation,
            threats: pythonResult.threats || [],
            opportunities: pythonResult.weaknesses || [],
            advice: generateAdvice(pythonResult.evaluation, pythonResult.threats || [], pythonResult.weaknesses || [])
          };
        } else {
          throw new Error('Python engine failed');
        }
      } else {
        // Fallback to JavaScript AI
        const jsResult = generateAIMove(gameState.board, gameState.currentPlayer, aiDifficulty, gameState.lastMove);
        
        hintAnalysis = {
          bestMove: jsResult?.move ? {
            from: jsResult.move.from,
            to: jsResult.move.to
          } : undefined,
          evaluation: jsResult?.score || 0,
          threats: [],
          opportunities: [],
          advice: generateAdvice(jsResult?.score || 0, [], [])
        };
      }

      setCurrentHint(hintAnalysis);
      setHintsUsed(prev => prev + 1);
      
      toast({
        title: "Hint generated",
        description: `${getMaxHints() - hintsUsed - 1} hints remaining`,
      });
      
    } catch (error) {
      console.error('Error generating hint:', error);
      toast({
        title: "Hint failed",
        description: "Could not analyze the position. Try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, [gameState, aiDifficulty, usingPythonEngine, canRequestHint, hintsUsed, getMaxHints, generateAdvice, toast]);

  const clearHint = useCallback(() => {
    setCurrentHint(null);
  }, []);

  const resetHints = useCallback(() => {
    setHintsUsed(0);
    setCurrentHint(null);
  }, []);

  return {
    currentHint,
    isAnalyzing,
    hintsUsed,
    maxHints: getMaxHints(),
    canRequestHint: canRequestHint(),
    requestHint,
    clearHint,
    resetHints,
  };
};
