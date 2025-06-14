
import { createContext, useContext, ReactNode } from 'react';
import { usePlayFab } from '@/hooks/usePlayFab';

interface PlayFabContextType {
  playFabData: any;
  loading: boolean;
  loginToPlayFab: () => Promise<void>;
  submitGameResult: (gameData: any) => Promise<void>;
  getLeaderboard: (leaderboardName: string) => Promise<any>;
  trackMathChallenge: (challengeData: any) => Promise<void>;
  retryConnection: () => void;
}

const PlayFabContext = createContext<PlayFabContextType | undefined>(undefined);

export const PlayFabProvider = ({ children }: { children: ReactNode }) => {
  const playFabHook = usePlayFab();

  return (
    <PlayFabContext.Provider value={playFabHook}>
      {children}
    </PlayFabContext.Provider>
  );
};

export const usePlayFabContext = () => {
  const context = useContext(PlayFabContext);
  if (context === undefined) {
    throw new Error('usePlayFabContext must be used within a PlayFabProvider');
  }
  return context;
};
