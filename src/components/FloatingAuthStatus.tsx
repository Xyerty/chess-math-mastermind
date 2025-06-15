
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
        <Skeleton className="h-12 w-12 rounded-full" />
      </div>
    )
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      {isSignedIn ? (
        <UserButton 
          appearance={{
            elements: {
              avatarBox: "h-12 w-12",
              userButtonTrigger: `
                shadow-xl border-2 border-primary/10 hover:border-primary/30
                rounded-full p-0.5 bg-background
                transition-all duration-300
                hover:scale-105 active:scale-95
              `,
              userButtonPopoverCard: `
                mt-2 border border-border shadow-2xl rounded-xl
              `,
              userButtonPopoverMain: `p-2`,
              userButtonPopoverActions: `px-2 pb-2`,
              userButtonPopoverActionButton: `rounded-md text-sm sm:text-base`,
              userButtonPopoverActionButton__manageAccount: `text-foreground hover:bg-accent`,
              userButtonPopoverActionButton__signOut: `text-destructive-foreground bg-destructive/90 hover:bg-destructive`,
            }
          }}
          afterSignOutUrl="/auth"
        />
      ) : (
        <Button onClick={() => navigate('/auth')} className="shadow-lg h-12 px-6">
          <LogIn className="mr-2 h-5 w-5" />
          Login / Sign Up
        </Button>
      )}
    </div>
  );
};

export default FloatingAuthStatus;
