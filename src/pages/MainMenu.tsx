
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Play, Settings, BookOpen, BarChart3 } from "lucide-react";

const MainMenu = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-green-100 flex flex-col items-center justify-center p-4">
      {/* Animated Chess Pieces Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 text-6xl text-muted-foreground/10 animate-pulse">♛</div>
        <div className="absolute top-40 right-32 text-5xl text-muted-foreground/10 animate-pulse delay-1000">♜</div>
        <div className="absolute bottom-40 left-32 text-7xl text-muted-foreground/10 animate-pulse delay-2000">♞</div>
        <div className="absolute bottom-20 right-20 text-5xl text-muted-foreground/10 animate-pulse delay-3000">♝</div>
      </div>

      <div className="relative z-10 text-center max-w-2xl mx-auto">
        {/* Main Title */}
        <h1 className="text-7xl font-bold tracking-tight text-primary mb-4 animate-fade-in">
          Chess Math
        </h1>
        <h2 className="text-6xl font-bold tracking-tight text-primary mb-8 animate-fade-in delay-300">
          Mastermind
        </h2>
        
        {/* Subtitle */}
        <p className="text-2xl text-muted-foreground mb-12 animate-fade-in delay-500">
          Challenge your mind with chess moves that require solving math problems!
        </p>

        {/* Menu Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-scale-in delay-700">
          <Button 
            onClick={() => navigate("/game")}
            className="h-16 text-xl font-semibold bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300"
            size="lg"
          >
            <Play className="mr-3 h-6 w-6" />
            Play Game
          </Button>
          
          <Button 
            onClick={() => navigate("/tutorial")}
            variant="outline"
            className="h-16 text-xl font-semibold border-2 hover:bg-accent shadow-lg hover:shadow-xl transition-all duration-300"
            size="lg"
          >
            <BookOpen className="mr-3 h-6 w-6" />
            How to Play
          </Button>
          
          <Button 
            onClick={() => navigate("/settings")}
            variant="outline"
            className="h-16 text-xl font-semibold border-2 hover:bg-accent shadow-lg hover:shadow-xl transition-all duration-300"
            size="lg"
          >
            <Settings className="mr-3 h-6 w-6" />
            Settings
          </Button>
          
          <Button 
            onClick={() => navigate("/statistics")}
            variant="outline"
            className="h-16 text-xl font-semibold border-2 hover:bg-accent shadow-lg hover:shadow-xl transition-all duration-300"
            size="lg"
          >
            <BarChart3 className="mr-3 h-6 w-6" />
            Statistics
          </Button>
        </div>

        {/* Footer */}
        <div className="mt-16 text-muted-foreground/60">
          <p>Think fast, move smart, solve math!</p>
        </div>
      </div>
    </div>
  );
};

export default MainMenu;
