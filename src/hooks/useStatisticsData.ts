import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@clerk/clerk-react';

// Mock data for features not yet implemented in the database
const MOCK_DATA = {
  progress: Array.from({ length: 10 }, (_, i) => ({
    game: i + 1,
    accuracy: Math.min(98, 65 + i * 3 + Math.random() * 5),
    time: Math.max(5, 12 - i * 0.5 + Math.random() * 2),
  })),
  accuracyByDifficulty: [
    { difficulty: 'Easy', correct: 150, incorrect: 10 },
    { difficulty: 'Medium', correct: 70, incorrect: 20 },
    { difficulty: 'Hard', correct: 10, incorrect: 15 },
  ],
  openings: [
    { name: "King's Pawn Opening", played: 18, winRate: 61 },
    { name: "Queen's Gambit", played: 12, winRate: 67 },
    { name: "Sicilian Defense", played: 10, winRate: 50 },
    { name: "Italian Game", played: 5, winRate: 80 },
  ],
};

export const useStatisticsData = () => {
  const { userId } = useAuth();

  const fetchStatistics = async (userId: string) => {
    console.log('Fetching statistics for user:', userId);
    
    const { data: stats, error } = await supabase
      .from('game_statistics')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error("Error fetching statistics:", error.message);
      // Return null so the UI can handle it gracefully
      return null;
    }

    if (!stats) {
      console.log('No statistics found for user');
      return null;
    }
    
    console.log('Statistics fetched successfully:', stats);
    
    const totalGames = stats.total_games ?? 0;
    const totalMathProblems = stats.total_math_problems ?? 0;
    const correctMathProblems = stats.correct_math_problems ?? 0;

    return {
      summary: {
        wins: stats.wins ?? 0,
        losses: stats.losses ?? 0,
        draws: stats.draws ?? 0,
        mathCorrect: correctMathProblems,
        mathIncorrect: totalMathProblems - correctMathProblems,
        avgSolveTime: stats.avg_solve_time_s ?? 0,
        bestSolveTime: stats.best_solve_time_s ?? 0,
        totalGames,
        winRate: Number(stats.win_rate ?? 0),
        mathAccuracy: Number(stats.math_accuracy ?? 0),
      },
      // The following data is still mocked and can be implemented later
      progress: MOCK_DATA.progress.map(p => ({ ...p, time: parseFloat(p.time.toFixed(1)) })),
      accuracyByDifficulty: MOCK_DATA.accuracyByDifficulty.map(d => ({
        ...d, 
        accuracy: (d.correct / (d.correct + d.incorrect)) * 100
      })),
      openings: MOCK_DATA.openings,
      winLossData: [
        { result: 'wins', value: stats.wins ?? 0, fill: 'hsl(var(--chart-1))' },
        { result: 'losses', value: stats.losses ?? 0, fill: 'hsl(var(--chart-2))' },
        { result: 'draws', value: stats.draws ?? 0, fill: 'hsl(var(--chart-3))' },
      ],
    };
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['statistics', userId],
    queryFn: () => {
      if (!userId) {
        console.log('No user ID available for statistics query');
        return Promise.resolve(null);
      }
      return fetchStatistics(userId);
    },
    enabled: !!userId,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) {
    console.log('Statistics loading...');
    return null;
  }
  
  if (error) {
    console.error('Statistics query error:', error);
    return null;
  }
  
  return data;
};
