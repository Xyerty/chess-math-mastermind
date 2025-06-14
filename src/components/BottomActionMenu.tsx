
import React from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw, Flag, Lightbulb } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface BottomActionMenuProps {
  onNewGame: () => void;
  onResign: () => void;
  onHint: () => void;
}

const BottomActionMenu: React.FC<BottomActionMenuProps> = ({ onNewGame, onResign, onHint }) => {
    const { t } = useLanguage();
    
    return (
        <div className="fixed bottom-0 left-0 right-0 w-full bg-card/80 backdrop-blur-sm border-t p-2 z-30">
            <div className="max-w-2xl mx-auto flex justify-around items-center">
                <Button variant="ghost" className="flex flex-col h-auto p-1" onClick={onNewGame}>
                    <RotateCcw className="h-5 w-5 mb-1" />
                    <span className="text-xs font-semibold">{t('controls.newGame')}</span>
                </Button>
                <Button variant="ghost" className="flex flex-col h-auto p-1 text-yellow-500 hover:text-yellow-600" onClick={onHint}>
                    <Lightbulb className="h-5 w-5 mb-1" />
                    <span className="text-xs font-semibold">{t('controls.getHint')}</span>
                </Button>
                <Button variant="ghost" className="flex flex-col h-auto p-1 text-destructive hover:text-destructive/90" onClick={onResign}>
                    <Flag className="h-5 w-5 mb-1" />
                    <span className="text-xs font-semibold">{t('controls.resign')}</span>
                </Button>
            </div>
        </div>
    );
};

export default BottomActionMenu;
