
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gamepad2, Clock } from 'lucide-react';
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
    <Card className="mt-6 border-dashed">
      <CardHeader className="text-center pb-3">
        <div className="mx-auto w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-2">
          <Gamepad2 className="h-6 w-6 text-secondary-foreground" />
        </div>
        <CardTitle className="text-lg">Start Playing Immediately</CardTitle>
        <CardDescription>
          Try Mathematical Chess without creating an account
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <Button 
          variant="outline" 
          className="w-full h-12" 
          onClick={handleStartAsGuest}
        >
          <Clock className="mr-2 h-4 w-4" />
          Play as Guest
        </Button>
        <p className="text-xs text-muted-foreground text-center mt-2">
          You can save your progress later by creating an account
        </p>
      </CardContent>
    </Card>
  );
};
