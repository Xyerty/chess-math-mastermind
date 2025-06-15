
import React from 'react';
import { useUser } from '@clerk/clerk-react';
import { Card, CardContent } from '@/components/ui/card';
import { User, TrendingUp, Clock } from 'lucide-react';

const WelcomeSection = () => {
  const { user } = useUser();

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const displayName = user?.firstName || user?.username || 'Player';

  return (
    <Card className="border-l-4 border-primary bg-accent/50">
      <CardContent className="p-6">
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center ring-4 ring-primary/20 shrink-0">
            <User className="h-7 w-7 text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              {getTimeOfDay()}, <span className="text-primary">{displayName}</span>!
            </h2>
            <p className="text-muted-foreground mt-1">Ready for your next chess challenge?</p>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary/80" />
              <span>Level up your game</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary/80" />
              <span>Quick games available</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WelcomeSection;
