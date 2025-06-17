/*
  # Seed Initial Data

  1. Sample Data
    - Chess variants
    - Basic achievements
    - Opening book entries
    - Sample puzzle collections
    - Daily challenges

  2. Configuration
    - Default user preferences
    - System settings
*/

-- Insert chess variants
INSERT INTO chess_variants (name, description, rules_json, board_size) VALUES
('Standard Chess', 'Traditional chess with standard rules', '{"castling": true, "enPassant": true, "promotion": true}', '8x8'),
('King of the Hill', 'Win by getting your king to the center', '{"winCondition": "kingToCenter", "centerSquares": ["d4", "d5", "e4", "e5"]}', '8x8'),
('Three-Check', 'Win by giving check three times', '{"winCondition": "threeChecks", "maxChecks": 3}', '8x8'),
('Atomic Chess', 'Captures cause explosions', '{"explosions": true, "kingCapture": false}', '8x8')
ON CONFLICT (name) DO NOTHING;

-- Insert sample achievements
INSERT INTO achievements (name, description, icon_asset_name, difficulty, points) VALUES
('First Victory', 'Win your first game', 'Trophy', 'Common', 10),
('Math Novice', 'Solve 10 math problems correctly', 'Calculator', 'Common', 15),
('Quick Thinker', 'Solve a math problem in under 5 seconds', 'Timer', 'Rare', 25),
('Winning Streak', 'Win 5 games in a row', 'Flame', 'Rare', 30),
('Math Master', 'Achieve 90% accuracy in math problems', 'Target', 'Epic', 50),
('Speed Demon', 'Win a speed chess game in under 2 minutes', 'Rocket', 'Epic', 60),
('Grandmaster', 'Reach 2000 ELO rating', 'Crown', 'Legendary', 100),
('Perfect Game', 'Win a game with 100% math accuracy', 'Star', 'Legendary', 150),
('Dedicated Player', 'Play 100 games', 'Medal', 'Rare', 40),
('Puzzle Solver', 'Complete 50 chess puzzles', 'BrainCircuit', 'Epic', 75)
ON CONFLICT (name) DO NOTHING;

-- Insert sample opening book entries
INSERT INTO opening_books (name, eco_code, moves_sequence, description, main_line, white_win_rate, black_win_rate, draw_rate) VALUES
('Italian Game', 'C50', ARRAY['e2e4', 'e7e5', 'g1f3', 'b8c6', 'f1c4'], 'Classical opening focusing on quick development', true, 35.2, 28.1, 36.7),
('Ruy Lopez', 'C60', ARRAY['e2e4', 'e7e5', 'g1f3', 'b8c6', 'f1b5'], 'One of the oldest and most classical openings', true, 37.8, 26.4, 35.8),
('Queen''s Gambit', 'D06', ARRAY['d2d4', 'd7d5', 'c2c4'], 'Popular opening offering a pawn to gain center control', true, 38.1, 25.9, 36.0),
('Sicilian Defense', 'B20', ARRAY['e2e4', 'c7c5'], 'Sharp, tactical opening popular at all levels', true, 33.7, 31.2, 35.1),
('French Defense', 'C00', ARRAY['e2e4', 'e7e6'], 'Solid defensive setup for Black', true, 36.8, 27.3, 35.9),
('Caro-Kann Defense', 'B10', ARRAY['e2e4', 'c7c6'], 'Reliable defense leading to solid positions', true, 35.9, 28.7, 35.4)
ON CONFLICT (eco_code) DO NOTHING;

-- Insert opening variations
INSERT INTO opening_variations (opening_id, variation_name, moves_sequence, description, evaluation) 
SELECT 
  ob.id,
  'Main Line',
  ob.moves_sequence || ARRAY['d7d6', 'h2h3'],
  'Standard continuation',
  0.3
FROM opening_books ob WHERE ob.name = 'Italian Game'
ON CONFLICT DO NOTHING;

-- Insert sample puzzle collections
INSERT INTO puzzle_collections (name, description, theme, difficulty, total_puzzles, is_official) VALUES
('Basic Tactics', 'Fundamental tactical patterns for beginners', 'tactics', 'Common', 50, true),
('Intermediate Combinations', 'More complex tactical sequences', 'tactics', 'Rare', 75, true),
('Endgame Essentials', 'Critical endgame positions to master', 'endgame', 'Rare', 40, true),
('Advanced Tactics', 'Complex tactical puzzles for strong players', 'tactics', 'Epic', 60, true),
('Opening Traps', 'Common traps in popular openings', 'opening', 'Common', 30, true),
('Checkmate Patterns', 'Essential mating patterns', 'checkmate', 'Common', 25, true)
ON CONFLICT (name) DO NOTHING;

-- Insert sample chess puzzles
INSERT INTO chess_puzzles (collection_id, title, fen_position, solution_moves, themes, difficulty, rating)
SELECT 
  pc.id,
  'Fork the King and Queen',
  'rnbqkb1r/pppp1ppp/5n2/4p3/2B1P3/8/PPPP1PPP/RNBQK1NR w KQkq - 2 3',
  ARRAY['d1h5', 'g6h5'],
  ARRAY['fork', 'tactics'],
  'Common',
  1200
FROM puzzle_collections pc WHERE pc.name = 'Basic Tactics'
UNION ALL
SELECT 
  pc.id,
  'Back Rank Mate',
  '6k1/5ppp/8/8/8/8/5PPP/4R1K1 w - - 0 1',
  ARRAY['e1e8'],
  ARRAY['back-rank', 'checkmate'],
  'Common',
  1100
FROM puzzle_collections pc WHERE pc.name = 'Checkmate Patterns'
ON CONFLICT DO NOTHING;

-- Update puzzle collection totals
UPDATE puzzle_collections SET total_puzzles = (
  SELECT COUNT(*) FROM chess_puzzles WHERE collection_id = puzzle_collections.id
);

-- Generate today's daily challenge
SELECT generate_daily_challenge(CURRENT_DATE);

-- Insert default user preferences template (will be copied for new users)
-- This is handled by application logic when users sign up