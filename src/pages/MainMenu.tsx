
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDifficulty, Difficulty } from "../contexts/DifficultyContext";
import GameSetupModal from "../components/GameSetupModal";
import TechLogos from "../components/TechLogos";
import { useMatchmaking } from "@/hooks/useMatchmaking";
import { useMatchmakingTicket } from "@/hooks/useMatchmakingTicket";
import { toast } from "sonner";
import MainMenuHeader from "@/components/main-menu/MainMenuHeader";
import MainMenuActions from "@/components/main-menu/MainMenuActions";
import QuickStats from "@/components/main-menu/QuickStats";

const MainMenu = () => {
  const navigate = useNavigate();
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);
  const { setMathDifficulty, setAiDifficulty } = useDifficulty();
  const { findMatch, cancelMatch } = useMatchmaking();
  const { data: ticket, isLoading: isTicketLoading } = useMatchmakingTicket();

  useEffect(() => {
    if (ticket?.status === 'matched' && ticket.game_session_id) {
      toast.success("Match found! Joining game...");
      setIsSetupModalOpen(false);
      // For now, we just navigate to the generic game page.
      // The next step will be to handle the game session ID.
      navigate(`/game`);
    }
  }, [ticket, navigate]);

  const handleStartGame = (mathDifficulty: Difficulty, aiDifficulty: Difficulty) => {
    setMathDifficulty(mathDifficulty);
    setAiDifficulty(aiDifficulty);
    navigate("/game");
  };

  const handleFindMatch = async () => {
    await findMatch.mutateAsync('ranked');
  };

  const handleCancelMatch = async () => {
    await cancelMatch.mutateAsync();
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-slate-100 dark:from-slate-900 dark:to-background">
      <div className="container mx-auto px-4 py-8 sm:py-12 max-w-4xl space-y-12">
        <MainMenuHeader />
        
        <MainMenuActions onPlayClick={() => setIsSetupModalOpen(true)} />

        <QuickStats />

        <div className="animate-fade-in" style={{ animationDelay: '800ms' }}>
          <TechLogos />
        </div>
      </div>

      <GameSetupModal
        isOpen={isSetupModalOpen}
        onClose={() => setIsSetupModalOpen(false)}
        onStartGame={handleStartGame}
        onFindMatch={handleFindMatch}
        onCancelMatch={handleCancelMatch}
        ticket={ticket}
        isTicketLoading={isTicketLoading || findMatch.isPending || cancelMatch.isPending}
      />
    </div>
  );
};

export default MainMenu;
