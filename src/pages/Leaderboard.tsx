
import { useLeaderboardData } from '@/hooks/useLeaderboardData';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Crown } from 'lucide-react';

const LeaderboardPage = () => {
  const { data: leaderboard, isLoading, error } = useLeaderboardData();

  const getRankColor = (rank: number) => {
    if (rank === 0) return 'text-yellow-400';
    if (rank === 1) return 'text-gray-400';
    if (rank === 2) return 'text-yellow-600';
    return 'text-muted-foreground';
  };

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Leaderboard</h1>
        <p className="text-muted-foreground mt-2">Top 100 players ranked by Elo rating.</p>
      </div>
      
      {isLoading && (
        <div className="space-y-2 max-w-4xl mx-auto">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      )}

      {error && (
        <div className="text-center text-destructive bg-destructive/10 p-4 rounded-lg max-w-4xl mx-auto">
          <p className="font-semibold">Failed to load leaderboard. Please try again later.</p>
          <p className="text-sm mt-1">{error.message}</p>
        </div>
      )}

      {leaderboard && (
        <div className="border rounded-lg max-w-4xl mx-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px] text-center">Rank</TableHead>
                <TableHead>Player</TableHead>
                <TableHead className="text-right">Elo</TableHead>
                <TableHead className="text-right hidden sm:table-cell">Wins</TableHead>
                <TableHead className="text-right hidden sm:table-cell">Losses</TableHead>
                <TableHead className="text-right hidden sm:table-cell">Draws</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaderboard.map((player, index) => (
                <TableRow key={player.user_id}>
                  <TableCell className="font-medium text-center">
                    <span className={`flex items-center justify-center font-bold text-lg ${getRankColor(index)}`}>
                       {index < 3 ? <Crown className="w-5 h-5 mr-1" /> : null}
                       {index + 1}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={player.avatar_url ?? undefined} />
                        <AvatarFallback>{player.username?.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{player.username}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-bold text-primary">{player.elo}</TableCell>
                  <TableCell className="text-right text-green-500 hidden sm:table-cell">{player.wins}</TableCell>
                  <TableCell className="text-right text-red-500 hidden sm:table-cell">{player.losses}</TableCell>
                  <TableCell className="text-right hidden sm:table-cell">{player.draws}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default LeaderboardPage;
