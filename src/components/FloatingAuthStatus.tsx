
import { useMagicAuth } from '@/contexts/MagicAuthContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { LogOut, LogIn, User as UserIcon, Settings, Wallet } from 'lucide-react';
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
  const { user: magicUser, signOut: magicSignOut, loading: magicLoading } = useMagicAuth();
  const { user: supabaseUser, profile, signOut: supabaseSignOut, loading: supabaseLoading } = useAuth();
  const navigate = useNavigate();

  const loading = magicLoading || supabaseLoading;
  const user = magicUser || supabaseUser;
  const displayName = magicUser?.email?.split('@')[0] || profile?.username || supabaseUser?.email?.split('@')[0] || 'User';
  const displayEmail = magicUser?.email || supabaseUser?.email || '';

  const handleSignOut = async () => {
    if (magicUser) {
      await magicSignOut();
    } else {
      await supabaseSignOut();
    }
  };

  const handleProfile = () => {
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
                <AvatarImage src={profile?.avatar_url ?? undefined} alt={displayName} />
                <AvatarFallback className="text-sm">
                  {displayName[0]?.toUpperCase() ?? <UserIcon size={16} />}
                </AvatarFallback>
              </Avatar>
              <span className="font-semibold hidden sm:inline text-sm flex items-center gap-1">
                {magicUser && <Wallet className="h-3 w-3 text-purple-500" />}
                {displayName}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="flex items-center gap-2 p-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={profile?.avatar_url ?? undefined} alt={displayName} />
                <AvatarFallback className="text-sm">
                  {displayName[0]?.toUpperCase() ?? <UserIcon size={16} />}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium flex items-center gap-1">
                  {magicUser && <Wallet className="h-3 w-3 text-purple-500" />}
                  {displayName}
                </span>
                <span className="text-xs text-muted-foreground truncate">
                  {displayEmail}
                </span>
                {magicUser && (
                  <span className="text-xs text-purple-600 dark:text-purple-400">
                    Web3 Enabled
                  </span>
                )}
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
