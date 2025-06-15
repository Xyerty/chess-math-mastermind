
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSupabaseClient } from './useSupabase';
import { useAuth } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import type { Tables } from '@/integrations/supabase/types';
import { toast } from 'sonner';

export const useMatchmakingTicket = () => {
    const supabase = useSupabaseClient();
    const { userId, isLoaded } = useAuth();
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ['matchmakingTicket', userId],
        queryFn: async () => {
            if (!userId) return null;
            const { data, error } = await supabase
                .from('matchmaking_tickets')
                .select('*')
                .eq('user_id', userId)
                .maybeSingle();
            
            if (error) {
                console.error("Error fetching matchmaking ticket", error);
                toast.error("Could not fetch matchmaking status.");
                throw error;
            }
            return data;
        },
        enabled: !!userId && isLoaded,
    });

    useEffect(() => {
        if (!userId) return;

        const channel = supabase.channel(`matchmaking-ticket-${userId}`);

        const handleTicketUpdate = (payload: RealtimePostgresChangesPayload<Tables<'matchmaking_tickets'>>) => {
            const updatedTicket = payload.new as Tables<'matchmaking_tickets'>;
            if (updatedTicket?.user_id === userId) {
                queryClient.setQueryData(['matchmakingTicket', userId], updatedTicket);
            }
        };

        const handleTicketDelete = () => {
            queryClient.setQueryData(['matchmakingTicket', userId], null);
        };

        channel
            .on<Tables<'matchmaking_tickets'>>(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'matchmaking_tickets', filter: `user_id=eq.${userId}` },
                (payload) => {
                    if (payload.eventType === 'DELETE') {
                        handleTicketDelete();
                    } else {
                        handleTicketUpdate(payload);
                    }
                }
            )
            .subscribe((status, err) => {
                if (status === 'SUBSCRIBED') {
                    console.log('Subscribed to matchmaking ticket updates');
                }
                if (err) {
                    console.error('Realtime subscription error:', err);
                    toast.error("Realtime connection failed.");
                }
            });

        return () => {
            supabase.removeChannel(channel);
        };
    }, [userId, supabase, queryClient]);

    return query;
}
