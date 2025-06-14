
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import Leaderboard from '../components/Leaderboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, TrendingUp, Users } from 'lucide-react';

const Leaderboards = () => {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center justify-center gap-2">
          <Trophy className="h-8 w-8 text-primary" />
          Global Leaderboards
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Compete with players worldwide and climb the rankings in different game modes and difficulties.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5" />
              Global Players
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">10,247</div>
            <p className="text-xs text-muted-foreground">Active this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5" />
              Games Played
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156,892</div>
            <p className="text-xs text-muted-foreground">Total games completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Trophy className="h-5 w-5" />
              Top Player
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">ChessMaster</div>
            <p className="text-xs text-muted-foreground">247 wins this month</p>
          </CardContent>
        </Card>
      </div>

      <Leaderboard />

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>How Rankings Work</CardTitle>
          <CardDescription>
            Understanding the leaderboard system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-semibold mb-2">Scoring System</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Win = +1 point on respective leaderboard</li>
                <li>• Rankings updated in real-time</li>
                <li>• Separate boards for each mode/difficulty</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Categories</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Classic Mode (Easy, Medium, Hard)</li>
                <li>• Speed Mode (Easy, Medium, Hard)</li>
                <li>• Math Master Mode (Easy, Medium, Hard)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Leaderboards;
