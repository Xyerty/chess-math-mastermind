
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gamepad2, Clock, Zap } from 'lucide-react';
import { toast } from 'sonner';

export const GuestModeCard = () => {
  const navigate = useNavigate();

  const handleStartAsGuest = () => {
    // Set guest mode flag in localStorage
    localStorage.setItem('guestMode', 'true');
    toast.success('Welcome! Your progress will be saved locally.');
    navigate('/');
  };

  return (
    <Card className="backdrop-blur-xl bg-gradient-to-br from-slate-50/80 to-white/80 dark:from-slate-800/80 dark:to-slate-900/80 border-slate-200/50 dark:border-slate-700/50 shadow-xl shadow-black/5 dark:shadow-black/20 hover:shadow-2xl hover:shadow-black/10 dark:hover:shadow-black/30 transition-all duration-300 hover:scale-[1.02] group">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25 mb-3 group-hover:scale-110 transition-transform duration-200">
          <Zap className="h-7 w-7 text-white" />
        </div>
        <CardTitle className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
          Start Playing Immediately
        </CardTitle>
        <CardDescription className="text-slate-600 dark:text-slate-400">
          Try Mathematical Chess without creating an account
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <Gamepad2 className="h-4 w-4 text-emerald-500" />
            <span>Instant access</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <Clock className="h-4 w-4 text-emerald-500" />
            <span>Progress saved</span>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          className="w-full h-12 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 hover:from-emerald-100 hover:to-teal-100 dark:hover:from-emerald-900/50 dark:hover:to-teal-900/50 font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]" 
          onClick={handleStartAsGuest}
        >
          <Gamepad2 className="mr-2 h-5 w-5" />
          Play as Guest
        </Button>
        <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
          You can save your progress later by creating an account
        </p>
      </CardContent>
    </Card>
  );
};
