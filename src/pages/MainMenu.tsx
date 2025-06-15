import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Play, BookOpen, BarChart3, Settings } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useDifficulty, Difficulty } from "../contexts/DifficultyContext";
import GameSetupModal from "../components/GameSetupModal";
import WelcomeSection from "../components/WelcomeSection";
import MenuCard from "../components/MenuCard";
import TechLogos from "../components/TechLogos";

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 dark:from-slate-900 dark:to-background">
      <div className="container mx-auto px-4 py-8 sm:py-12 max-w-6xl space-y-12">
        {/* Header Section */}
        <div className="text-center animate-fade-in">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-primary mb-4">
            Mathematical<br className="sm:hidden" /> Chess
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto" style={{ animationDelay: '200ms' }}>
            Where strategy meets calculation. Challenge your mind with chess that requires both tactical thinking and mathematical precision.
          </p>
        </div>

        {/* Welcome Section */}
        <div className="animate-fade-in" style={{ animationDelay: '400ms' }}>
          <WelcomeSection />
        </div>

        {/* Menu Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {menuItems.map((item, index) => (
            <MenuCard
              key={item.title}
              title={item.title}
              description={item.description}
              icon={item.icon}
              onClick={item.action}
              primary={item.primary}
              className={item.primary ? "md:col-span-2" : ""}
              style={{ animationDelay: `${500 + index * 100}ms` }}
            />
          ))}
        </div>

        {/* Quick Stats or Tips Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center animate-fade-in" style={{ animationDelay: '900ms' }}>
          <div className="p-6 rounded-lg bg-accent/50 hover:bg-accent/80 transition-colors">
            <div className="text-4xl font-bold text-primary mb-2">♜</div>
            <h3 className="font-semibold text-lg">Strategic Thinking</h3>
            <p className="text-sm text-muted-foreground">Plan your moves carefully</p>
          </div>
          <div className="p-6 rounded-lg bg-accent/50 hover:bg-accent/80 transition-colors">
            <div className="text-4xl font-bold text-primary mb-2">∑</div>
            <h3 className="font-semibold text-lg">Math Challenges</h3>
            <p className="text-sm text-muted-foreground">Solve to unlock moves</p>
          </div>
          <div className="p-6 rounded-lg bg-accent/50 hover:bg-accent/80 transition-colors">
            <div className="text-4xl font-bold text-primary mb-2">🏆</div>
            <h3 className="font-semibold text-lg">Skill Building</h3>
            <p className="text-sm text-muted-foreground">Improve with every game</p>
          </div>
        </div>

        <div className="animate-fade-in" style={{ animationDelay: '1000ms' }}>
          <TechLogos />
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
