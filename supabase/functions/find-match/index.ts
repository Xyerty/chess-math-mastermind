
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: req.headers.get("Authorization")! } } }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const { gameMode } = await req.json();
    if (gameMode !== 'ranked') {
      return new Response(JSON.stringify({ error: "Invalid game mode" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    
    // 1. Check if user already has a ticket
    const { data: existingTicket } = await supabaseClient.from("matchmaking_tickets").select("id").eq("user_id", user.id).single();
    if (existingTicket) {
      return new Response(JSON.stringify({ error: "You are already in a queue." }), { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // 2. Get user's ELO
    const { data: ranking, error: rankingError } = await supabaseClient.from("player_rankings").select("elo").eq("user_id", user.id).single();
    if (rankingError || !ranking) {
      throw new Error("Could not find player ranking.");
    }

    // 3. Find a match
    const { data: opponentTicket, error: matchError } = await supabaseClient.rpc('find_match_for_player', {
        p_user_id: user.id,
        p_elo: ranking.elo
    });

    if (matchError) {
        throw new Error(`Matchmaking failed: ${matchError.message}`);
    }

    if (opponentTicket) {
        // Match found!
        const { data: gameSession, error: sessionError } = await supabaseClient.from('game_sessions').select('*').eq('id', opponentTicket.game_session_id).single();

        if (sessionError) throw new Error('Failed to retrieve created game session');

        return new Response(JSON.stringify({ status: 'matched', gameSession }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    } else {
        // No match found, ticket was created
        return new Response(JSON.stringify({ status: 'searching' }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
