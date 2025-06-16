
import { useLanguage } from "../contexts/LanguageContext";
import { useStatisticsData } from "../hooks/useStatisticsData";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BarChart3, Clock, Target, Trophy } from "lucide-react";
import StatCard from "../components/statistics/StatCard";
import WinLossPieChart from "../components/statistics/WinLossPieChart";
import AccuracyBarChart from "../components/statistics/AccuracyBarChart";
import ProgressChart from "../components/statistics/ProgressChart";
import FavoriteOpenings from "../components/statistics/FavoriteOpenings";

const Statistics = () => {
  const { t } = useLanguage();
  const statsData = useStatisticsData();

  if (!statsData) {
    return (
      <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
        <Alert>
          <BarChart3 className="h-4 w-4" />
          <AlertTitle>{t('stats.title')}</AlertTitle>
          <AlertDescription>{t('stats.noData')}</AlertDescription>
        </Alert>
      </div>
    );
  }

  const { summary, winLossData, accuracyByDifficulty, progress, openings } = statsData;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
        <h1 className="text-3xl font-bold tracking-tight mb-6 animate-fade-in">{t('stats.dashboardTitle')}</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatCard title={t('stats.totalGames')} icon={Trophy}>
                <div className="text-4xl font-bold">{summary.totalGames}</div>
                <p className="text-xs text-muted-foreground">{summary.winRate.toFixed(1)}% {t('stats.winrate')}</p>
            </StatCard>
            <StatCard title={t('stats.mathAccuracy')} icon={Target}>
                <div className="text-4xl font-bold">{summary.mathAccuracy.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">{summary.mathCorrect} {t('stats.correct')} / {summary.mathIncorrect} {t('stats.incorrect')}</p>
            </StatCard>
            <StatCard title={t('stats.avgSolveTime')} icon={Clock}>
                <div className="text-4xl font-bold">{summary.avgSolveTime}s</div>
                <p className="text-xs text-muted-foreground">{t('stats.personalBest')}: {summary.bestSolveTime}s</p>
            </StatCard>
            <WinLossPieChart data={winLossData} />
        </div>
        <div className="grid gap-6 mt-6 md:grid-cols-1 lg:grid-cols-2">
            <ProgressChart data={progress} />
            <div className="space-y-6">
                <AccuracyBarChart data={accuracyByDifficulty} />
                <FavoriteOpenings openings={openings} />
            </div>
        </div>
    </div>
  );
};

export default Statistics;
