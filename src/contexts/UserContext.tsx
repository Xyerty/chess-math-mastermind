
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useUserRanking, type UserRanking } from '@/hooks/useUserRanking';
import { type User } from '@clerk/clerk-react';

// This interface combines Clerk's user data with our app-specific ranking data.
export interface CurrentUser extends UserRanking {
  id: string;
  fullName: string | null;
  imageUrl: string;
  primaryEmailAddress: string | null;
  firstName: string | null;
  username: string | null;
}

interface UserContextType {
  currentUser: CurrentUser | null;
  isLoading: boolean;
  error: Error | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoaded: isClerkLoaded, isSignedIn } = useUser();
  const { data: rankingData, isLoading: isRankingLoading, error: rankingError } = useUserRanking();

  const [contextState, setContextState] = useState<UserContextType>({
    currentUser: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    // The context is loading if Clerk hasn't loaded, or if the user is signed in but we're still fetching their ranking.
    const loading = !isClerkLoaded || (isSignedIn && isRankingLoading);
    
    if (loading) {
      setContextState(prev => ({...prev, isLoading: true}));
      return;
    }
    
    if (isSignedIn && user) {
      // New users might not have a ranking record yet. We provide a default.
      const ranking: UserRanking = rankingData ?? { elo: 1200, wins: 0, losses: 0, draws: 0 };
      
      setContextState({
        currentUser: {
          ...ranking,
          id: user.id,
          fullName: user.fullName,
          imageUrl: user.imageUrl,
          primaryEmailAddress: user.primaryEmailAddress?.emailAddress ?? null,
          firstName: user.firstName,
          username: user.username,
        },
        isLoading: false,
        error: rankingError,
      });
    } else {
      // Handles the signed-out state.
      setContextState({
        currentUser: null,
        isLoading: false,
        error: null,
      });
    }
  }, [user, isSignedIn, isClerkLoaded, rankingData, isRankingLoading, rankingError]);
  
  return <UserContext.Provider value={contextState}>{children}</UserContext.Provider>;
};

export const useCurrentUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useCurrentUser must be used within a UserProvider');
  }
  return context;
};
