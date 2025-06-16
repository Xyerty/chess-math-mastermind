
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Difficulty = 'easy' | 'medium' | 'hard';

interface DifficultyContextType {
  mathDifficulty: Difficulty;
  setMathDifficulty: (difficulty: Difficulty) => void;
  aiDifficulty: Difficulty;
  setAiDifficulty: (difficulty: Difficulty) => void;
}

const DifficultyContext = createContext<DifficultyContextType | undefined>(undefined);

export const DifficultyProvider = ({ children }: { children: ReactNode }) => {
  const [mathDifficulty, setMathDifficultyState] = useState<Difficulty>(() => {
    const saved = localStorage.getItem('mathDifficulty');
    return (saved as Difficulty) || 'medium';
  });

  const [aiDifficulty, setAiDifficultyState] = useState<Difficulty>(() => {
    const saved = localStorage.getItem('aiDifficulty');
    return (saved as Difficulty) || 'medium';
  });

  useEffect(() => {
    localStorage.setItem('mathDifficulty', mathDifficulty);
  }, [mathDifficulty]);

  useEffect(() => {
    localStorage.setItem('aiDifficulty', aiDifficulty);
  }, [aiDifficulty]);

  const setMathDifficulty = (difficulty: Difficulty) => {
    setMathDifficultyState(difficulty);
  };

  const setAiDifficulty = (difficulty: Difficulty) => {
    setAiDifficultyState(difficulty);
  };

  return (
    <DifficultyContext.Provider value={{ mathDifficulty, setMathDifficulty, aiDifficulty, setAiDifficulty }}>
      {children}
    </DifficultyContext.Provider>
  );
};

export const useDifficulty = () => {
  const context = useContext(DifficultyContext);
  if (context === undefined) {
    throw new Error('useDifficulty must be used within a DifficultyProvider');
  }
  return context;
};
