
import { useState, useEffect, useCallback } from 'react';
import { useAuth as useClerkAuth, useUser } from '@clerk/clerk-react';
import { useAuth as useSupabaseAuth } from '@/contexts/AuthContext';
import { PlayFabService } from '@/services/playfab';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PlayFabData {
  playFabId?: string;
  isLoggedIn: boolean;
  playerStats?: any;
  leaderboards?: any;
}

export const usePlayFab = () => {
  const [playFabData, setPlayFabData] = useState<PlayFabData>({
    isLoggedIn: false
  });
  const [loading, setLoading] = useState(false);
  
  const { isSignedIn } = useClerkAuth();
  const { user: clerkUser } = useUser();
  const { user: supabaseUser } = useSupabaseAuth();
  
  const user = clerkUser || supabaseUser;

  // Initialize PlayFab login when user is authenticated
  useEffect(() => {
    if (user && !playFabData.isLoggedIn) {
      loginToPlayFab();
    }
  }, [user, playFabData.isLoggedIn]);

  const loginToPlayFab = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const customId = user.id;
      
      const result = await PlayFabService.loginWithCustomId(customId, true);
      
      setPlayFabData(prev => ({
        ...prev,
        isLoggedIn: true,
        playFabId: (result as any)?.data?.PlayFabId
      }));

      // Update display name if available
      const displayName = clerkUser?.firstName || supabaseUser?.email?.split('@')[0] || 'Player';
      await PlayFabService.updateDisplayName(displayName);
      
      console.log('PlayFab login successful');
    } catch (error) {
      console.error('PlayFab login failed:', error);
      toast.error('Failed to connect to game services');
    } finally {
      setLoading(false);
    }
  }, [user, clerkUser, supabaseUser]);

  const submitGameResult = useCallback(async (gameData: {
    won: boolean;
    gameMode: string;
    difficulty: string;
    timeSpent: number;
    mathAccuracy?: number;
  }) => {
    if (!playFabData.isLoggedIn) return;

    try {
      // Submit to leaderboards
      const leaderboardName = `${gameData.gameMode}_${gameData.difficulty}_wins`;
      if (gameData.won) {
        await PlayFabService.submitScore(leaderboardName, 1);
      }

      // Send game event for analytics
      await PlayFabService.sendEvent('GameCompleted', {
        won: gameData.won,
        gameMode: gameData.gameMode,
        difficulty: gameData.difficulty,
        timeSpent: gameData.timeSpent,
        mathAccuracy: gameData.mathAccuracy,
        timestamp: new Date().toISOString()
      });

      console.log('Game result submitted to PlayFab');
    } catch (error) {
      console.error('Failed to submit game result:', error);
    }
  }, [playFabData.isLoggedIn]);

  const getLeaderboard = useCallback(async (leaderboardName: string) => {
    if (!playFabData.isLoggedIn) return null;

    try {
      const result = await PlayFabService.getLeaderboard(leaderboardName, 50);
      return result;
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
      return null;
    }
  }, [playFabData.isLoggedIn]);

  const trackMathChallenge = useCallback(async (challengeData: {
    difficulty: string;
    correct: boolean;
    timeSpent: number;
    problemType: string;
  }) => {
    if (!playFabData.isLoggedIn) return;

    try {
      await PlayFabService.sendEvent('MathChallenge', {
        ...challengeData,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to track math challenge:', error);
    }
  }, [playFabData.isLoggedIn]);

  return {
    playFabData,
    loading,
    loginToPlayFab,
    submitGameResult,
    getLeaderboard,
    trackMathChallenge
  };
};
