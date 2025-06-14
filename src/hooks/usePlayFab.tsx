
import { useState, useEffect, useCallback } from 'react';
import { useAuth as useClerkAuth, useUser } from '@clerk/clerk-react';
import { useAuth as useSupabaseAuth } from '@/contexts/AuthContext';
import { PlayFabService } from '@/services/playfab';
import { toast } from 'sonner';

interface PlayFabData {
  playFabId?: string;
  isLoggedIn: boolean;
  connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'error';
  playerStats?: any;
  leaderboards?: any;
  error?: string;
}

export const usePlayFab = () => {
  const [playFabData, setPlayFabData] = useState<PlayFabData>({
    isLoggedIn: false,
    connectionStatus: 'disconnected'
  });
  const [loading, setLoading] = useState(false);
  
  const { isSignedIn } = useClerkAuth();
  const { user: clerkUser } = useUser();
  const { user: supabaseUser } = useSupabaseAuth();
  
  const user = clerkUser || supabaseUser;

  // Initialize PlayFab login when user is authenticated
  useEffect(() => {
    if (user && !playFabData.isLoggedIn && playFabData.connectionStatus === 'disconnected') {
      loginToPlayFab();
    }
  }, [user, playFabData.isLoggedIn, playFabData.connectionStatus]);

  const loginToPlayFab = useCallback(async () => {
    if (!user) {
      console.log('No user available for PlayFab login');
      return;
    }

    try {
      setLoading(true);
      setPlayFabData(prev => ({ ...prev, connectionStatus: 'connecting', error: undefined }));
      
      console.log('Starting PlayFab login for user:', user.id);
      const customId = user.id;
      
      const result = await PlayFabService.loginWithCustomId(customId, true);
      
      setPlayFabData(prev => ({
        ...prev,
        isLoggedIn: true,
        connectionStatus: 'connected',
        playFabId: (result as any)?.data?.PlayFabId,
        error: undefined
      }));

      // Update display name if available
      try {
        const displayName = clerkUser?.firstName || 
                          clerkUser?.username || 
                          supabaseUser?.email?.split('@')[0] || 
                          'Player';
        await PlayFabService.updateDisplayName(displayName);
        console.log('PlayFab display name updated:', displayName);
      } catch (nameError) {
        console.warn('Failed to update display name:', nameError);
        // Don't fail the entire login for display name issues
      }
      
      console.log('PlayFab login completed successfully');
      toast.success('Connected to game services');
    } catch (error) {
      console.error('PlayFab login failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      setPlayFabData(prev => ({
        ...prev,
        isLoggedIn: false,
        connectionStatus: 'error',
        error: errorMessage
      }));
      
      toast.error(`Failed to connect to game services: ${errorMessage}`);
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
    moveCount?: number;
    gameStatus?: string;
  }) => {
    if (!playFabData.isLoggedIn) {
      console.warn('Cannot submit game result: PlayFab not connected');
      return;
    }

    try {
      console.log('Submitting game result:', gameData);
      
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
        moveCount: gameData.moveCount,
        gameStatus: gameData.gameStatus,
        timestamp: new Date().toISOString()
      });

      console.log('Game result submitted successfully');
      toast.success('Game result saved');
    } catch (error) {
      console.error('Failed to submit game result:', error);
      toast.error('Failed to save game result');
    }
  }, [playFabData.isLoggedIn]);

  const getLeaderboard = useCallback(async (leaderboardName: string) => {
    if (!playFabData.isLoggedIn) {
      console.warn('Cannot fetch leaderboard: PlayFab not connected');
      return null;
    }

    try {
      console.log('Fetching leaderboard:', leaderboardName);
      const result = await PlayFabService.getLeaderboard(leaderboardName, 50);
      return result;
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
      toast.error('Failed to load leaderboard');
      return null;
    }
  }, [playFabData.isLoggedIn]);

  const trackMathChallenge = useCallback(async (challengeData: {
    difficulty: string;
    correct: boolean;
    timeSpent: number;
    problemType: string;
  }) => {
    if (!playFabData.isLoggedIn) {
      console.warn('Cannot track math challenge: PlayFab not connected');
      return;
    }

    try {
      await PlayFabService.sendEvent('MathChallenge', {
        ...challengeData,
        timestamp: new Date().toISOString()
      });
      console.log('Math challenge tracked');
    } catch (error) {
      console.error('Failed to track math challenge:', error);
    }
  }, [playFabData.isLoggedIn]);

  const retryConnection = useCallback(() => {
    if (user) {
      setPlayFabData(prev => ({ ...prev, connectionStatus: 'disconnected', error: undefined }));
      loginToPlayFab();
    }
  }, [user, loginToPlayFab]);

  return {
    playFabData,
    loading,
    loginToPlayFab,
    submitGameResult,
    getLeaderboard,
    trackMathChallenge,
    retryConnection
  };
};
