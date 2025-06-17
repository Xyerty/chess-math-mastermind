/*
  # Advanced Chess Features

  1. New Tables
    - `puzzle_collections` - Chess puzzle collections and themes
    - `user_puzzle_attempts` - Track puzzle solving attempts
    - `game_annotations` - Rich annotations for games
    - `opening_books` - Opening theory and variations
    - `endgame_tablebase` - Endgame position evaluations
    - `chess_variants` - Support for chess variants (King of the Hill, etc.)

  2. Advanced Features
    - Puzzle training system
    - Opening preparation
    - Game analysis with annotations
    - Chess variants support
*/

-- Chess puzzle collections
CREATE TABLE IF NOT EXISTS puzzle_collections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  theme text NOT NULL, -- tactics, endgame, opening, etc.
  difficulty achievement_difficulty NOT NULL,
  total_puzzles integer DEFAULT 0,
  created_by uuid REFERENCES users(id),
  is_official boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Individual chess puzzles
CREATE TABLE IF NOT EXISTS chess_puzzles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id uuid REFERENCES puzzle_collections(id) ON DELETE CASCADE,
  title text,
  fen_position text NOT NULL,
  solution_moves text[] NOT NULL,
  themes text[] DEFAULT '{}', -- pin, fork, skewer, etc.
  difficulty achievement_difficulty NOT NULL,
  rating integer DEFAULT 1200,
  popularity_score integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- User puzzle attempts
CREATE TABLE IF NOT EXISTS user_puzzle_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  puzzle_id uuid NOT NULL REFERENCES chess_puzzles(id) ON DELETE CASCADE,
  is_solved boolean DEFAULT false,
  attempts_count integer DEFAULT 1,
  time_taken_seconds integer,
  moves_played text[],
  hints_used integer DEFAULT 0,
  first_attempt_at timestamptz DEFAULT now(),
  solved_at timestamptz,
  rating_change integer DEFAULT 0
);

-- Game annotations system
CREATE TABLE IF NOT EXISTS game_annotations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_session_id uuid NOT NULL REFERENCES game_sessions(id) ON DELETE CASCADE,
  move_number integer NOT NULL,
  annotation_type text NOT NULL CHECK (annotation_type IN ('comment', 'variation', 'evaluation', 'arrow', 'highlight')),
  content text NOT NULL,
  position_data jsonb, -- For arrows, highlights, etc.
  created_by uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Opening book system
CREATE TABLE IF NOT EXISTS opening_books (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  eco_code text, -- A00-E99
  moves_sequence text[] NOT NULL,
  description text,
  main_line boolean DEFAULT false,
  popularity_score integer DEFAULT 0,
  white_win_rate numeric(5,2),
  black_win_rate numeric(5,2),
  draw_rate numeric(5,2),
  created_at timestamptz DEFAULT now()
);

-- Opening variations
CREATE TABLE IF NOT EXISTS opening_variations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  opening_id uuid NOT NULL REFERENCES opening_books(id) ON DELETE CASCADE,
  variation_name text NOT NULL,
  moves_sequence text[] NOT NULL,
  description text,
  evaluation numeric(4,2), -- Centipawn evaluation
  popularity integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Chess variants support
CREATE TABLE IF NOT EXISTS chess_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  rules_json jsonb NOT NULL, -- Variant-specific rules
  board_size text DEFAULT '8x8',
  piece_setup jsonb, -- Custom piece arrangements
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- User variant preferences
CREATE TABLE IF NOT EXISTS user_variant_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  variant_id uuid NOT NULL REFERENCES chess_variants(id) ON DELETE CASCADE,
  games_played integer DEFAULT 0,
  wins integer DEFAULT 0,
  losses integer DEFAULT 0,
  draws integer DEFAULT 0,
  rating integer DEFAULT 1200,
  last_played timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, variant_id)
);

-- Training sessions
CREATE TABLE IF NOT EXISTS training_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_type text NOT NULL CHECK (session_type IN ('tactics', 'endgame', 'opening', 'mixed')),
  target_rating integer,
  puzzles_attempted integer DEFAULT 0,
  puzzles_solved integer DEFAULT 0,
  total_time_seconds integer DEFAULT 0,
  accuracy_percentage numeric(5,2) DEFAULT 0,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  is_completed boolean DEFAULT false
);

