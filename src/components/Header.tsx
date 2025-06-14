
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';
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
            default:
                return 'Chess & Math';
        }
    };

    return (
        <header className="flex items-center justify-between p-4 border-b bg-card shadow-sm sticky top-0 z-40">
            <Button
                variant="outline"
                onClick={() => navigate('/')}
                className="flex items-center gap-2"
            >
                <ArrowLeft className="h-4 w-4" />
                {t('nav.backToMenu')}
            </Button>

            <h1 className="text-xl lg:text-2xl font-bold text-primary text-center absolute left-1/2 -translate-x-1/2">
                {getTitle()}
            </h1>

            <div className="w-auto">
                 <Button variant="ghost" size="icon" onClick={() => navigate('/')} aria-label="Home">
                    <Home className="h-5 w-5" />
                </Button>
            </div>
        </header>
    );
};

export default Header;
