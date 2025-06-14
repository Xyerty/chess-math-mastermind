import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, User, Trophy, Target } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

interface GameStatusProps {
  currentPlayer: 'white' | 'black';
  gameStatus: 'playing' | 'check' | 'checkmate' | 'stalemate';
  moveCount: number;
  timeRemaining?: number;
  mathAccuracy?: number;
}

const GameStatus: React.FC<GameStatusProps> = ({
  currentPlayer,
  gameStatus,
  moveCount,
  timeRemaining = 600,
  mathAccuracy = 85
}) => {
  const { t } = useLanguage();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = () => {
    switch (gameStatus) {
      case 'check': return 'text-yellow-600';
      case 'checkmate': return 'text-red-600';
      case 'stalemate': return 'text-gray-600';
      default: return 'text-green-600';
    }
  };

  const getStatusText = () => {
    switch (gameStatus) {
      case 'check': return t('game.check');
      case 'checkmate': return t('game.checkmate');
      case 'stalemate': return t('game.stalemate');
      default: return t('game.gameActive');
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Current Turn */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <User className="h-5 w-5" />
            {t('game.currentTurn')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <div className={`w-6 h-6 rounded-full ${currentPlayer === 'white' ? 'bg-white border-2 border-gray-400' : 'bg-black'}`} />
            <span className="font-semibold text-lg capitalize">{currentPlayer}</span>
          </div>
          <div className="mt-2">
            <span className="text-sm text-muted-foreground">{t('game.move')} {moveCount}</span>
          </div>
        </CardContent>
      </Card>

      {/* Game Status */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Trophy className="h-5 w-5" />
            {t('game.gameStatus')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`font-semibold ${getStatusColor()}`}>
            {getStatusText()}
          </div>
        </CardContent>
      </Card>

      {/* Timer */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="h-5 w-5" />
            {t('game.timeRemaining')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-mono font-bold text-primary">
            {formatTime(timeRemaining)}
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
            <div className="flex-1 bg-gray-200 rounded-full h-3">
              <div 
                className="bg-green-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${mathAccuracy}%` }}
              />
            </div>
            <span className="font-semibold text-lg">{mathAccuracy}%</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GameStatus;
