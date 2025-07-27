
-- Enum for sanction types
CREATE TYPE public.sanction_type AS ENUM ('warning', 'temporary_ban', 'permanent_ban', 'mute');

-- Table for account sanctions
CREATE TABLE public.account_sanctions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  sanction_type public.sanction_type NOT NULL,
  reason TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  issued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  -- Can be null for system-issued sanctions
  issued_by_user_id UUID REFERENCES auth.users(id),
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- RLS for account_sanctions
ALTER TABLE public.account_sanctions ENABLE ROW LEVEL SECURITY;
-- Users can see their own sanctions. Admins/service role will manage them.
CREATE POLICY "Users can view their own sanctions" ON public.account_sanctions
  FOR SELECT USING (auth.uid() = user_id);

-- Table for player rankings (ELO)
CREATE TABLE public.player_rankings (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  elo INTEGER DEFAULT 1200 NOT NULL,
  wins INTEGER DEFAULT 0 NOT NULL,
  losses INTEGER DEFAULT 0 NOT NULL,
  draws INTEGER DEFAULT 0 NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- RLS for player_rankings
ALTER TABLE public.player_rankings ENABLE ROW LEVEL SECURITY;
-- Anyone can view player rankings for leaderboards.
CREATE POLICY "Public can view player rankings" ON public.player_rankings
  FOR SELECT USING (true);

-- Enum for friendship status
CREATE TYPE public.friendship_status AS ENUM ('pending', 'accepted', 'blocked');

-- Table for friendships
CREATE TABLE public.friendships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_one_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  user_two_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status public.friendship_status NOT NULL,
  -- The user who initiated the request or the last status change
  action_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  CONSTRAINT users_are_different CHECK (user_one_id <> user_two_id)
);
-- Index to prevent duplicate friendships like (user_a, user_b) and (user_b, user_a)
CREATE UNIQUE INDEX friendships_unique_users_idx ON public.friendships (least(user_one_id, user_two_id), greatest(user_one_id, user_two_id));

-- RLS for friendships
ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;
-- A user involved in the friendship can perform actions, with logic handled by backend.
CREATE POLICY "Users can manage their own friendships" ON public.friendships
  FOR ALL
  USING (auth.uid() = user_one_id OR auth.uid() = user_two_id)
  WITH CHECK (auth.uid() = action_user_id);

-- Update the new user handler to create a ranking entry
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  
  INSERT INTO public.game_statistics (user_id)
  VALUES (NEW.id);
  
  INSERT INTO public.player_rankings (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers for updated_at timestamps
CREATE TRIGGER update_account_sanctions_updated_at
  BEFORE UPDATE ON public.account_sanctions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_player_rankings_updated_at
  BEFORE UPDATE ON public.player_rankings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_friendships_updated_at
  BEFORE UPDATE ON public.friendships
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
