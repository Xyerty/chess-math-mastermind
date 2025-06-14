
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, data } = await req.json();
    const secretKey = Deno.env.get('PLAYFAB_SECRET_KEY');
    const titleId = Deno.env.get('PLAYFAB_TITLE_ID');

    if (!secretKey || !titleId) {
      throw new Error('PlayFab credentials not configured');
    }

    let result;

    switch (action) {
      case 'createPlayer':
        result = await createPlayer(data, secretKey, titleId);
        break;
      case 'updatePlayerData':
        result = await updatePlayerData(data, secretKey, titleId);
        break;
      case 'getPlayerData':
        result = await getPlayerData(data, secretKey, titleId);
        break;
      case 'awardAchievement':
        result = await awardAchievement(data, secretKey, titleId);
        break;
      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return new Response(
      JSON.stringify({ success: true, data: result }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('PlayFab server error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    );
  }
});

async function createPlayer(data: any, secretKey: string, titleId: string) {
  const response = await fetch('https://titleId.playfabapi.com/Server/LoginWithServerCustomId', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-SecretKey': secretKey
    },
    body: JSON.stringify({
      TitleId: titleId,
      ServerCustomId: data.customId,
      CreateAccount: true,
      PlayerSecret: data.playerSecret
    })
  });

  return await response.json();
}

async function updatePlayerData(data: any, secretKey: string, titleId: string) {
  const response = await fetch('https://titleId.playfabapi.com/Server/UpdateUserData', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-SecretKey': secretKey
    },
    body: JSON.stringify({
      TitleId: titleId,
      PlayFabId: data.playFabId,
      Data: data.userData
    })
  });

  return await response.json();
}

async function getPlayerData(data: any, secretKey: string, titleId: string) {
  const response = await fetch('https://titleId.playfabapi.com/Server/GetUserData', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-SecretKey': secretKey
    },
    body: JSON.stringify({
      TitleId: titleId,
      PlayFabId: data.playFabId
    })
  });

  return await response.json();
}

async function awardAchievement(data: any, secretKey: string, titleId: string) {
  const response = await fetch('https://titleId.playfabapi.com/Server/GrantItemsToUser', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-SecretKey': secretKey
    },
    body: JSON.stringify({
      TitleId: titleId,
      PlayFabId: data.playFabId,
      ItemGrants: [{
        ItemId: data.achievementId,
        Quantity: 1
      }]
    })
  });

  return await response.json();
}
