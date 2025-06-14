
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, Home, Settings, BarChart3, BookOpen, Sword } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useLanguage();

    const getTitle = () => {
        switch (location.pathname) {
            case '/game':
                return t('game.title');
            case '/settings':
                return t('settings.title');
            case '/statistics':
                return t('stats.title');
            case '/tutorial':
                 return t('mainMenu.howToPlay');
            default:
                return 'Chess & Math';
        }
    };

    const menuItems = [
      { title: t('mainMenu.title'), path: "/", icon: Home },
      { title: t('mainMenu.playGame'), path: "/game", icon: Sword },
      { title: t('mainMenu.howToPlay'), path: "/tutorial", icon: BookOpen },
      { title:t('mainMenu.statistics'), path: "/statistics", icon: BarChart3 },
      { title: t('mainMenu.settings'), path: "/settings", icon: Settings },
    ];

    return (
        <header className="flex items-center justify-between p-2 sm:p-4 border-b bg-card shadow-sm sticky top-0 z-40 h-[65px]">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" aria-label="Open navigation menu">
                        <Menu className="h-5 w-5" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                    {menuItems.map(item => (
                       <DropdownMenuItem key={item.path} onClick={() => navigate(item.path)} className="flex items-center gap-2 cursor-pointer">
                           <item.icon className="h-4 w-4 text-muted-foreground" />
                           <span>{item.title}</span>
                       </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>

            <h1 className="text-xl lg:text-2xl font-bold text-primary text-center absolute left-1/2 -translate-x-1/2 whitespace-nowrap">
                {getTitle()}
            </h1>

            <div className="w-[40px]"></div> {/* Spacer to balance the menu button */}
        </header>
    );
};

export default Header;
