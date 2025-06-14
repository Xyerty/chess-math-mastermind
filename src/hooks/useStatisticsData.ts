
import { useMemo } from 'react';

// In a real app, this would come from an API or local storage.
const MOCK_DATA = {
  summary: {
    wins: 28,
    losses: 15,
    draws: 7,
    mathCorrect: 230,
    mathIncorrect: 45,
    avgSolveTime: 8.7,
    bestSolveTime: 2.1,
  },
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
  const data = useMemo(() => {
    const totalGames = MOCK_DATA.summary.wins + MOCK_DATA.summary.losses + MOCK_DATA.summary.draws;
    const totalMathProblems = MOCK_DATA.summary.mathCorrect + MOCK_DATA.summary.mathIncorrect;

    if (totalGames === 0) {
      return null;
    }

    return {
      summary: {
        ...MOCK_DATA.summary,
        totalGames,
        winRate: totalGames > 0 ? (MOCK_DATA.summary.wins / totalGames) * 100 : 0,
        mathAccuracy: totalMathProblems > 0 ? (MOCK_DATA.summary.mathCorrect / totalMathProblems) * 100 : 0,
      },
      progress: MOCK_DATA.progress.map(p => ({ ...p, time: parseFloat(p.time.toFixed(1)) })),
      accuracyByDifficulty: MOCK_DATA.accuracyByDifficulty.map(d => ({...d, accuracy: (d.correct / (d.correct + d.incorrect)) * 100})),
      openings: MOCK_DATA.openings,
      winLossData: [
        { result: 'wins', value: MOCK_DATA.summary.wins, fill: 'hsl(var(--chart-1))' },
        { result: 'losses', value: MOCK_DATA.summary.losses, fill: 'hsl(var(--chart-2))' },
        { result: 'draws', value: MOCK_DATA.summary.draws, fill: 'hsl(var(--chart-3))' },
      ],
    };
  }, []);

  return data;
};
