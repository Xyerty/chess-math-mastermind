/*
  # Enhanced Game History and Analytics

  1. New Tables
    - `game_moves` - Track individual moves within games for replay and analysis
    - `game_sessions_enhanced` - Enhanced game session tracking with detailed metadata
    - `user_preferences` - Store user-specific game preferences and settings
    - `daily_challenges` - Daily chess puzzles and challenges
    - `tournament_events` - Tournament system for competitive play

  2. Enhancements
    - Add indexes for better query performance
    - Add triggers for automatic statistics updates
    - Enhanced RLS policies for better security

  3. Analytics
    - Move pattern analysis
    - Opening repertoire tracking
    - Performance trends over time
*/

-- Enhanced game moves tracking for replay and analysis
CREATE TABLE IF NOT EXISTS game_moves (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_session_id uuid NOT NULL REFERENCES game_sessions(id) ON DELETE CASCADE,
  move_number integer NOT NULL,
  player_color text NOT NULL CHECK (player_color IN ('white', 'black')),
  from_square text NOT NULL,
  to_square text NOT NULL,
  piece_type text NOT NULL,
  captured_piece text,
  is_check boolean DEFAULT false,
  is_checkmate boolean DEFAULT false,
  move_notation text NOT NULL,
  time_taken_ms integer,
  evaluation_score numeric(8,2),
  created_at timestamptz DEFAULT now()
);

-- User preferences for personalized experience
CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  board_theme text DEFAULT 'classic',
  piece_set text DEFAULT 'standard',
  auto_queen_promotion boolean DEFAULT true,
  show_legal_moves boolean DEFAULT true,
  show_coordinates boolean DEFAULT true,
  sound_enabled boolean DEFAULT true,
  animation_speed text DEFAULT 'normal' CHECK (animation_speed IN ('slow', 'normal', 'fast')),
  preferred_time_control text DEFAULT 'blitz',
  notification_preferences jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Daily challenges system
CREATE TABLE IF NOT EXISTS daily_challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_date date NOT NULL UNIQUE,
  puzzle_fen text NOT NULL,
  solution_moves text[] NOT NULL,
  difficulty achievement_difficulty NOT NULL,
  points_reward integer NOT NULL DEFAULT 10,
  description text,
  created_at timestamptz DEFAULT now()
);

-- User challenge completions
CREATE TABLE IF NOT EXISTS user_challenge_completions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  challenge_id uuid NOT NULL REFERENCES daily_challenges(id) ON DELETE CASCADE,
  completed_at timestamptz DEFAULT now(),
  moves_used text[],
  time_taken_seconds integer,
  hints_used integer DEFAULT 0,
  UNIQUE(user_id, challenge_id)
);

-- Tournament system
CREATE TABLE IF NOT EXISTS tournament_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  tournament_type text NOT NULL CHECK (tournament_type IN ('swiss', 'knockout', 'round_robin')),
  max_participants integer,
  entry_fee integer DEFAULT 0,
  prize_pool integer DEFAULT 0,
  time_control text NOT NULL,
  start_date timestamptz NOT NULL,
  end_date timestamptz,
  status text DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'completed', 'cancelled')),
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tournament participants
CREATE TABLE IF NOT EXISTS tournament_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id uuid NOT NULL REFERENCES tournament_events(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  joined_at timestamptz DEFAULT now(),
  current_score numeric(4,1) DEFAULT 0,
  games_played integer DEFAULT 0,
  is_active boolean DEFAULT true,
  UNIQUE(tournament_id, user_id)
);

-- Opening repertoire tracking
CREATE TABLE IF NOT EXISTS opening_repertoire (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  opening_name text NOT NULL,
  eco_code text, -- Encyclopedia of Chess Openings code
  moves_sequence text[] NOT NULL,
  color text NOT NULL CHECK (color IN ('white', 'black', 'both')),
  games_played integer DEFAULT 0,
  wins integer DEFAULT 0,
  draws integer DEFAULT 0,
  losses integer DEFAULT 0,
  last_played timestamptz,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Performance analytics
CREATE TABLE IF NOT EXISTS performance_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  analysis_date date NOT NULL,
  games_played integer DEFAULT 0,
  avg_accuracy numeric(5,2) DEFAULT 0,
  avg_move_time numeric(8,2) DEFAULT 0,
  blunders_count integer DEFAULT 0,
  mistakes_count integer DEFAULT 0,
  excellent_moves_count integer DEFAULT 0,
  elo_change integer DEFAULT 0,
  time_control_stats jsonb DEFAULT '{}',
  opening_performance jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, analysis_date)
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_game_moves_session_id ON game_moves(game_session_id);
CREATE INDEX IF NOT EXISTS idx_game_moves_player_color ON game_moves(player_color);
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_challenges_date ON daily_challenges(challenge_date);
CREATE INDEX IF NOT EXISTS idx_user_challenge_completions_user_id ON user_challenge_completions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_challenge_completions_challenge_id ON user_challenge_completions(challenge_id);
CREATE INDEX IF NOT EXISTS idx_tournament_participants_tournament_id ON tournament_participants(tournament_id);
CREATE INDEX IF NOT EXISTS idx_tournament_participants_user_id ON tournament_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_opening_repertoire_user_id ON opening_repertoire(user_id);
CREATE INDEX IF NOT EXISTS idx_performance_analytics_user_id ON performance_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_performance_analytics_date ON performance_analytics(analysis_date);

-- Enable RLS on all new tables
ALTER TABLE game_moves ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_challenge_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE opening_repertoire ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for game_moves
CREATE POLICY "Users can view moves from their games"
  ON game_moves
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM game_session_players gsp
      WHERE gsp.game_session_id = game_moves.game_session_id
      AND gsp.user_id = auth.uid()
    )
  );

-- RLS Policies for user_preferences
CREATE POLICY "Users can manage their own preferences"
  ON user_preferences
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for daily_challenges
CREATE POLICY "Daily challenges are public"
  ON daily_challenges
  FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for user_challenge_completions
CREATE POLICY "Users can manage their own challenge completions"
  ON user_challenge_completions
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for tournament_events
CREATE POLICY "Tournament events are public for viewing"
  ON tournament_events
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create tournaments"
  ON tournament_events
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Tournament creators can update their tournaments"
  ON tournament_events
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by);

-- RLS Policies for tournament_participants
CREATE POLICY "Users can view tournament participants"
  ON tournament_participants
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can join tournaments"
  ON tournament_participants
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their tournament participation"
  ON tournament_participants
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for opening_repertoire
CREATE POLICY "Users can manage their own opening repertoire"
  ON opening_repertoire
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for performance_analytics
CREATE POLICY "Users can view their own performance analytics"
  ON performance_analytics
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Add triggers for updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_preferences_updated_at
    BEFORE UPDATE ON user_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tournament_events_updated_at
    BEFORE UPDATE ON tournament_events
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_opening_repertoire_updated_at
    BEFORE UPDATE ON opening_repertoire
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();