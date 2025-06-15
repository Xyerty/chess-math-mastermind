import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Play, BookOpen, BarChart3, Trophy, Award } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useDifficulty, Difficulty } from "../contexts/DifficultyContext";
import GameSetupModal from "../components/GameSetupModal";
import MenuCard from "../components/MenuCard";
import TechLogos from "../components/TechLogos";
import { useUser } from "@clerk/clerk-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePlayFab } from "../hooks/usePlayFab";
import { toast } from "sonner";
import { useMatchmaking, useMatchmakingTicket } from "@/hooks/useMatchmaking";

const MainMenu = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);
  const { setMathDifficulty, setAiDifficulty } = useDifficulty();
  const { user } = useUser();
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

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('welcome.goodMorning');
    if (hour < 17) return t('welcome.goodAfternoon');
    return t('welcome.goodEvening');
  };

  const displayName = user?.firstName || user?.username || 'Player';
  const fallbackInitials = (displayName?.[0] || 'P').toUpperCase();

  const menuItems = [
    {
      key: 'play',
      title: t('mainMenu.playGame'),
      icon: Play,
      description: t('mainMenu.playGameDescription'),
      primary: true,
      action: () => setIsSetupModalOpen(true),
    },
    {
      key: 'leaderboard',
      title: "Leaderboard", // NOTE: This text is not yet translated.
      icon: Trophy,
      description: "See how you rank against other players.", // NOTE: This text is not yet translated.
      action: () => navigate("/leaderboard"),
    },
    {
      key: 'achievements',
      title: "Achievements", // NOTE: This text is not yet translated.
      icon: Award,
      description: "Track your progress and unlock rewards.", // NOTE: This text is not yet translated.
      action: () => navigate("/achievements"),
    },
    {
      key: 'howToPlay',
      title: t('mainMenu.howToPlay'),
      icon: BookOpen,
      description: t('mainMenu.howToPlayDescription'),
      action: () => navigate("/tutorial"),
    },
    {
      key: 'statistics',
      title: t('mainMenu.statistics'),
      icon: BarChart3,
      description: t('mainMenu.statisticsDescription'),
      action: () => navigate("/statistics"),
    },
    // The settings option is available in the global header.
  ];

  const playItem = menuItems.find(item => item.key === 'play');
  const secondaryItems = menuItems.filter(item => ['leaderboard', 'achievements', 'howToPlay', 'statistics'].includes(item.key));

  return (
    <div className="bg-gradient-to-br from-gray-50 to-slate-100 dark:from-slate-900 dark:to-background">
      <div className="container mx-auto px-4 py-8 sm:py-12 max-w-4xl space-y-12">
        {/* Consolidated Header Section */}
        <div className="text-center animate-fade-in">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-primary mb-4">
            Mathematical<br className="sm:hidden" /> Chess
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto" style={{ animationDelay: '200ms' }}>
            {t('mainMenu.appDescription')}
          </p>
          
          {/* Integrated Welcome Message */}
          <div className="mt-8 flex flex-col items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: '300ms' }}>
            <Avatar className="h-16 w-16 ring-4 ring-primary/20 shrink-0">
              <AvatarImage src={user?.imageUrl} alt={displayName} />
              <AvatarFallback className="text-xl font-semibold bg-primary/10 text-primary">
                {fallbackInitials}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                {getTimeOfDay()}, <span className="text-primary">{displayName}</span>!
              </h2>
              <p className="text-muted-foreground mt-1">{t('welcome.challengePrompt')}</p>
            </div>
          </div>
        </div>

        {/* Menu Cards */}
        <div className="space-y-6 md:space-y-8">
          {/* Primary Action */}
          {playItem && (
            <div className="animate-fade-in" style={{ animationDelay: '500ms' }}>
              <MenuCard
                key={playItem.key}
                title={playItem.title}
                description={playItem.description}
                icon={playItem.icon}
                onClick={playItem.action}
                primary={playItem.primary}
              />
            </div>
          )}
          
          {/* Secondary Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 animate-fade-in" style={{ animationDelay: '600ms' }}>
            {secondaryItems.map((item) => (
              <MenuCard
                key={item.key}
                title={item.title}
                description={item.description}
                icon={item.icon}
                onClick={item.action}
              />
            ))}
          </div>
        </div>


        {/* Quick Stats or Tips Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center animate-fade-in" style={{ animationDelay: '700ms' }}>
          <div className="p-6 rounded-lg bg-accent/50 hover:bg-accent/80 transition-colors">
            <div className="text-4xl font-bold text-primary mb-2">♜</div>
            <h3 className="font-semibold text-lg">{t('mainMenu.strategicThinkingTitle')}</h3>
            <p className="text-sm text-muted-foreground">{t('mainMenu.strategicThinkingDescription')}</p>
          </div>
          <div className="p-6 rounded-lg bg-accent/50 hover:bg-accent/80 transition-colors">
            <div className="text-4xl font-bold text-primary mb-2">∑</div>
            <h3 className="font-semibold text-lg">{t('mainMenu.mathChallengesTitle')}</h3>
            <p className="text-sm text-muted-foreground">{t('mainMenu.mathChallengesDescription')}</p>
          </div>
          <div className="p-6 rounded-lg bg-accent/50 hover:bg-accent/80 transition-colors">
            <div className="text-4xl font-bold text-primary mb-2">🏆</div>
            <h3 className="font-semibold text-lg">{t('mainMenu.skillBuildingTitle')}</h3>
            <p className="text-sm text-muted-foreground">{t('mainMenu.skillBuildingDescription')}</p>
          </div>
        </div>

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
