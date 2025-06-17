/*
  # Utility Functions and Procedures

  1. Functions
    - Calculate user rating changes
    - Generate daily challenges
    - Update statistics automatically
    - Matchmaking improvements
    - Performance analytics

  2. Triggers
    - Auto-update statistics after games
    - Rating calculations
    - Achievement unlocking
*/

-- Function to calculate Elo rating change (enhanced version)
CREATE OR REPLACE FUNCTION calculate_elo_change_enhanced(
  player_rating integer,
  opponent_rating integer,
  score numeric, -- 1 for win, 0.5 for draw, 0 for loss
  k_factor integer DEFAULT 32
) RETURNS integer AS $$
DECLARE
  expected_score numeric;
  rating_change integer;
BEGIN
  -- Calculate expected score using Elo formula
  expected_score := 1.0 / (1.0 + power(10.0, (opponent_rating - player_rating) / 400.0));
  
  -- Calculate rating change
  rating_change := round(k_factor * (score - expected_score));
  
  RETURN rating_change;
END;
$$ LANGUAGE plpgsql;

-- Function to update user statistics after a game
CREATE OR REPLACE FUNCTION update_user_game_statistics(
  p_user_id uuid,
  p_game_result text, -- 'win', 'loss', 'draw'
  p_math_problems_total integer DEFAULT 0,
  p_math_problems_correct integer DEFAULT 0,
  p_avg_solve_time numeric DEFAULT NULL
) RETURNS void AS $$
DECLARE
  current_stats record;
  new_total_games integer;
  new_wins integer;
  new_losses integer;
  new_draws integer;
  new_win_rate numeric;
  new_math_accuracy numeric;
  new_total_math_problems integer;
  new_correct_math_problems integer;
BEGIN
  -- Get current statistics
  SELECT * INTO current_stats
  FROM game_statistics
  WHERE user_id = p_user_id;
  
  -- If no stats exist, create initial record
  IF current_stats IS NULL THEN
    INSERT INTO game_statistics (
      user_id, total_games, wins, losses, draws, win_rate,
      total_math_problems, correct_math_problems, math_accuracy,
      avg_solve_time_s, best_solve_time_s
    ) VALUES (
      p_user_id, 0, 0, 0, 0, 0.0,
      0, 0, 0.0,
      NULL, NULL
    );
    
    SELECT * INTO current_stats
    FROM game_statistics
    WHERE user_id = p_user_id;
  END IF;
  
  -- Calculate new values
  new_total_games := current_stats.total_games + 1;
  new_wins := current_stats.wins + CASE WHEN p_game_result = 'win' THEN 1 ELSE 0 END;
  new_losses := current_stats.losses + CASE WHEN p_game_result = 'loss' THEN 1 ELSE 0 END;
  new_draws := current_stats.draws + CASE WHEN p_game_result = 'draw' THEN 1 ELSE 0 END;
  new_win_rate := CASE WHEN new_total_games > 0 THEN (new_wins::numeric / new_total_games) * 100 ELSE 0 END;
  
  new_total_math_problems := current_stats.total_math_problems + p_math_problems_total;
  new_correct_math_problems := current_stats.correct_math_problems + p_math_problems_correct;
  new_math_accuracy := CASE WHEN new_total_math_problems > 0 THEN (new_correct_math_problems::numeric / new_total_math_problems) * 100 ELSE 0 END;
  
  -- Update statistics
  UPDATE game_statistics SET
    total_games = new_total_games,
    wins = new_wins,
    losses = new_losses,
    draws = new_draws,
    win_rate = new_win_rate,
    total_math_problems = new_total_math_problems,
    correct_math_problems = new_correct_math_problems,
    math_accuracy = new_math_accuracy,
    avg_solve_time_s = CASE 
      WHEN p_avg_solve_time IS NOT NULL THEN 
        CASE 
          WHEN current_stats.avg_solve_time_s IS NULL THEN p_avg_solve_time
          ELSE (current_stats.avg_solve_time_s + p_avg_solve_time) / 2
        END
      ELSE current_stats.avg_solve_time_s
    END,
    best_solve_time_s = CASE
      WHEN p_avg_solve_time IS NOT NULL THEN
        CASE
          WHEN current_stats.best_solve_time_s IS NULL OR p_avg_solve_time < current_stats.best_solve_time_s THEN p_avg_solve_time
          ELSE current_stats.best_solve_time_s
        END
      ELSE current_stats.best_solve_time_s
    END,
    updated_at = now()
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- Function to generate daily challenge
CREATE OR REPLACE FUNCTION generate_daily_challenge(
  challenge_date date DEFAULT CURRENT_DATE
) RETURNS uuid AS $$
DECLARE
  new_challenge_id uuid;
  puzzle_record record;
