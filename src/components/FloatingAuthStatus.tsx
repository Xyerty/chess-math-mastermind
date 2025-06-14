
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { LogOut, LogIn, User as UserIcon, Settings } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from './ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const FloatingAuthStatus = () => {
  const { user, profile, signOut, loading } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
  };

  const handleProfile = () => {
    // Navigate to profile/settings when implemented
    navigate('/settings');
  };

  if (loading) {
    return (
       <div className="fixed top-4 right-4 z-50">
        <Skeleton className="h-12 w-48" />
      </div>
    )
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2 bg-card p-2 rounded-lg shadow-lg border hover:bg-accent">
              <Avatar className="h-8 w-8">
                <AvatarImage src={profile?.avatar_url ?? undefined} alt={profile?.username ?? 'User'} />
                <AvatarFallback className="text-sm">
                  {profile?.username?.[0]?.toUpperCase() ?? <UserIcon size={16} />}
                </AvatarFallback>
              </Avatar>
              <span className="font-semibold hidden sm:inline text-sm">
                {profile?.username ?? user.email?.split('@')[0] ?? 'User'}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="flex items-center gap-2 p-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={profile?.avatar_url ?? undefined} alt={profile?.username ?? 'User'} />
                <AvatarFallback className="text-sm">
                  {profile?.username?.[0]?.toUpperCase() ?? <UserIcon size={16} />}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">
                  {profile?.username ?? user.email?.split('@')[0] ?? 'User'}
                </span>
                <span className="text-xs text-muted-foreground truncate">
                  {user.email}
                </span>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleProfile} className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600 dark:text-red-400">
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button onClick={() => navigate('/auth')} className="shadow-lg">
          <LogIn className="mr-2 h-4 w-4" />
          Login / Sign Up
        </Button>
      )}
    </div>
  );
};

export default FloatingAuthStatus;
