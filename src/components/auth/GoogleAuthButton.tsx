
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface GoogleAuthButtonProps {
  loading: boolean;
  setError: (error: string) => void;
}

export const GoogleAuthButton = ({ loading, setError }: GoogleAuthButtonProps) => {
  const handleGoogleSignIn = async () => {
    setError('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      console.error('Google Sign In error:', error);
      setError(error.message);
      toast.error(error.message || 'Failed to start Google sign-in process.');
    }
  };

  return (
    <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={loading}>
      Continue with Google
    </Button>
  );
};
