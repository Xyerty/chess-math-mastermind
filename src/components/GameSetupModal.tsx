
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from '../contexts/LanguageContext';
import { useDifficulty, Difficulty } from '../contexts/DifficultyContext';
import { BrainCircuit, Calculator, Play } from 'lucide-react';

interface GameSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartGame: (mathDifficulty: Difficulty, aiDifficulty: Difficulty) => void;
}

const GameSetupModal: React.FC<GameSetupModalProps> = ({ isOpen, onClose, onStartGame }) => {
  const { t } = useLanguage();
  const { mathDifficulty: currentMathDifficulty, aiDifficulty: currentAiDifficulty } = useDifficulty();
  
  const [mathDifficulty, setMathDifficulty] = useState<Difficulty>(currentMathDifficulty);
  const [aiDifficulty, setAiDifficulty] = useState<Difficulty>(currentAiDifficulty);

  const handleStart = () => {
    onStartGame(mathDifficulty, aiDifficulty);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] bg-card/80 backdrop-blur-sm border-border/50 shadow-2xl rounded-2xl animate-scale-in">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-primary flex items-center justify-center gap-2">
            <Play className="h-6 w-6" />
            Game Setup
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground pt-2">
            Configure difficulty before you start the game.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-6">
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

          {/* AI Strength */}
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
        </div>

        <DialogFooter>
          <Button onClick={handleStart} className="w-full text-lg h-12 bg-primary hover:bg-primary/90">
            <Play className="mr-2 h-5 w-5" />
            Start Game
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GameSetupModal;
