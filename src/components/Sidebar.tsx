
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, Settings, BarChart3, BookOpen, Sword, Trophy, Award } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();

  const menuItems = [
    { title: "Home", path: "/", icon: Home },
    { title: t('mainMenu.playGame'), path: "/game", icon: Sword },
    { title: "Leaderboard", path: "/leaderboard", icon: Trophy },
    { title: "Achievements", path: "/achievements", icon: Award },
    { title: t('mainMenu.howToPlay'), path: "/tutorial", icon: BookOpen },
    { title: t('mainMenu.statistics'), path: "/statistics", icon: BarChart3 },
    { title: t('mainMenu.settings'), path: "/settings", icon: Settings },
  ];

  return (
    <TooltipProvider>
      <aside className="w-64 bg-card p-4 flex flex-col gap-2">
        <div className="flex items-center mb-4">
          <img src="/logo.svg" alt="Logo" className="h-8 w-8 mr-2" />
          <h2 className="text-lg font-semibold">ChessMaster</h2>
        </div>
        {menuItems.map(item => (
          <Tooltip key={item.path}>
            <TooltipTrigger asChild>
              <Button variant={location.pathname === item.path ? "secondary" : "ghost"} className="justify-start" onClick={() => navigate(item.path)}>
                <item.icon className="mr-2 h-4 w-4" />
                {item.title}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{item.title}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </aside>
    </TooltipProvider>
  );
};

export default Sidebar;
