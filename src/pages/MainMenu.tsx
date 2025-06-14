
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Play, BookOpen, BarChart3, Settings } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useDifficulty, Difficulty } from "../contexts/DifficultyContext";
import GameSetupModal from "../components/GameSetupModal";
import WelcomeSection from "../components/WelcomeSection";
import MenuCard from "../components/MenuCard";

const MainMenu = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);
  const { setMathDifficulty, setAiDifficulty } = useDifficulty();

  const handleStartGame = (mathDifficulty: Difficulty, aiDifficulty: Difficulty) => {
    setMathDifficulty(mathDifficulty);
    setAiDifficulty(aiDifficulty);
    navigate("/game");
  };

  const menuItems = [
    {
      title: t('mainMenu.playGame'),
      icon: Play,
      description: "Start a new chess game with mathematical challenges",
      primary: true,
      action: () => setIsSetupModalOpen(true),
    },
    {
      title: t('mainMenu.howToPlay'),
      icon: BookOpen,
      description: "Learn the rules and master the strategies",
      action: () => navigate("/tutorial"),
    },
    {
      title: t('mainMenu.statistics'),
      icon: BarChart3,
      description: "Track your progress and performance",
      action: () => navigate("/statistics"),
    },
    {
      title: t('mainMenu.settings'),
      icon: Settings,
      description: "Customize your game experience",
      action: () => navigate("/settings"),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-primary mb-4">
            Mathematical Chess
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Where strategy meets calculation. Challenge your mind with chess that requires both tactical thinking and mathematical precision.
          </p>
        </div>

        {/* Welcome Section */}
        <div className="mb-8">
          <WelcomeSection />
        </div>

        {/* Menu Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {menuItems.map((item) => (
            <MenuCard
              key={item.title}
              title={item.title}
              description={item.description}
              icon={item.icon}
              onClick={item.action}
              primary={item.primary}
            />
          ))}
        </div>

        {/* Quick Stats or Tips Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="p-4 rounded-lg bg-accent/50">
            <div className="text-2xl font-bold text-primary mb-1">♜</div>
            <h3 className="font-semibold text-sm">Strategic Thinking</h3>
            <p className="text-xs text-muted-foreground">Plan your moves carefully</p>
          </div>
          <div className="p-4 rounded-lg bg-accent/50">
            <div className="text-2xl font-bold text-primary mb-1">∑</div>
            <h3 className="font-semibold text-sm">Math Challenges</h3>
            <p className="text-xs text-muted-foreground">Solve to unlock moves</p>
          </div>
          <div className="p-4 rounded-lg bg-accent/50">
            <div className="text-2xl font-bold text-primary mb-1">🏆</div>
            <h3 className="font-semibold text-sm">Skill Building</h3>
            <p className="text-xs text-muted-foreground">Improve with every game</p>
          </div>
        </div>
      </div>

      <GameSetupModal
        isOpen={isSetupModalOpen}
        onClose={() => setIsSetupModalOpen(false)}
        onStartGame={handleStartGame}
      />
    </div>
  );
};

export default MainMenu;
