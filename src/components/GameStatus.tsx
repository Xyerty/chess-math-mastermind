
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, User, Trophy, Target } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

interface GameStatusProps {
  currentPlayer: 'white' | 'black';
  gameStatus: 'playing' | 'check' | 'checkmate' | 'stalemate' | 'timeout';
  moveCount: number;
  time: { white: number, black: number };
  mathAccuracy?: number;
}

const GameStatus: React.FC<GameStatusProps> = ({
  currentPlayer,
  gameStatus,
  moveCount,
  time,
  mathAccuracy = 100
}) => {
  const { t } = useLanguage();

  const formatTime = (seconds: number) => {
    if (seconds < 0) seconds = 0;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = () => {
    switch (gameStatus) {
      case 'check': return 'text-yellow-500';
      case 'checkmate': return 'text-red-500';
      case 'timeout': return 'text-red-500';
      case 'stalemate': return 'text-gray-500';
      default: return 'text-green-500';
    }
  };

  const getStatusText = () => {
    const winner = currentPlayer === 'white' ? 'Black' : 'White';
    switch (gameStatus) {
      case 'check': return t('game.check');
      case 'checkmate': return `${winner} wins by Checkmate!`;
      case 'stalemate': return t('game.stalemate');
      case 'timeout': return `${winner} wins on time!`;
      default: return t('game.gameActive');
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Game Status */}
      <Card>
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
              <span className="font-semibold text-lg capitalize">{currentPlayer}'s Turn</span>
            </div>
          ) : null}
          <div className="mt-2">
            <span className="text-sm text-muted-foreground">{t('game.move')} {moveCount}</span>
          </div>
        </CardContent>
      </Card>

      {/* Math Accuracy */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Target className="h-5 w-5" />
            {t('game.mathAccuracy')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-3">
              <div 
                className="bg-green-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${mathAccuracy}%` }}
              />
            </div>
            <span className="font-semibold text-lg">{mathAccuracy}%</span>
          </div>
        </CardContent>
      </Card>

      {/* White Player Clock */}
      <Card className={currentPlayer === 'white' && gameStatus === 'playing' ? 'ring-2 ring-primary' : ''}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <User className="h-5 w-5" />
            White's Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-mono font-bold text-primary">
            {formatTime(time.white)}
          </div>
        </CardContent>
      </Card>

      {/* Black Player Clock */}
      <Card className={currentPlayer === 'black' && gameStatus === 'playing' ? 'ring-2 ring-primary' : ''}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <User className="h-5 w-5" />
            Black's Time
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
