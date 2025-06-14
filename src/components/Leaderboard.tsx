
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Trophy, Medal, Award, Crown, AlertCircle, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { usePlayFabContext } from '@/contexts/PlayFabContext';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Leaderboard = () => {
  const [selectedLeaderboard, setSelectedLeaderboard] = useState('classic_medium_wins');
  const [leaderboardData, setLeaderboardData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { getLeaderboard, playFabData, retryConnection } = usePlayFabContext();

  const leaderboards = [
    { id: 'classic_medium_wins', name: 'Classic Medium Wins' },
    { id: 'classic_hard_wins', name: 'Classic Hard Wins' },
    { id: 'speed_medium_wins', name: 'Speed Medium Wins' },
    { id: 'speed_hard_wins', name: 'Speed Hard Wins' },
    { id: 'math_master_medium_wins', name: 'Math Master Medium Wins' },
    { id: 'math_master_hard_wins', name: 'Math Master Hard Wins' }
  ];

  useEffect(() => {
    if (playFabData.isLoggedIn) {
      fetchLeaderboard();
    }
  }, [selectedLeaderboard, playFabData.isLoggedIn]);

  const fetchLeaderboard = async () => {
    if (!getLeaderboard || !playFabData.isLoggedIn) return;
    
    setLoading(true);
    try {
      const result = await getLeaderboard(selectedLeaderboard);
      setLeaderboardData(result);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
      setLeaderboardData(null);
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

  const renderConnectionStatus = () => {
    switch (playFabData.connectionStatus) {
      case 'connecting':
        return (
          <Alert>
            <Wifi className="h-4 w-4" />
            <AlertDescription>
              Connecting to game services...
            </AlertDescription>
          </Alert>
        );
      case 'error':
        return (
          <Alert variant="destructive">
            <WifiOff className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>Failed to connect to game services: {playFabData.error}</span>
              <Button variant="outline" size="sm" onClick={retryConnection}>
                <RefreshCw className="h-4 w-4 mr-1" />
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        );
      case 'disconnected':
        return (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Game services not connected. Please wait...
            </AlertDescription>
          </Alert>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-6 w-6 text-primary" />
          Leaderboards
        </CardTitle>
        
        {renderConnectionStatus()}
        
        <Select 
          value={selectedLeaderboard} 
          onValueChange={setSelectedLeaderboard}
          disabled={!playFabData.isLoggedIn}
        >
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
        {!playFabData.isLoggedIn ? (
          <div className="text-center text-muted-foreground py-8">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p>Game services connection required to view leaderboards.</p>
          </div>
        ) : loading ? (
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
            <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p>No leaderboard data available yet.</p>
            <p className="text-sm">Start playing to see rankings!</p>
            {playFabData.isLoggedIn && (
              <Button variant="outline" onClick={fetchLeaderboard} className="mt-4">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Leaderboard;
