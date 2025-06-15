
-- Create ENUM types to standardize statuses and modes across the application.
CREATE TYPE public.game_mode AS ENUM ('classic', 'speed', 'math-master', 'ranked', 'royale');
CREATE TYPE public.game_session_status AS ENUM ('pending', 'in_progress', 'completed', 'aborted');
CREATE TYPE public.matchmaking_status AS ENUM ('searching', 'matched', 'cancelled', 'expired');

-- Table to store game sessions for multiplayer modes.
CREATE TABLE public.game_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_mode public.game_mode NOT NULL,
    status public.game_session_status NOT NULL DEFAULT 'pending',
    game_state JSONB,
    winner_user_id UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.game_sessions IS 'Stores active and completed game sessions for multiplayer modes.';

-- Table to link players to game sessions and track Elo changes.
CREATE TABLE public.game_session_players (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_session_id UUID NOT NULL REFERENCES public.game_sessions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    player_color TEXT, -- 'white', 'black', or null for other modes
    elo_before INT,
    elo_after INT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (game_session_id, user_id)
);
COMMENT ON TABLE public.game_session_players IS 'Tracks players within a game session, including Elo changes for ranked games.';

-- Table to manage user tickets in matchmaking queues.
CREATE TABLE public.matchmaking_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    game_mode public.game_mode NOT NULL,
    status public.matchmaking_status NOT NULL DEFAULT 'searching',
    elo INT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    game_session_id UUID REFERENCES public.game_sessions(id)
);
COMMENT ON TABLE public.matchmaking_tickets IS 'Manages user tickets for matchmaking queues.';

-- Triggers to automatically update the `updated_at` timestamp on modification.
CREATE TRIGGER handle_game_sessions_updated_at BEFORE UPDATE ON public.game_sessions
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

CREATE TRIGGER handle_matchmaking_tickets_updated_at BEFORE UPDATE ON public.matchmaking_tickets
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

-- Add Row-Level Security (RLS) to protect multiplayer data.
-- Game Sessions: Only players involved can view the session. All modifications must be server-side.
ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Players can view their own game sessions" ON public.game_sessions
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM public.game_session_players
        WHERE game_session_id = id AND user_id = auth.uid()
    ));
CREATE POLICY "Deny all client-side modifications on game_sessions" ON public.game_sessions
    FOR ALL USING (false) WITH CHECK (false);

-- Game Session Players: Players can see all participants of games they are in. All modifications must be server-side.
ALTER TABLE public.game_session_players ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Players can view participants of their own games" ON public.game_session_players
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM public.game_session_players as p
        WHERE p.game_session_id = game_session_players.game_session_id AND p.user_id = auth.uid()
    ));
CREATE POLICY "Deny all client-side modifications for session players" ON public.game_session_players
    FOR ALL USING (false) WITH CHECK (false);

-- Matchmaking Tickets: Users can view and cancel their own ticket. Creation and updates are server-side.
ALTER TABLE public.matchmaking_tickets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own ticket" ON public.matchmaking_tickets
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can cancel their own ticket" ON public.matchmaking_tickets
    FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Deny client-side inserts on tickets" ON public.matchmaking_tickets
    FOR INSERT WITH CHECK (false);
CREATE POLICY "Deny client-side updates on tickets" ON public.matchmaking_tickets
    FOR UPDATE USING (false);

-- Function to calculate Elo rating changes.
CREATE OR REPLACE FUNCTION public.calculate_elo_change(player_rating INT, opponent_rating INT, score REAL)
RETURNS INT AS $$
DECLARE
    k_factor INT := 32;
    expected_score REAL;
    new_rating INT;
BEGIN
    expected_score := 1.0 / (1.0 + pow(10, (opponent_rating - player_rating) / 400.0));
    new_rating := round(player_rating + k_factor * (score - expected_score));
    RETURN new_rating;
END;
$$ LANGUAGE plpgsql IMMUTABLE;
COMMENT ON FUNCTION public.calculate_elo_change(INT, INT, REAL) IS 'Calculates the new Elo rating for a player based on a match result. Score: 1 for win, 0.5 for draw, 0 for loss.';
