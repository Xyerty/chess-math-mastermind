
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@clerk/clerk-react';

export type Achievement = {
  id: string;
  name: string;
  description: string;
  icon_asset_name: string;
  difficulty: "Common" | "Rare" | "Epic" | "Legendary";
  points: number;
  unlocked_at: string | null;
};

const fetchAchievements = async (userId: string | undefined): Promise<Achievement[]> => {
  if (!userId) {
    // Return an empty array or basic achievement list if no user is logged in
    const { data: publicAchievements, error } = await supabase
      .from('achievements')
      .select('*');
    if (error) {
      console.error('Error fetching public achievements:', error);
      return [];
    }
    return publicAchievements.map(ach => ({
      ...ach,
      difficulty: ach.difficulty as Achievement['difficulty'],
      unlocked_at: null,
    }));
  }

  // For logged-in users, fetch all achievements and their unlocked status
  const { data: achievements, error: achievementsError } = await supabase
    .from('achievements')
    .select('*');

  if (achievementsError) {
    console.error('Error fetching achievements:', achievementsError);
    throw achievementsError;
  }

  const { data: userAchievements, error: userAchievementsError } = await supabase
    .from('user_achievements')
    .select('achievement_id, unlocked_at')
    .eq('user_id', userId);

  if (userAchievementsError) {
    console.error('Error fetching user achievements:', userAchievementsError);
    throw userAchievementsError;
  }
  
  const unlockedAchievementMap = new Map(
    userAchievements.map(ua => [ua.achievement_id, ua.unlocked_at])
  );

  const combinedAchievements: Achievement[] = achievements.map(ach => ({
    ...ach,
    difficulty: ach.difficulty as Achievement['difficulty'],
    unlocked_at: unlockedAchievementMap.get(ach.id) || null,
  }));

  // Sort by unlocked status and then difficulty
  combinedAchievements.sort((a, b) => {
    if (a.unlocked_at && !b.unlocked_at) return -1;
    if (!a.unlocked_at && b.unlocked_at) return 1;
    const difficultyOrder = { 'Legendary': 0, 'Epic': 1, 'Rare': 2, 'Common': 3 };
    return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
  });

  return combinedAchievements;
};

export const useAchievements = () => {
  const { user } = useUser();
  
  return useQuery<Achievement[]>({
    queryKey: ['achievements', user?.id],
    queryFn: () => fetchAchievements(user?.id),
    enabled: !!user,
  });
};
