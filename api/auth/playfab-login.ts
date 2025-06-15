
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Clerk } from '@clerk/clerk-sdk-node';

const clerk = Clerk({ secretKey: process.env.CLERK_SECRET_KEY });
const PLAYFAB_TITLE_ID = process.env.PLAYFAB_TITLE_ID;
const PLAYFAB_SECRET_KEY = process.env.PLAYFAB_SECRET_KEY;

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    if (!PLAYFAB_TITLE_ID || !PLAYFAB_SECRET_KEY || !process.env.CLERK_SECRET_KEY) {
        console.error('One or more required environment variables are not set.');
        return res.status(500).json({ error: 'Server configuration error.' });
    }

    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'No authorization token provided.' });
        }
        
        const token = authHeader.split(' ')[1];
        const claims = await clerk.verifyToken(token);
        
        if (!claims.sub) {
            return res.status(401).json({ error: 'Invalid token, no user ID.' });
        }
        const clerkUserId = claims.sub;

        const playfabResponse = await fetch(`https://${PLAYFAB_TITLE_ID}.playfabapi.com/Client/LoginWithCustomID`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-SecretKey': PLAYFAB_SECRET_KEY,
            },
            body: JSON.stringify({
                CustomId: clerkUserId,
                CreateAccount: true,
                TitleId: PLAYFAB_TITLE_ID,
            }),
        });

        const playfabData = await playfabResponse.json();

        if (!playfabResponse.ok) {
            console.error('PlayFab login failed:', playfabData);
            return res.status(playfabResponse.status).json({ error: 'Failed to login to PlayFab.', details: playfabData });
        }
        
        const sessionTicket = playfabData.data.SessionTicket;
        const playFabId = playfabData.data.PlayFabId;
        
        return res.status(200).json({ sessionTicket, playFabId });

    } catch (error: any) {
        console.error('Error in playfab-login handler:', error);
        if (error.clerkError) {
             return res.status(401).json({ error: 'Authentication failed.', details: error.message });
        }
        return res.status(500).json({ error: 'An unexpected error occurred.', details: error.message });
    }
}
