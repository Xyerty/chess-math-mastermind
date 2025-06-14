
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { LogOut, LogIn, User as UserIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from './ui/skeleton';

const FloatingAuthStatus = () => {
  const { user, profile, signOut, loading } = useAuth();
  const navigate = useNavigate();

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
        <div className="flex items-center gap-2 bg-card p-2 rounded-lg shadow-lg border">
          <Avatar>
            <AvatarImage src={profile?.avatar_url ?? undefined} alt={profile?.username ?? 'User'} />
            <AvatarFallback>{profile?.username?.[0].toUpperCase() ?? <UserIcon size={20} />}</AvatarFallback>
          </Avatar>
          <span className="font-semibold hidden sm:inline">{profile?.username ?? 'User'}</span>
          <Button variant="ghost" size="icon" onClick={signOut} aria-label="Sign out">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      ) : (
        <Button onClick={() => navigate('/auth')}>
          <LogIn className="mr-2 h-5 w-5" />
          Login / Sign Up
        </Button>
      )}
    </div>
  );
};

export default FloatingAuthStatus;
