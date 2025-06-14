import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, User, Trophy, BrainCircuit, Cpu } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useOpponent } from "../contexts/OpponentContext";
import type { GameStatus } from "../features/chess/types";
import AIThinkingIndicator from "./AIThinkingIndicator";

interface GameStatusProps {
  currentPlayer: 'white' | 'black';
  gameStatus: GameStatus;
  moveCount: number;
  time: { white: number, black: number };
  aiStats?: { score: number; thinkingTime: number } | null;
  isAIThinking?: boolean;
  aiDifficulty?: string;
  usingPythonEngine?: boolean;
}

const GameStatus: React.FC<GameStatusProps> = ({
  currentPlayer,
  gameStatus,
  moveCount,
  time,
  aiStats,
  isAIThinking = false,
  aiDifficulty = 'medium',
  usingPythonEngine = false,
}) => {
  const { t } = useLanguage();
  const { opponentType, playerColor } = useOpponent();

  const formatTime = (seconds: number) => {
    if (seconds < 0) seconds = 0;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = () => {
    switch (gameStatus) {
      case 'check': return 'text-yellow-500';
      case 'checkmate': return 'text-destructive';
      case 'timeout': return 'text-destructive';
      case 'resigned': return 'text-destructive';
      case 'stalemate': return 'text-muted-foreground';
      default: return 'text-green-600 dark:text-green-500';
    }
  };

  const getStatusText = () => {
    const winner = currentPlayer === 'white' ? 'Black' : 'White';
    switch (gameStatus) {
      case 'check': return t('game.check');
      case 'checkmate': return `${winner} wins by Checkmate!`;
      case 'stalemate': return t('game.stalemate');
      case 'timeout': return `${winner} wins on time!`;
      case 'resigned': return `${winner} wins by resignation.`;
      default: return t('game.gameActive');
    }
  };

  const getPlayerLabel = (color: 'white' | 'black') => {
    if (opponentType === 'ai') {
      const aiPlayer = playerColor === 'white' ? 'black' : 'white';
      if (color === aiPlayer) {
        const engineType = usingPythonEngine ? 'Python AI' : 'JS AI';
        return `${engineType} (${aiDifficulty.charAt(0).toUpperCase() + aiDifficulty.slice(1)})`;
      }
      return 'You';
    }
    return color === 'white' ? t('game.whiteTime') : 'Black Player';
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in [animation-delay:200ms]">
      {/* AI Thinking Indicator */}
      {opponentType === 'ai' && isAIThinking && (
        <div className="sm:col-span-2">
          <AIThinkingIndicator 
            isThinking={isAIThinking} 
            difficulty={aiDifficulty}
            thinkingTime={aiStats?.thinkingTime}
          />
        </div>
      )}

      {/* Engine Status for AI games */}
      {opponentType === 'ai' && (
        <div className="sm:col-span-2">
          <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30">
            <CardContent className="flex items-center gap-3 p-3">
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                {usingPythonEngine ? (
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                    Enhanced Python Engine Active
                  </span>
                ) : (
                  <span className="text-sm font-medium text-orange-700 dark:text-orange-300">
                    JavaScript Engine (Fallback)
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Game Status */}
      <Card className="sm:col-span-2 animate-fade-in [animation-delay:300ms]">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Trophy className="h-5 w-5" />
            {t('game.gameStatus')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`font-semibold text-lg ${getStatusColor()}`}>
            {getStatusText()}
          </div>
          {gameStatus === 'playing' || gameStatus === 'check' ? (
            <div className="flex items-center gap-3 mt-2">
              <div className={`w-6 h-6 rounded-full ${currentPlayer === 'white' ? 'bg-white border-2 border-slate-400' : 'bg-black'}`} />
              <span className="font-semibold text-lg capitalize">{getPlayerLabel(currentPlayer)}'s Turn</span>
            </div>
          ) : null}
          <div className="mt-2">
            <span className="text-sm text-muted-foreground">{t('game.move')} {moveCount}</span>
          </div>
          {/* AI Stats */}
          {opponentType === 'ai' && aiStats && (
            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <BrainCircuit className="h-4 w-4" />
              <span>Last AI move: Score {aiStats.score.toFixed(1)}, {aiStats.thinkingTime}ms</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* White Player Clock */}
      <Card className={`${currentPlayer === 'white' && gameStatus === 'playing' ? 'ring-2 ring-primary' : ''} animate-fade-in [animation-delay:600ms]`}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <User className="h-5 w-5" />
            {getPlayerLabel('white')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-mono font-bold text-primary">
            {formatTime(time.white)}
          </div>
        </CardContent>
      </Card>

      {/* Black Player Clock */}
      <Card className={`${currentPlayer === 'black' && gameStatus === 'playing' ? 'ring-2 ring-primary' : ''} animate-fade-in [animation-delay:700ms]`}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <User className="h-5 w-5" />
            {getPlayerLabel('black')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-mono font-bold text-primary">
            {formatTime(time.black)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GameStatus;
