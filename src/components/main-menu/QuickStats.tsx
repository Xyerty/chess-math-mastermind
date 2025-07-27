
import { useLanguage } from '@/contexts/LanguageContext';

const QuickStats = () => {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center animate-fade-in" style={{ animationDelay: '700ms' }}>
      <div className="p-6 rounded-lg bg-accent/50 hover:bg-accent/80 transition-colors">
        <div className="text-4xl font-bold text-primary mb-2">♜</div>
        <h3 className="font-semibold text-lg">{t('mainMenu.strategicThinkingTitle')}</h3>
        <p className="text-sm text-muted-foreground">{t('mainMenu.strategicThinkingDescription')}</p>
      </div>
      <div className="p-6 rounded-lg bg-accent/50 hover:bg-accent/80 transition-colors">
        <div className="text-4xl font-bold text-primary mb-2">∑</div>
        <h3 className="font-semibold text-lg">{t('mainMenu.mathChallengesTitle')}</h3>
        <p className="text-sm text-muted-foreground">{t('mainMenu.mathChallengesDescription')}</p>
      </div>
      <div className="p-6 rounded-lg bg-accent/50 hover:bg-accent/80 transition-colors">
        <div className="text-4xl font-bold text-primary mb-2">🏆</div>
        <h3 className="font-semibold text-lg">{t('mainMenu.skillBuildingTitle')}</h3>
        <p className="text-sm text-muted-foreground">{t('mainMenu.skillBuildingDescription')}</p>
      </div>
    </div>
  );
};

export default QuickStats;
