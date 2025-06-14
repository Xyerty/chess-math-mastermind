
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { BarChart3 } from 'lucide-react';

interface Opening {
  name: string;
  played: number;
  winRate: number;
}

interface FavoriteOpeningsProps {
  openings: Opening[];
}

const FavoriteOpenings: React.FC<FavoriteOpeningsProps> = ({ openings }) => {
  const { t } = useLanguage();
  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          {t('stats.favoriteOpenings')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          <li className="grid grid-cols-3 gap-4 text-sm font-semibold text-muted-foreground">
            <span>{t('stats.opening')}</span>
            <span className="text-center">{t('stats.played')}</span>
            <span className="text-right">{t('stats.winrate')}</span>
          </li>
          {openings.map((op) => (
            <li key={op.name} className="grid grid-cols-3 gap-4 items-center text-sm">
              <span className="font-medium text-primary truncate">{op.name}</span>
              <span className="text-center text-muted-foreground">{op.played}</span>
              <div className="text-right text-muted-foreground flex items-center justify-end gap-2">
                <span>{op.winRate}%</span>
                <div className="w-12 bg-accent rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: `${op.winRate}%` }}></div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default FavoriteOpenings;
