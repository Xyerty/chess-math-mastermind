import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { useUserRanking, type UserRanking } from '@/hooks/useUserRanking';
import { User } from '@supabase/supabase-js';

// This interface combines Supabase's user data with our app-specific ranking data.
export interface CurrentUser extends UserRanking {
  id: string;
  fullName: string | null;
  imageUrl: string | null;
  email: string | null;
}

interface UserContextType {
  currentUser: CurrentUser | null;
  isLoading: boolean;
  error: Error | null;
  user: User | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const session = useSession();
  const user = session?.user ?? null;
  const { data: rankingData, isLoading: isRankingLoading, error: rankingError } = useUserRanking();

  const [contextState, setContextState] = useState<UserContextType>({
    currentUser: null,
    isLoading: true,
    error: null,
    user: null,
  });

  useEffect(() => {
    const loading = !session || isRankingLoading;

    if (loading && !session) {
      setContextState({ currentUser: null, isLoading: true, error: null, user: null });
      return;
    }

    if (user) {
      const ranking: UserRanking = rankingData ?? { elo: 1200, wins: 0, losses: 0, draws: 0 };
      
      setContextState({
        currentUser: {
          ...ranking,
          id: user.id,
          fullName: user.user_metadata.full_name ?? null,
          imageUrl: user.user_metadata.avatar_url ?? null,
          email: user.email ?? null,
        },
        isLoading: isRankingLoading,
        error: rankingError,
        user,
      });
    } else {
      setContextState({
        currentUser: null,
        isLoading: false,
        error: null,
        user: null,
      });
    }
  }, [user, session, rankingData, isRankingLoading, rankingError]);
  
  return <UserContext.Provider value={contextState}>{children}</UserContext.Provider>;
};

export const useCurrentUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useCurrentUser must be used within a UserProvider');
  }
  return context;
};