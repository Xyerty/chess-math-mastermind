
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, BookOpen, BarChart3, Trophy, Award } from 'lucide-react';
import MenuCard from '../MenuCard';
import { useLanguage } from '@/contexts/LanguageContext';

interface MainMenuActionsProps {
  onPlayClick: () => void;
}

const MainMenuActions: React.FC<MainMenuActionsProps> = ({ onPlayClick }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const menuItems = [
    {
      key: 'play',
      title: t('mainMenu.playGame'),
      icon: Play,
      description: t('mainMenu.playGameDescription'),
      primary: true,
      action: onPlayClick,
    },
    {
      key: 'leaderboard',
      title: "Leaderboard",
      icon: Trophy,
      description: "See how you rank against other players.",
      action: () => navigate("/leaderboard"),
    },
    {
      key: 'achievements',
      title: "Achievements",
      icon: Award,
      description: "Track your progress and unlock rewards.",
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
  ];

  const playItem = menuItems.find(item => item.key === 'play');
  const secondaryItems = menuItems.filter(item => ['leaderboard', 'achievements', 'howToPlay', 'statistics'].includes(item.key));

  return (
    <div className="space-y-6 md:space-y-8">
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
  );
};

export default MainMenuActions;
