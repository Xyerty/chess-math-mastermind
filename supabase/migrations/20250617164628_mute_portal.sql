/*
  # Social Features and Community

  1. New Tables
    - `user_follows` - Follow system for players
    - `game_comments` - Comments on completed games
    - `study_groups` - Chess study groups and clubs
    - `shared_analyses` - Share game analyses with the community
    - `coaching_sessions` - Coaching and mentorship system

  2. Features
    - Social interactions
    - Community building
    - Knowledge sharing
    - Coaching system
*/

-- User follow system
CREATE TABLE IF NOT EXISTS user_follows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  following_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- Game comments and discussions
CREATE TABLE IF NOT EXISTS game_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_session_id uuid NOT NULL REFERENCES game_sessions(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  parent_comment_id uuid REFERENCES game_comments(id) ON DELETE CASCADE,
  content text NOT NULL,
  move_number integer, -- Comment on specific move
  likes_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Study groups and chess clubs
CREATE TABLE IF NOT EXISTS study_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  is_private boolean DEFAULT false,
  max_members integer DEFAULT 50,
  created_by uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Study group memberships
CREATE TABLE IF NOT EXISTS study_group_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES study_groups(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role text DEFAULT 'member' CHECK (role IN ('admin', 'moderator', 'member')),
  joined_at timestamptz DEFAULT now(),
  UNIQUE(group_id, user_id)
);

-- Shared game analyses
CREATE TABLE IF NOT EXISTS shared_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_session_id uuid NOT NULL REFERENCES game_sessions(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  analysis_data jsonb NOT NULL, -- Detailed analysis with variations
  is_public boolean DEFAULT true,
  likes_count integer DEFAULT 0,
  views_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Coaching sessions
CREATE TABLE IF NOT EXISTS coaching_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  scheduled_at timestamptz NOT NULL,
  duration_minutes integer DEFAULT 60,
  status text DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  session_notes text,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Coach profiles
CREATE TABLE IF NOT EXISTS coach_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  bio text,
  hourly_rate numeric(8,2),
  specializations text[],
  languages text[],
  is_verified boolean DEFAULT false,
  rating_average numeric(3,2) DEFAULT 0,
  total_sessions integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Comment likes
CREATE TABLE IF NOT EXISTS comment_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id uuid NOT NULL REFERENCES game_comments(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(comment_id, user_id)
);

-- Analysis likes
CREATE TABLE IF NOT EXISTS analysis_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id uuid NOT NULL REFERENCES shared_analyses(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(analysis_id, user_id)
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_user_follows_follower_id ON user_follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_user_follows_following_id ON user_follows(following_id);
CREATE INDEX IF NOT EXISTS idx_game_comments_game_session_id ON game_comments(game_session_id);
CREATE INDEX IF NOT EXISTS idx_game_comments_user_id ON game_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_game_comments_parent_id ON game_comments(parent_comment_id);
CREATE INDEX IF NOT EXISTS idx_study_group_members_group_id ON study_group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_study_group_members_user_id ON study_group_members(user_id);
CREATE INDEX IF NOT EXISTS idx_shared_analyses_user_id ON shared_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_shared_analyses_public ON shared_analyses(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_coaching_sessions_coach_id ON coaching_sessions(coach_id);
CREATE INDEX IF NOT EXISTS idx_coaching_sessions_student_id ON coaching_sessions(student_id);
CREATE INDEX IF NOT EXISTS idx_coach_profiles_user_id ON coach_profiles(user_id);

-- Enable RLS
ALTER TABLE user_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE coaching_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_likes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_follows
CREATE POLICY "Users can view follows"
  ON user_follows
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage their own follows"
  ON user_follows
  FOR ALL
  TO authenticated
  USING (auth.uid() = follower_id)
  WITH CHECK (auth.uid() = follower_id);

-- RLS Policies for game_comments
CREATE POLICY "Users can view public game comments"
  ON game_comments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM game_sessions gs
      WHERE gs.id = game_comments.game_session_id
      AND gs.status = 'completed'
    )
  );

CREATE POLICY "Users can create comments"
  ON game_comments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
  ON game_comments
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for study_groups
CREATE POLICY "Users can view public study groups"
  ON study_groups
  FOR SELECT
  TO authenticated
  USING (NOT is_private OR EXISTS (
    SELECT 1 FROM study_group_members sgm
    WHERE sgm.group_id = study_groups.id
    AND sgm.user_id = auth.uid()
  ));

CREATE POLICY "Users can create study groups"
  ON study_groups
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

-- RLS Policies for study_group_members
CREATE POLICY "Users can view group members"
  ON study_group_members
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can join groups"
  ON study_group_members
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for shared_analyses
CREATE POLICY "Users can view public analyses"
  ON shared_analyses
  FOR SELECT
  TO authenticated
  USING (is_public OR auth.uid() = user_id);

CREATE POLICY "Users can create analyses"
  ON shared_analyses
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own analyses"
  ON shared_analyses
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for coaching_sessions
CREATE POLICY "Users can view their coaching sessions"
  ON coaching_sessions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = coach_id OR auth.uid() = student_id);

CREATE POLICY "Coaches can create sessions"
  ON coaching_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = coach_id);

CREATE POLICY "Participants can update sessions"
  ON coaching_sessions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = coach_id OR auth.uid() = student_id);

-- RLS Policies for coach_profiles
CREATE POLICY "Coach profiles are public"
  ON coach_profiles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage their own coach profile"
  ON coach_profiles
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for likes
CREATE POLICY "Users can view likes"
  ON comment_likes
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage their own comment likes"
  ON comment_likes
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view analysis likes"
  ON analysis_likes
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage their own analysis likes"
  ON analysis_likes
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Add triggers for updated_at
CREATE TRIGGER update_game_comments_updated_at
    BEFORE UPDATE ON game_comments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_study_groups_updated_at
    BEFORE UPDATE ON study_groups
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shared_analyses_updated_at
    BEFORE UPDATE ON shared_analyses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_coaching_sessions_updated_at
    BEFORE UPDATE ON coaching_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_coach_profiles_updated_at
    BEFORE UPDATE ON coach_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();