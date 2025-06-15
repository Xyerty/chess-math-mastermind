
import { useAuth, UserButton } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

const FloatingAuthStatus = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const navigate = useNavigate();

  if (!isLoaded) {
    return (
       <div className="fixed top-4 right-4 z-50">
        <Skeleton className="h-12 w-48" />
      </div>
    )
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      {isSignedIn ? (
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
        <Button onClick={() => navigate('/auth')} className="shadow-lg">
          <LogIn className="mr-2 h-4 w-4" />
          Login / Sign Up
        </Button>
      )}
    </div>
  );
};

export default FloatingAuthStatus;
