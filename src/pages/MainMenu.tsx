
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Play, Settings, BookOpen, BarChart3 } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

const MainMenu = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

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

        {/* Menu Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-2xl mx-auto animate-scale-in delay-700">
          <Button 
            onClick={() => navigate("/game")}
            className="h-14 sm:h-16 text-lg sm:text-xl font-semibold bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300"
            size="lg"
          >
            <Play className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6" />
            {t('mainMenu.playGame')}
          </Button>
          
          <Button 
            onClick={() => navigate("/tutorial")}
            variant="outline"
            className="h-14 sm:h-16 text-lg sm:text-xl font-semibold border-2 hover:bg-accent shadow-lg hover:shadow-xl transition-all duration-300"
            size="lg"
          >
            <BookOpen className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6" />
            {t('mainMenu.howToPlay')}
          </Button>
          
          <Button 
            onClick={() => navigate("/settings")}
            variant="outline"
            className="h-14 sm:h-16 text-lg sm:text-xl font-semibold border-2 hover:bg-accent shadow-lg hover:shadow-xl transition-all duration-300"
            size="lg"
          >
            <Settings className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6" />
            {t('mainMenu.settings')}
          </Button>
          
          <Button 
            onClick={() => navigate("/statistics")}
            variant="outline"
            className="h-14 sm:h-16 text-lg sm:text-xl font-semibold border-2 hover:bg-accent shadow-lg hover:shadow-xl transition-all duration-300"
            size="lg"
          >
            <BarChart3 className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6" />
            {t('mainMenu.statistics')}
          </Button>
        </div>

        {/* Footer */}
        <div className="mt-12 sm:mt-16 text-muted-foreground/60 text-sm sm:text-base">
          <p>{t('mainMenu.footer')}</p>
        </div>
      </div>
    </div>
  );
};

export default MainMenu;
