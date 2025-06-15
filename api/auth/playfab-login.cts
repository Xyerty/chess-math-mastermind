
// No import statements to ensure pure CommonJS execution.
// Vercel types are inferred or can be handled as 'any' to avoid module conflicts.

// Use CommonJS require for runtime dependencies
const { Clerk } = require('@clerk/clerk-sdk-node');
const { createClient } = require('@supabase/supabase-js');

const clerk = Clerk({ secretKey: process.env.CLERK_SECRET_KEY });
const PLAYFAB_TITLE_ID = process.env.PLAYFAB_TITLE_ID;
const PLAYFAB_SECRET_KEY = process.env.PLAYFAB_SECRET_KEY;

// Initialize Supabase client with the service role key to check sanctions
const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

module.exports = async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    if (!PLAYFAB_TITLE_ID || !PLAYFAB_SECRET_KEY || !process.env.CLERK_SECRET_KEY || !process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
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

        // --- New Sanction Check ---
        const { data: activeSanction, error: sanctionError } = await supabase
            .from('account_sanctions')
            .select('sanction_type, reason, expires_at')
            .eq('user_id', clerkUserId)
            .eq('is_active', true)
            .or('expires_at.is.null,expires_at.gt.now()')
            .maybeSingle();

        if (sanctionError) {
            console.error('Error checking for sanctions:', sanctionError);
            return res.status(500).json({ error: 'Failed to verify account status.' });
        }

        if (activeSanction) {
            let message = 'Your account is currently sanctioned.';
            if (activeSanction.sanction_type === 'permanent_ban') {
                message = 'Your account has been permanently banned.';
            } else if (activeSanction.sanction_type === 'temporary_ban') {
                message = `Your account is temporarily banned. Reason: ${activeSanction.reason || 'Not specified'}. Expires at: ${new Date(activeSanction.expires_at!).toLocaleString()}`;
            }
            return res.status(403).json({ error: 'Access Denied.', message });
        }
        // --- End Sanction Check ---

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
