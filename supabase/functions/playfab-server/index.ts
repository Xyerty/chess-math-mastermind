
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

    console.log('PlayFab server function called:', { action, titleId: titleId?.slice(0, 4) + '***' });

    if (!secretKey || !titleId) {
      console.error('PlayFab credentials not configured');
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
      case 'getLeaderboard':
        result = await getLeaderboard(data, secretKey, titleId);
        break;
      default:
        throw new Error(`Unknown action: ${action}`);
    }

    console.log('PlayFab operation successful:', action);
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
      JSON.stringify({ 
        success: false, 
        error: error.message,
        details: error.toString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    );
  }
});

async function createPlayer(data: any, secretKey: string, titleId: string) {
  const url = `https://${titleId}.playfabapi.com/Server/LoginWithServerCustomId`;
  console.log('Creating player with URL:', url);
  
  const response = await fetch(url, {
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

  const result = await response.json();
  if (!response.ok) {
    console.error('PlayFab createPlayer error:', result);
    throw new Error(`PlayFab API error: ${result.errorMessage || response.statusText}`);
  }
  
  return result;
}

async function updatePlayerData(data: any, secretKey: string, titleId: string) {
  const url = `https://${titleId}.playfabapi.com/Server/UpdateUserData`;
  console.log('Updating player data with URL:', url);
  
  const response = await fetch(url, {
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

  const result = await response.json();
  if (!response.ok) {
    console.error('PlayFab updatePlayerData error:', result);
    throw new Error(`PlayFab API error: ${result.errorMessage || response.statusText}`);
  }
  
  return result;
}

async function getPlayerData(data: any, secretKey: string, titleId: string) {
  const url = `https://${titleId}.playfabapi.com/Server/GetUserData`;
  console.log('Getting player data with URL:', url);
  
  const response = await fetch(url, {
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

  const result = await response.json();
  if (!response.ok) {
    console.error('PlayFab getPlayerData error:', result);
    throw new Error(`PlayFab API error: ${result.errorMessage || response.statusText}`);
  }
  
  return result;
}

async function awardAchievement(data: any, secretKey: string, titleId: string) {
  const url = `https://${titleId}.playfabapi.com/Server/GrantItemsToUser`;
  console.log('Awarding achievement with URL:', url);
  
  const response = await fetch(url, {
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

  const result = await response.json();
  if (!response.ok) {
    console.error('PlayFab awardAchievement error:', result);
    throw new Error(`PlayFab API error: ${result.errorMessage || response.statusText}`);
  }
  
  return result;
}

async function getLeaderboard(data: any, secretKey: string, titleId: string) {
  const url = `https://${titleId}.playfabapi.com/Server/GetLeaderboard`;
  console.log('Getting leaderboard with URL:', url);
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-SecretKey': secretKey
    },
    body: JSON.stringify({
      TitleId: titleId,
      StatisticName: data.statisticName,
      StartPosition: data.startPosition || 0,
      MaxResultsCount: data.maxResults || 10
    })
  });

  const result = await response.json();
  if (!response.ok) {
    console.error('PlayFab getLeaderboard error:', result);
    throw new Error(`PlayFab API error: ${result.errorMessage || response.statusText}`);
  }
  
  return result;
}
