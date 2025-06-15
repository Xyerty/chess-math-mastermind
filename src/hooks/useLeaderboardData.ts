
import { useQuery } from '@tanstack/react-query';
import { useSupabaseClient } from './useSupabase';
import { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

export interface LeaderboardEntry {
  user_id: string;
  elo: number;
  wins: number;
  losses: number;
  draws: number;
  username: string | null;
  avatar_url: string | null;
}

const fetchLeaderboardWithProfiles = async (supabase: SupabaseClient<Database>): Promise<LeaderboardEntry[]> => {
  // RLS on `player_rankings` allows public reads.
  const { data: rankings, error: rankingsError } = await supabase
    .from('player_rankings')
    .select('user_id, elo, wins, losses, draws')
    .order('elo', { ascending: false })
    .limit(100);

  if (rankingsError) {
    console.error("Error fetching leaderboard rankings:", rankingsError);
    throw new Error(rankingsError.message);
  }

  // Due to RLS, we can't just join profiles. We fetch them separately.
  // This will only return profiles the current user is allowed to see (which is just their own).
  // A server-side RPC function is needed for a fully populated leaderboard.
  // As a workaround, we will try to fetch all profiles, and Supabase will only return the ones allowed by RLS.
  const userIds = rankings.map(r => r.user_id);
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id, username, avatar_url')
    .in('id', userIds);
    
  if (profilesError) {
    console.warn("Could not fetch all profiles for leaderboard:", profilesError.message);
  }

  const profilesMap = new Map(profiles?.map(p => [p.id, p]));

  return rankings.map(r => ({
    ...r,
    username: profilesMap.get(r.user_id)?.username ?? `Player ${r.user_id.substring(0, 6)}`,
    avatar_url: profilesMap.get(r.user_id)?.avatar_url ?? null,
  }));
};

export const useLeaderboardData = () => {
  const supabase = useSupabaseClient();
  return useQuery({
    queryKey: ['leaderboard'],
    queryFn: () => fetchLeaderboardWithProfiles(supabase),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
