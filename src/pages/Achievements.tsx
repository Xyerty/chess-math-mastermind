
import React from 'react';
import { useAchievements, Achievement } from '@/hooks/useAchievements';
import PageLoader from '@/components/PageLoader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AchievementIcon from '@/components/AchievementIcon';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { useUser } from '@clerk/clerk-react';

const AchievementsPage = () => {
  const { user } = useUser();
  const { data: achievements, isLoading, error } = useAchievements();

  const getDifficultyColor = (difficulty: Achievement['difficulty']) => {
    switch (difficulty) {
      case 'Common': return 'bg-slate-500';
      case 'Rare': return 'bg-blue-600';
      case 'Epic': return 'bg-purple-600';
      case 'Legendary': return 'bg-amber-500';
      default: return 'bg-gray-500';
    }
  };
  
  const getDifficultyBorder = (difficulty: Achievement['difficulty']) => {
    switch (difficulty) {
      case 'Common': return 'border-slate-500/30';
      case 'Rare': return 'border-blue-600/30';
      case 'Epic': return 'border-purple-600/30';
      case 'Legendary': return 'border-amber-500/30';
      default: return 'border-gray-500/30';
    }
  };

  if (isLoading) return <PageLoader />;
  
  if (error) return <div className="text-center text-destructive p-4">Could not load achievements. Please try again later.</div>;
  
  if (!user) return <div className="text-center text-muted-foreground p-4">Please sign in to view your achievements.</div>;

  if (!achievements || achievements.length === 0) {
    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8 text-center">
            <h1 className="text-4xl font-bold text-primary mb-2">Achievements</h1>
            <p className="text-muted-foreground">It looks like there are no achievements available at the moment. Please check back later!</p>
        </div>
    );
  }
  
  const unlockedCount = achievements.filter(a => a.unlocked_at).length;
  const totalCount = achievements.length;
  const totalPoints = achievements.filter(a => a.unlocked_at).reduce((sum, ach) => sum + ach.points, 0);

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-8 text-center animate-fade-in">
        <h1 className="text-4xl font-bold text-primary mb-2">Achievements</h1>
        <p className="text-muted-foreground">Track your progress and celebrate your victories!</p>
        <div className="mt-4 flex flex-wrap justify-center gap-4">
          <Badge variant="secondary" className="text-lg py-1 px-4">Unlocked: {unlockedCount} / {totalCount}</Badge>
          <Badge variant="secondary" className="text-lg py-1 px-4">Total Points: {totalPoints}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {achievements.map((achievement, index) => (
          <Card key={achievement.id} 
                className={`flex flex-col transition-all duration-300 transform hover:scale-105 ${achievement.unlocked_at ? 'bg-card' : 'bg-card/60 opacity-70'} border-2 ${getDifficultyBorder(achievement.difficulty)}`}
                style={{ animationDelay: `${index * 50}ms` }}>
            <CardHeader className="flex flex-row items-start gap-4 pb-4">
              <div className={`p-3 rounded-lg ${getDifficultyColor(achievement.difficulty)} shadow-md`}>
                <AchievementIcon iconName={achievement.icon_asset_name} className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-base leading-snug">{achievement.name}</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className={`text-xs ${getDifficultyColor(achievement.difficulty)} text-white border-none`}>{achievement.difficulty}</Badge>
                  <Badge variant="secondary" className="text-xs">{achievement.points} pts</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-between">
              <p className="text-muted-foreground text-sm mb-2">{achievement.description}</p>
              {achievement.unlocked_at ? (
                <p className="text-xs text-green-500 dark:text-green-400 mt-auto">
                  Unlocked {formatDistanceToNow(new Date(achievement.unlocked_at), { addSuffix: true })}
                </p>
              ) : (
                 <p className="text-xs text-muted-foreground/50 mt-auto">Locked</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AchievementsPage;
