
import { useClerk } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { LogIn, Settings, Award, LogOut, Trophy, UserX } from 'lucide-react';
import { Skeleton } from './ui/skeleton';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "@/components/ui/sonner";
import { useCurrentUser } from '@/contexts/UserContext';
import { CLERK_ENABLED } from '@/config/clerk';

const FloatingAuthStatus = () => {
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { currentUser, isLoading } = useCurrentUser();
  
  // If authentication is disabled, show a disabled state
  if (!CLERK_ENABLED) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <Button 
          variant="outline" 
          disabled 
          className="shadow-lg h-12 px-6 opacity-50"
        >
          <UserX className="mr-2 h-5 w-5" />
          Auth Disabled
        </Button>
      </div>
    );
  }
  
  if (isLoading) {
    return (
       <div className="fixed top-4 right-4 z-50">
        <Skeleton className="h-12 w-12 rounded-full" />
      </div>
    )
  }
  
  const handleSignOut = () => {
    signOut({ redirectUrl: '/auth' });
  };
  
  const userInitials = currentUser ? `${currentUser.firstName?.charAt(0) ?? ''}${currentUser.fullName?.split(' ')?.[1]?.charAt(0) ?? ''}` : '';

  return (
    <div className="fixed top-4 right-4 z-50">
      {currentUser ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
             <button
              className={`
                focus:outline-none rounded-full
                shadow-xl border-2 border-primary/10 hover:border-primary/30
                p-0.5 bg-background
                transition-all duration-300
                hover:scale-105 active:scale-95
              `}
            >
              <Avatar className="h-11 w-11">
                <AvatarImage src={currentUser.imageUrl} alt={currentUser.fullName ?? 'User avatar'} />
                <AvatarFallback>{userInitials}</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 mt-2 border border-border shadow-2xl rounded-xl" align="end">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1 p-1">
                <p className="text-sm font-medium leading-none">{currentUser.fullName}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {currentUser.primaryEmailAddress}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-default focus:bg-transparent py-2">
              <Trophy className="mr-2 h-4 w-4 text-yellow-500" />
              <span>Elo: <span className="font-bold">{currentUser.elo ?? 'N/A'}</span></span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer py-2" onClick={() => navigate('/settings')}>
              <Settings className="mr-2 h-4 w-4" />
              <span>{t('mainMenu.settings')}</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer py-2" onClick={() => toast.info('The achievements feature is coming soon!')}>
              <Award className="mr-2 h-4 w-4" />
              <span>Achievements</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer py-2 text-destructive focus:text-destructive-foreground focus:bg-destructive" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button onClick={() => navigate('/auth')} className="shadow-lg h-12 px-6">
          <LogIn className="mr-2 h-5 w-5" />
          {t('auth.loginSignUp')}
        </Button>
      )}
    </div>
  );
};

export default FloatingAuthStatus;