BEGIN
  -- Check if challenge already exists for this date
  SELECT id INTO new_challenge_id
  FROM daily_challenges
  WHERE daily_challenges.challenge_date = generate_daily_challenge.challenge_date;
  
  IF new_challenge_id IS NOT NULL THEN
    RETURN new_challenge_id;
  END IF;
  
  -- Select a random puzzle for the challenge
  SELECT * INTO puzzle_record
  FROM chess_puzzles
  WHERE difficulty = (
    CASE 
      WHEN EXTRACT(DOW FROM challenge_date) IN (0, 6) THEN 'Common'::achievement_difficulty -- Weekends easier
      WHEN EXTRACT(DOW FROM challenge_date) IN (1, 5) THEN 'Rare'::achievement_difficulty -- Monday/Friday medium
      ELSE 'Epic'::achievement_difficulty -- Weekdays harder
    END
  )
  ORDER BY random()
  LIMIT 1;
  
  -- Create the daily challenge
  INSERT INTO daily_challenges (
    challenge_date,
    puzzle_fen,
    solution_moves,
    difficulty,
    points_reward,
    description
  ) VALUES (
    challenge_date,
    puzzle_record.fen_position,
    puzzle_record.solution_moves,
    puzzle_record.difficulty,
    CASE puzzle_record.difficulty
      WHEN 'Common' THEN 10
      WHEN 'Rare' THEN 25
      WHEN 'Epic' THEN 50
      WHEN 'Legendary' THEN 100
    END,
    puzzle_record.title
  ) RETURNING id INTO new_challenge_id;
  
  RETURN new_challenge_id;
END;
$$ LANGUAGE plpgsql;

-- Function to check and unlock achievements
CREATE OR REPLACE FUNCTION check_and_unlock_achievements(p_user_id uuid) RETURNS void AS $$
DECLARE
  user_stats record;
  achievement_record record;
BEGIN
  -- Get user statistics
  SELECT * INTO user_stats
  FROM game_statistics
  WHERE user_id = p_user_id;
  
  IF user_stats IS NULL THEN
    RETURN;
  END IF;
  
  -- Check for various achievements
  FOR achievement_record IN 
    SELECT * FROM achievements 
    WHERE id NOT IN (
      SELECT achievement_id FROM user_achievements WHERE user_id = p_user_id
    )
  LOOP
    -- First Win achievement
    IF achievement_record.name = 'First Victory' AND user_stats.wins >= 1 THEN
      INSERT INTO user_achievements (user_id, achievement_id) 
      VALUES (p_user_id, achievement_record.id);
    END IF;
    
    -- Win Streak achievements
    IF achievement_record.name = 'Winning Streak' AND user_stats.wins >= 5 THEN
      INSERT INTO user_achievements (user_id, achievement_id) 
      VALUES (p_user_id, achievement_record.id);
    END IF;
    
    -- Math Master achievements
    IF achievement_record.name = 'Math Master' AND user_stats.math_accuracy >= 90 AND user_stats.total_math_problems >= 50 THEN
      INSERT INTO user_achievements (user_id, achievement_id) 
      VALUES (p_user_id, achievement_record.id);
    END IF;
    
    -- Game Count achievements
    IF achievement_record.name = 'Dedicated Player' AND user_stats.total_games >= 100 THEN
      INSERT INTO user_achievements (user_id, achievement_id) 
      VALUES (p_user_id, achievement_record.id);
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Enhanced matchmaking function
CREATE OR REPLACE FUNCTION find_match_for_player(
  p_user_id uuid,
  p_elo integer,
  p_game_mode game_mode DEFAULT 'ranked'
) RETURNS TABLE(
  ticket_id uuid,
  game_session_id uuid,
  opponent_id uuid
) AS $$
DECLARE
  opponent_ticket record;
  new_game_session_id uuid;
  elo_range integer := 100; -- Initial ELO range
  max_elo_range integer := 300; -- Maximum ELO range
