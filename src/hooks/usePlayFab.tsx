import { useState, useCallback } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { authenticatedFetch } from '../lib/authenticatedFetch';

interface PlayFabData {
    isLoggedIn: boolean;
    connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'error';
    error: string | null;
    sessionTicket: string | null;
    playFabId: string | null;
}

export const usePlayFab = () => {
    const { getToken } = useAuth();
    const [playFabData, setPlayFabData] = useState<PlayFabData>({
        isLoggedIn: false,
        connectionStatus: 'disconnected',
        error: null,
        sessionTicket: null,
        playFabId: null,
    });
    const [loading, setLoading] = useState(false);

    const loginToPlayFab = useCallback(async () => {
        setLoading(true);
        setPlayFabData(prev => ({ ...prev, connectionStatus: 'connecting', error: null }));
        
        try {
            const response = await authenticatedFetch(getToken, '/api/auth/playfab-login', {
                method: 'POST',
            });
            const responseData = await response.json();

            const { sessionTicket, playFabId } = responseData;

            setPlayFabData({
                isLoggedIn: true,
                connectionStatus: 'connected',
                error: null,
                sessionTicket,
                playFabId,
            });
            return { success: true };

        } catch (error: unknown) {
            console.error('Failed to login to PlayFab:', error);
            setPlayFabData({
                isLoggedIn: false,
                connectionStatus: 'error',
                error: error instanceof Error ? error.message : 'An unknown error occurred.',
                sessionTicket: null,
                playFabId: null,
            });
            return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred.' };
        } finally {
            setLoading(false);
        }
    }, [getToken]);
    
    const emptyFunc = useCallback((name: string) => {
        console.warn(`PlayFab function '${name}' is not yet implemented in the backend orchestrator.`);
        return Promise.resolve(null);
    }, []);

    const findMatch = useCallback(async (gameMode: 'ranked' | 'royale') => {
        console.warn(`PlayFab function 'findMatch' for ${gameMode} is not yet implemented.`);
        // In a real implementation, this would call the backend to start matchmaking.
        return { success: true, ticketId: `mock_ticket_${Date.now()}` };
    }, []);

    const cancelMatchmaking = useCallback(async (ticketId: string) => {
        console.warn(`PlayFab function 'cancelMatchmaking' for ticket ${ticketId} is not yet implemented.`);
        return { success: true };
    }, []);

    const retryConnection = useCallback(() => {
       if(playFabData.connectionStatus === 'error') {
         loginToPlayFab();
       }
    }, [loginToPlayFab, playFabData.connectionStatus]);

    return {
        playFabData,
        loading,
        loginToPlayFab,
        submitGameResult: () => emptyFunc('submitGameResult'),
        getLeaderboard: () => emptyFunc('getLeaderboard'),
        trackMathChallenge: () => emptyFunc('trackMathChallenge'),
        retryConnection,
        findMatch,
        cancelMatchmaking,
    };
};
