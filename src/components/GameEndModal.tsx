
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { GameStatus, Player } from '../features/chess/types';
import { Trophy, RotateCcw, Menu } from 'lucide-react';

interface GameEndModalProps {
  isOpen: boolean;
  status: GameStatus;
  winner: Player | null;
  onNewGame: () => void;
  onGoHome: () => void;
}

const GameEndModal: React.FC<GameEndModalProps> = ({ isOpen, status, winner, onNewGame, onGoHome }) => {
  
  const getEndGameMessage = () => {
    const winnerName = winner ? winner.charAt(0).toUpperCase() + winner.slice(1) : '';
    switch (status) {
      case 'checkmate':
        return { title: 'Checkmate! 🏆', description: `${winnerName} wins!` };
      case 'timeout':
        return { title: 'Time\'s Up! ⌛', description: `${winnerName} wins on time.` };
      case 'resigned':
        return { title: 'Game Resigned 🏳️', description: `${winnerName} wins.` };
      case 'stalemate':
        return { title: 'Stalemate 🤝', description: "It's a draw." };
      default:
        return { title: '', description: '' };
    }
  };

  const { title, description } = getEndGameMessage();

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onNewGame()}>
      <DialogContent className="sm:max-w-md text-center bg-card/90 backdrop-blur-sm animate-scale-in">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold flex items-center justify-center gap-2 text-primary">
            <Trophy className="h-8 w-8" />
            {title}
          </DialogTitle>
          <DialogDescription className="text-lg text-muted-foreground pt-2">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-center gap-2 pt-4">
          <Button onClick={onNewGame} className="w-full sm:w-auto">
            <RotateCcw className="mr-2 h-4 w-4" />
            Play Again
          </Button>
          <Button onClick={onGoHome} variant="outline" className="w-full sm:w-auto">
            <Menu className="mr-2 h-4 w-4" />
            Main Menu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GameEndModal;