BEGIN
  -- Look for an opponent within ELO range
  WHILE elo_range <= max_elo_range LOOP
    SELECT * INTO opponent_ticket
    FROM matchmaking_tickets mt
    WHERE mt.user_id != p_user_id
      AND mt.game_mode = p_game_mode
      AND mt.status = 'searching'
      AND ABS(mt.elo - p_elo) <= elo_range
      AND mt.created_at < (now() - interval '5 seconds') -- Avoid immediate matching
    ORDER BY ABS(mt.elo - p_elo), mt.created_at
    LIMIT 1;
    
    EXIT WHEN opponent_ticket IS NOT NULL;
    
    -- Expand search range
    elo_range := elo_range + 50;
  END LOOP;
  
  IF opponent_ticket IS NOT NULL THEN
    -- Create game session
    INSERT INTO game_sessions (game_mode, status)
    VALUES (p_game_mode, 'pending')
    RETURNING id INTO new_game_session_id;
    
    -- Add both players to the game
    INSERT INTO game_session_players (game_session_id, user_id, player_color, elo_before)
    VALUES 
      (new_game_session_id, p_user_id, 'white', p_elo),
      (new_game_session_id, opponent_ticket.user_id, 'black', opponent_ticket.elo);
    
    -- Update opponent's ticket
    UPDATE matchmaking_tickets 
    SET status = 'matched', game_session_id = new_game_session_id
    WHERE id = opponent_ticket.id;
    
    -- Create ticket for current player
    INSERT INTO matchmaking_tickets (user_id, game_mode, status, elo, game_session_id)
    VALUES (p_user_id, p_game_mode, 'matched', p_elo, new_game_session_id);
    
    RETURN QUERY SELECT opponent_ticket.id, new_game_session_id, opponent_ticket.user_id;
  ELSE
    -- No match found, create searching ticket
    INSERT INTO matchmaking_tickets (user_id, game_mode, status, elo)
    VALUES (p_user_id, p_game_mode, 'searching', p_elo);
    
    RETURN;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to update opening repertoire
CREATE OR REPLACE FUNCTION update_opening_repertoire(
  p_user_id uuid,
  p_moves_sequence text[],
  p_game_result text, -- 'win', 'loss', 'draw'
  p_player_color text -- 'white', 'black'
) RETURNS void AS $$
DECLARE
  opening_name text;
  eco_code text;
  existing_opening record;
BEGIN
  -- Determine opening name and ECO code based on moves
  -- This is a simplified version - in practice, you'd have a comprehensive opening database
  opening_name := 'Unknown Opening';
  eco_code := 'A00';
  
  -- Basic opening detection
  IF array_length(p_moves_sequence, 1) >= 2 THEN
    IF p_moves_sequence[1] = 'e2e4' AND p_moves_sequence[2] = 'e7e5' THEN
      opening_name := 'King''s Pawn Game';
      eco_code := 'C20';
    ELSIF p_moves_sequence[1] = 'd2d4' AND p_moves_sequence[2] = 'd7d5' THEN
      opening_name := 'Queen''s Pawn Game';
      eco_code := 'D00';
    ELSIF p_moves_sequence[1] = 'g1f3' THEN
      opening_name := 'Réti Opening';
      eco_code := 'A04';
    END IF;
  END IF;
  
  -- Check if opening already exists for user
  SELECT * INTO existing_opening
  FROM opening_repertoire
  WHERE user_id = p_user_id 
    AND opening_name = update_opening_repertoire.opening_name
    AND (color = p_player_color OR color = 'both');
  
  IF existing_opening IS NOT NULL THEN
    -- Update existing opening
    UPDATE opening_repertoire SET
      games_played = games_played + 1,
      wins = wins + CASE WHEN p_game_result = 'win' THEN 1 ELSE 0 END,
      draws = draws + CASE WHEN p_game_result = 'draw' THEN 1 ELSE 0 END,
      losses = losses + CASE WHEN p_game_result = 'loss' THEN 1 ELSE 0 END,
      last_played = now(),
      updated_at = now()
    WHERE id = existing_opening.id;
  ELSE
    -- Create new opening entry
    INSERT INTO opening_repertoire (
      user_id, opening_name, eco_code, moves_sequence, color,
      games_played, wins, draws, losses, last_played
    ) VALUES (
      p_user_id, opening_name, eco_code, p_moves_sequence, p_player_color,
      1,
      CASE WHEN p_game_result = 'win' THEN 1 ELSE 0 END,
      CASE WHEN p_game_result = 'draw' THEN 1 ELSE 0 END,
      CASE WHEN p_game_result = 'loss' THEN 1 ELSE 0 END,
      now()
    );
  END IF;
END;
$$ LANGUAGE plpgsql;