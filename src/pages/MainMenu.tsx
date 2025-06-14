
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Play, Settings, BookOpen, BarChart3 } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import GameSetupModal from "../components/GameSetupModal";
import { useDifficulty, Difficulty } from "../contexts/DifficultyContext";

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
      icon: <Play className="h-8 w-8 text-primary" />,
      path: "/game",
      description: "Sharpen your mind with a game of chess and math.",
      primary: true,
    },
    {
      title: t('mainMenu.howToPlay'),
      icon: <BookOpen className="h-8 w-8" />,
      path: "/tutorial",
      description: "Learn the rules and master the strategies.",
    },
    {
      title: t('mainMenu.settings'),
      icon: <Settings className="h-8 w-8" />,
      path: "/settings",
      description: "Customize your game experience.",
    },
    {
      title: t('mainMenu.statistics'),
      icon: <BarChart3 className="h-8 w-8" />,
      path: "/statistics",
      description: "Track your progress and performance.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-green-100 flex flex-col items-center justify-center p-4">
      {/* Animated Chess Pieces Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 sm:top-20 left-10 sm:left-20 text-4xl sm:text-6xl text-muted-foreground/10 animate-pulse">♛</div>
        <div className="absolute top-20 sm:top-40 right-16 sm:right-32 text-3xl sm:text-5xl text-muted-foreground/10 animate-pulse delay-1000">♜</div>
        <div className="absolute bottom-20 sm:bottom-40 left-16 sm:left-32 text-5xl sm:text-7xl text-muted-foreground/10 animate-pulse delay-2000">♞</div>
        <div className="absolute bottom-10 sm:bottom-20 right-10 sm:right-20 text-3xl sm:text-5xl text-muted-foreground/10 animate-pulse delay-3000">♝</div>
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto w-full px-4">
        {/* Main Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-primary mb-2 sm:mb-4 animate-fade-in">
          {t('mainMenu.title')}
        </h1>
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-primary mb-6 sm:mb-8 animate-fade-in delay-300">
          {t('mainMenu.subtitle')}
        </h2>
        
        {/* Subtitle */}
        <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground mb-8 sm:mb-12 max-w-3xl mx-auto animate-fade-in delay-500">
          {t('mainMenu.description')}
        </p>

        {/* Menu Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto animate-scale-in delay-700">
          {menuItems.map((item) => (
            <Card 
              key={item.title}
              onClick={() => {
                if (item.path === '/game') {
                  setIsSetupModalOpen(true);
                } else {
                  navigate(item.path);
                }
              }}
              className={`
                group cursor-pointer overflow-hidden text-left
                transition-all duration-300 hover:shadow-2xl hover:-translate-y-2
                ${item.primary ? 'bg-primary/5 border-primary/20' : 'bg-card'}
              `}
            >
              <CardHeader className="flex flex-row items-center gap-4 pb-4">
                <div className={`
                  p-3 rounded-lg
                  ${item.primary ? 'bg-primary/10 group-hover:bg-primary/20' : 'bg-accent group-hover:bg-accent/80'}
                  transition-all duration-300 group-hover:scale-110
                `}>
                  {item.icon}
                </div>
                <CardTitle className="text-xl font-semibold text-primary">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 sm:mt-16 text-muted-foreground/60 text-sm sm:text-base">
          <p>{t('mainMenu.footer')}</p>
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
