
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trophy, Medal, Award, Crown } from 'lucide-react';
import { usePlayFabContext } from '@/contexts/PlayFabContext';
import { Skeleton } from '@/components/ui/skeleton';

const Leaderboard = () => {
  const [selectedLeaderboard, setSelectedLeaderboard] = useState('classic_medium_wins');
  const [leaderboardData, setLeaderboardData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { getLeaderboard } = usePlayFabContext();

  const leaderboards = [
    { id: 'classic_medium_wins', name: 'Classic Medium Wins' },
    { id: 'classic_hard_wins', name: 'Classic Hard Wins' },
    { id: 'speed_medium_wins', name: 'Speed Medium Wins' },
    { id: 'speed_hard_wins', name: 'Speed Hard Wins' },
    { id: 'math_master_medium_wins', name: 'Math Master Medium Wins' },
    { id: 'math_master_hard_wins', name: 'Math Master Hard Wins' }
  ];

  useEffect(() => {
    fetchLeaderboard();
  }, [selectedLeaderboard]);

  const fetchLeaderboard = async () => {
    if (!getLeaderboard) return;
    
    setLoading(true);
    try {
      const result = await getLeaderboard(selectedLeaderboard);
      setLeaderboardData(result);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1: return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2: return <Medal className="h-5 w-5 text-gray-400" />;
      case 3: return <Award className="h-5 w-5 text-amber-600" />;
      default: return <Trophy className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-6 w-6 text-primary" />
          Leaderboards
        </CardTitle>
        <Select value={selectedLeaderboard} onValueChange={setSelectedLeaderboard}>
          <SelectTrigger>
            <SelectValue placeholder="Select leaderboard" />
          </SelectTrigger>
          <SelectContent>
            {leaderboards.map((lb) => (
              <SelectItem key={lb.id} value={lb.id}>
                {lb.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        ) : leaderboardData?.data?.Leaderboard ? (
          <div className="space-y-2">
            {leaderboardData.data.Leaderboard.map((entry: any, index: number) => (
              <div 
                key={entry.PlayFabId} 
                className={`flex items-center justify-between p-3 rounded-lg ${
                  index < 3 ? 'bg-gradient-to-r from-primary/10 to-primary/5' : 'bg-muted/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {getRankIcon(entry.Position + 1)}
                    <span className="font-semibold text-sm">#{entry.Position + 1}</span>
                  </div>
                  <span className="font-medium">
                    {entry.DisplayName || `Player ${entry.PlayFabId.slice(-4)}`}
                  </span>
                </div>
                <div className="text-sm font-semibold text-primary">
                  {entry.StatValue} wins
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            No leaderboard data available yet. Start playing to see rankings!
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Leaderboard;
