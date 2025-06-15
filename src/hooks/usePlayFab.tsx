
import { useState, useCallback } from 'react';
import { useAuth } from '@clerk/clerk-react';

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
            const token = await getToken();
            if (!token) {
                throw new Error("Clerk token not available. User might not be logged in.");
            }

            const response = await fetch('/api/auth/playfab-login', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const responseData = await response.json();
            if (!response.ok) {
                throw new Error(responseData.error || 'Failed to connect to PlayFab');
            }

            const { sessionTicket, playFabId } = responseData;

            setPlayFabData({
                isLoggedIn: true,
                connectionStatus: 'connected',
                error: null,
                sessionTicket,
                playFabId,
            });
            return { success: true };

        } catch (error: any) {
            console.error('Failed to login to PlayFab:', error);
            setPlayFabData({
                isLoggedIn: false,
                connectionStatus: 'error',
                error: error.message || 'An unknown error occurred.',
                sessionTicket: null,
                playFabId: null,
            });
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    }, [getToken]);
    
    // The other functions are still placeholders. They will need to be implemented 
    // in a similar fashion, calling backend APIs instead of PlayFab directly.
    const emptyFunc = useCallback((name: string) => {
        console.warn(`PlayFab function '${name}' is not yet implemented in the backend orchestrator.`);
        return Promise.resolve(null);
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
    };
};
