
import { useAuth, useUser, UserButton } from '@clerk/clerk-react';
import { useAuth as useSupabaseAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { LogIn, User as UserIcon, Settings } from 'lucide-react';
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
  const { isSignedIn, isLoaded } = useAuth();
  const { user: clerkUser } = useUser();
  const { user: supabaseUser, profile, signOut: supabaseSignOut, loading: supabaseLoading } = useSupabaseAuth();
  const navigate = useNavigate();

  const loading = !isLoaded || supabaseLoading;
  const user = clerkUser || supabaseUser;
  const displayName = clerkUser?.firstName || clerkUser?.username || profile?.username || supabaseUser?.email?.split('@')[0] || 'User';
  const displayEmail = clerkUser?.primaryEmailAddress?.emailAddress || supabaseUser?.email || '';

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
      {(isSignedIn || supabaseUser) ? (
        <>
          {clerkUser ? (
            // Use Clerk's UserButton for Clerk users
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "h-10 w-10",
                  userButtonTrigger: "shadow-lg border hover:bg-accent rounded-lg p-2"
                }
              }}
              showName={true}
              afterSignOutUrl="/auth"
            />
          ) : (
            // Fallback for Supabase users
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 bg-card p-2 rounded-lg shadow-lg border hover:bg-accent">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={profile?.avatar_url ?? undefined} alt={displayName} />
                    <AvatarFallback className="text-sm">
                      {displayName[0]?.toUpperCase() ?? <UserIcon size={16} />}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-semibold hidden sm:inline text-sm">
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
                    <span className="text-sm font-medium">{displayName}</span>
                    <span className="text-xs text-muted-foreground truncate">
                      {displayEmail}
                    </span>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleProfile} className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={supabaseSignOut} className="cursor-pointer text-red-600 dark:text-red-400">
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </>
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