-- Training session puzzles
CREATE TABLE IF NOT EXISTS training_session_puzzles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES training_sessions(id) ON DELETE CASCADE,
  puzzle_id uuid NOT NULL REFERENCES chess_puzzles(id) ON DELETE CASCADE,
  is_solved boolean DEFAULT false,
  time_taken_seconds integer,
  attempts_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_puzzle_collections_theme ON puzzle_collections(theme);
CREATE INDEX IF NOT EXISTS idx_puzzle_collections_difficulty ON puzzle_collections(difficulty);
CREATE INDEX IF NOT EXISTS idx_chess_puzzles_collection_id ON chess_puzzles(collection_id);
CREATE INDEX IF NOT EXISTS idx_chess_puzzles_difficulty ON chess_puzzles(difficulty);
CREATE INDEX IF NOT EXISTS idx_chess_puzzles_rating ON chess_puzzles(rating);
CREATE INDEX IF NOT EXISTS idx_chess_puzzles_themes ON chess_puzzles USING GIN(themes);
CREATE INDEX IF NOT EXISTS idx_user_puzzle_attempts_user_id ON user_puzzle_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_user_puzzle_attempts_puzzle_id ON user_puzzle_attempts(puzzle_id);
CREATE INDEX IF NOT EXISTS idx_user_puzzle_attempts_solved ON user_puzzle_attempts(is_solved);
CREATE INDEX IF NOT EXISTS idx_game_annotations_game_session_id ON game_annotations(game_session_id);
CREATE INDEX IF NOT EXISTS idx_game_annotations_move_number ON game_annotations(move_number);
CREATE INDEX IF NOT EXISTS idx_opening_books_eco_code ON opening_books(eco_code);
CREATE INDEX IF NOT EXISTS idx_opening_variations_opening_id ON opening_variations(opening_id);
CREATE INDEX IF NOT EXISTS idx_user_variant_stats_user_id ON user_variant_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_user_variant_stats_variant_id ON user_variant_stats(variant_id);
CREATE INDEX IF NOT EXISTS idx_training_sessions_user_id ON training_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_training_sessions_type ON training_sessions(session_type);
CREATE INDEX IF NOT EXISTS idx_training_session_puzzles_session_id ON training_session_puzzles(session_id);

-- Enable RLS
ALTER TABLE puzzle_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE chess_puzzles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_puzzle_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_annotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE opening_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE opening_variations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chess_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_variant_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_session_puzzles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for puzzle_collections
CREATE POLICY "Puzzle collections are public"
  ON puzzle_collections
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create puzzle collections"
  ON puzzle_collections
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

-- RLS Policies for chess_puzzles
CREATE POLICY "Chess puzzles are public"
  ON chess_puzzles
  FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for user_puzzle_attempts
CREATE POLICY "Users can manage their own puzzle attempts"
  ON user_puzzle_attempts
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for game_annotations
CREATE POLICY "Users can view annotations for games they participated in"
  ON game_annotations
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM game_session_players gsp
      WHERE gsp.game_session_id = game_annotations.game_session_id
      AND gsp.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create annotations"
  ON game_annotations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own annotations"
  ON game_annotations
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by);

-- RLS Policies for opening_books and variations
CREATE POLICY "Opening books are public"
  ON opening_books
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Opening variations are public"
  ON opening_variations
  FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for chess_variants
CREATE POLICY "Chess variants are public"
  ON chess_variants
  FOR SELECT
  TO authenticated
  USING (is_active = true);

-- RLS Policies for user_variant_stats
CREATE POLICY "Users can manage their own variant stats"
  ON user_variant_stats
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for training_sessions
CREATE POLICY "Users can manage their own training sessions"
  ON training_sessions
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for training_session_puzzles
CREATE POLICY "Users can view puzzles from their training sessions"
  ON training_session_puzzles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM training_sessions ts
      WHERE ts.id = training_session_puzzles.session_id
      AND ts.user_id = auth.uid()
    )
  );

-- Add triggers for updated_at
CREATE TRIGGER update_puzzle_collections_updated_at
    BEFORE UPDATE ON puzzle_collections
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_game_annotations_updated_at
    BEFORE UPDATE ON game_annotations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_variant_stats_updated_at
    BEFORE UPDATE ON user_variant_stats
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();