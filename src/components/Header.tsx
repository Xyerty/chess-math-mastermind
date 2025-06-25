
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from 'next-themes';

const Header = () => {
    const location = useLocation();
    const { t } = useLanguage();
    const { setTheme, theme } = useTheme();

    const getTitle = () => {
        switch (location.pathname) {
            case '/':
                return null;
            case '/game':
                return t('game.title');
            case '/settings':
                return t('settings.title');
            case '/statistics':
                return t('stats.title');
            case '/leaderboard':
                return "Leaderboard";
            case '/achievements':
                return "Achievements";
            case '/tutorial':
                 return t('mainMenu.howToPlay');
            default:
                return 'Mathematical Chess';
        }
    };
    
    const title = getTitle();

    return (
        <header className="flex items-center justify-between p-4 border-b bg-card/95 backdrop-blur-sm shadow-sm sticky top-0 z-40 h-[65px]">
            {title && (
                <h1 className="text-xl lg:text-2xl font-bold text-primary text-center absolute left-1/2 -translate-x-1/2 whitespace-nowrap">
                    {title}
                </h1>
            )}

            <div className="flex-grow"></div>

            <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                aria-label="Toggle theme"
            >
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
            </Button>
        </header>
    );
};

export default Header;
