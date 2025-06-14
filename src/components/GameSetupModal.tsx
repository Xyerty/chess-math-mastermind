
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from '../contexts/LanguageContext';
import { useDifficulty, Difficulty } from '../contexts/DifficultyContext';
import { useGameMode } from '../contexts/GameModeContext';
import { useOpponent, OpponentType, PlayerColor } from '../contexts/OpponentContext';
import { GameMode } from '../features/chess/types';
import { BrainCircuit, Calculator, Play, Clock, Users, User } from 'lucide-react';

interface GameSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartGame: (mathDifficulty: Difficulty, aiDifficulty: Difficulty) => void;
}

const GameSetupModal: React.FC<GameSetupModalProps> = ({ isOpen, onClose, onStartGame }) => {
  const { t } = useLanguage();
  const { mathDifficulty: currentMathDifficulty, aiDifficulty: currentAiDifficulty } = useDifficulty();
  const { gameMode: currentGameMode, setGameMode } = useGameMode();
  const { opponentType: currentOpponentType, setOpponentType, playerColor: currentPlayerColor, setPlayerColor } = useOpponent();
  
  const [mathDifficulty, setMathDifficulty] = useState<Difficulty>(currentMathDifficulty);
  const [aiDifficulty, setAiDifficulty] = useState<Difficulty>(currentAiDifficulty);
  const [localGameMode, setLocalGameMode] = useState<GameMode>(currentGameMode);
  const [localOpponentType, setLocalOpponentType] = useState<OpponentType>(currentOpponentType);
  const [localPlayerColor, setLocalPlayerColor] = useState<PlayerColor>(currentPlayerColor);

  const handleStart = () => {
    setGameMode(localGameMode);
    setOpponentType(localOpponentType);
    setPlayerColor(localPlayerColor);
    onStartGame(mathDifficulty, aiDifficulty);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] bg-card/80 backdrop-blur-sm border-border/50 shadow-2xl rounded-2xl animate-scale-in">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-primary flex items-center justify-center gap-2">
            <Play className="h-6 w-6" />
            {t('gameSetup.title')}
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground pt-2">
            {t('gameSetup.description')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-6">
          {/* Opponent Type */}
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="opponent-type" className="text-right col-span-1 flex items-center justify-end gap-2 text-sm font-medium">
              <Users className="h-4 w-4 text-muted-foreground" />
              Opponent
            </label>
            <Select value={localOpponentType} onValueChange={(value: OpponentType) => setLocalOpponentType(value)}>
              <SelectTrigger id="opponent-type" className="col-span-3">
                <SelectValue placeholder="Select opponent" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="human">Human vs Human</SelectItem>
                <SelectItem value="ai">Human vs AI</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Player Color (only show when playing against AI) */}
          {localOpponentType === 'ai' && (
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="player-color" className="text-right col-span-1 flex items-center justify-end gap-2 text-sm font-medium">
                <User className="h-4 w-4 text-muted-foreground" />
                Play as
              </label>
              <Select value={localPlayerColor} onValueChange={(value: PlayerColor) => setLocalPlayerColor(value)}>
                <SelectTrigger id="player-color" className="col-span-3">
                  <SelectValue placeholder="Select color" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="white">White</SelectItem>
                  <SelectItem value="black">Black</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Game Mode */}
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="game-mode" className="text-right col-span-1 flex items-center justify-end gap-2 text-sm font-medium">
              <Clock className="h-4 w-4 text-muted-foreground" />
              {t('gameSetup.gameMode')}
            </label>
            <Select value={localGameMode} onValueChange={(value: GameMode) => setLocalGameMode(value)}>
              <SelectTrigger id="game-mode" className="col-span-3">
                <SelectValue placeholder="Select game mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="classic">{t('gameMode.classic')}</SelectItem>
                <SelectItem value="speed">{t('gameMode.speed')}</SelectItem>
                <SelectItem value="math-master">{t('gameMode.mathMaster')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Math Difficulty */}
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="math-difficulty" className="text-right col-span-1 flex items-center justify-end gap-2 text-sm font-medium">
              <Calculator className="h-4 w-4 text-muted-foreground" />
              {t('settings.mathDifficulty')}
            </label>
            <Select value={mathDifficulty} onValueChange={(value: Difficulty) => setMathDifficulty(value)}>
              <SelectTrigger id="math-difficulty" className="col-span-3">
                <SelectValue placeholder={t('settings.mathDifficulty')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* AI Strength (only show when playing against AI) */}
          {localOpponentType === 'ai' && (
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="ai-difficulty" className="text-right col-span-1 flex items-center justify-end gap-2 text-sm font-medium">
                  <BrainCircuit className="h-4 w-4 text-muted-foreground" />
                {t('settings.aiStrength')}
              </label>
              <Select value={aiDifficulty} onValueChange={(value: Difficulty) => setAiDifficulty(value)}>
                <SelectTrigger id="ai-difficulty" className="col-span-3">
                  <SelectValue placeholder={t('settings.aiStrength')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={handleStart} className="w-full text-lg h-12 bg-primary hover:bg-primary/90">
            <Play className="mr-2 h-5 w-5" />
            {t('gameSetup.startGame')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GameSetupModal;
