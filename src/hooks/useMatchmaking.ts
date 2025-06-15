
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSupabaseClient } from './useSupabase';
import { useAuth } from '@clerk/clerk-react';
import { toast } from 'sonner';

export const useMatchmaking = () => {
  const supabase = useSupabaseClient();
  const { userId } = useAuth();
  const queryClient = useQueryClient();

  const findMatch = useMutation({
    mutationFn: async (gameMode: 'ranked') => {
      if (!userId) throw new Error("User not authenticated.");

      const { data, error } = await supabase.functions.invoke('find-match', {
        body: { gameMode },
      });

      if (error) {
        toast.error(error.message || `Failed to start matchmaking: ${error.details || ''}`);
        throw new Error(error.message);
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matchmakingTicket', userId] });
      toast.info("Searching for a ranked match...");
    },
  });

  const cancelMatch = useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error("User not authenticated.");
      const { error } = await supabase.from('matchmaking_tickets').delete().eq('user_id', userId);
      
      if (error) {
        toast.error("Failed to cancel matchmaking.");
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matchmakingTicket', userId] });
      toast.info("Matchmaking cancelled.");
    }
  });

  return { findMatch, cancelMatch };
}
