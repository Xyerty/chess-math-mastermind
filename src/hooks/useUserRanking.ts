
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import { useSupabaseClient } from './useSupabase';

export interface UserRanking {
  elo: number;
  wins: number;
  losses: number;
  draws: number;
}

export const useUserRanking = () => {
  const { userId, isLoaded } = useAuth();
  const supabase = useSupabaseClient();

  const fetchUserRanking = async (id: string): Promise<UserRanking | null> => {
    const { data, error } = await supabase
      .from('player_rankings')
      .select('elo, wins, losses, draws')
      .eq('user_id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') { // No rows found, user might be new or stats not created yet
        return null;
      }
      console.error("Error fetching user ranking:", error);
      throw new Error(error.message);
    }
    return data;
  };

  return useQuery({
    queryKey: ['userRanking', userId],
    queryFn: () => {
      if (!userId) return null;
      return fetchUserRanking(userId)
    },
    enabled: !!userId && isLoaded,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
