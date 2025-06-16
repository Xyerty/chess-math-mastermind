import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Difficulty, useDifficulty } from "../contexts/DifficultyContext";
import { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Search, XCircle } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

interface GameSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartGame: (mathDifficulty: Difficulty, aiDifficulty: Difficulty) => void;
  onFindMatch: () => void;
  onCancelMatch: () => void;
  ticket: Tables<'matchmaking_tickets'> | null | undefined;
  isTicketLoading: boolean;
}

const GameSetupModal = ({ isOpen, onClose, onStartGame, onFindMatch, onCancelMatch, ticket, isTicketLoading }: GameSetupModalProps) => {
  const { mathDifficulty, aiDifficulty } = useDifficulty();
  const [currentMathDifficulty, setCurrentMathDifficulty] = useState<Difficulty>(mathDifficulty);
  const [currentAiDifficulty, setCurrentAiDifficulty] = useState<Difficulty>(aiDifficulty);
  const { t } = useLanguage();

  const handleStart = () => {
    onStartGame(currentMathDifficulty, currentAiDifficulty);
    onClose();
  };

  const isSearching = ticket?.status === 'searching';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{t('gameSetup.title')}</DialogTitle>
          <DialogDescription>{t('gameSetup.description')}</DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="practice" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="practice">{t('gameSetup.practice')}</TabsTrigger>
            <TabsTrigger value="ranked">{t('gameSetup.ranked')}</TabsTrigger>
          </TabsList>
          <TabsContent value="practice" className="space-y-4 pt-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">{t('gameSetup.mathDifficulty')}</h3>
              <Select value={currentMathDifficulty} onValueChange={(value) => setCurrentMathDifficulty(value as Difficulty)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={t(`difficulty.${currentMathDifficulty}`)} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">{t('difficulty.easy')}</SelectItem>
                  <SelectItem value="medium">{t('difficulty.medium')}</SelectItem>
                  <SelectItem value="hard">{t('difficulty.hard')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium">{t('gameSetup.aiDifficulty')}</h3>
              <Select value={currentAiDifficulty} onValueChange={(value) => setCurrentAiDifficulty(value as Difficulty)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={t(`difficulty.${currentAiDifficulty}`)} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">{t('difficulty.easy')}</SelectItem>
                  <SelectItem value="medium">{t('difficulty.medium')}</SelectItem>
                  <SelectItem value="hard">{t('difficulty.hard')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button onClick={handleStart}>{t('gameSetup.startGame')}</Button>
            </DialogFooter>
          </TabsContent>
          <TabsContent value="ranked" className="space-y-4 pt-4 text-center">
            <h3 className="font-semibold text-lg">1v1 Ranked Match</h3>
            <p className="text-sm text-muted-foreground">
              Challenge another player and climb the leaderboard. Your Elo rating will be on the line!
            </p>
            {isTicketLoading && <div className="flex justify-center items-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}
            
            {!isTicketLoading && (
              <>
                {isSearching ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center text-primary font-semibold animate-pulse">
                      <Search className="mr-2 h-5 w-5" />
                      Searching for opponent...
                    </div>
                    <Button variant="destructive" onClick={onCancelMatch} className="w-full">
                      <XCircle className="mr-2 h-4 w-4"/>
                      Cancel Search
                    </Button>
                  </div>
                ) : (
                  <Button onClick={onFindMatch} size="lg" className="w-full">
                    Find Match
                  </Button>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default GameSetupModal;
