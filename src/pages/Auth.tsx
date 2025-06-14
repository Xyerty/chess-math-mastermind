
import { supabase } from '@/integrations/supabase/client';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useTheme } from 'next-themes';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LogIn } from 'lucide-react';

const AuthPage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { session } = useAuth();

  useEffect(() => {
    if (session) {
      navigate('/');
    }
  }, [session, navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-background p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-card text-card-foreground rounded-lg shadow-lg border">
        <div className="text-center">
            <LogIn className="mx-auto h-12 w-12 text-primary" />
            <h1 className="text-3xl font-bold mt-4">Mathematical Chess</h1>
            <p className="text-muted-foreground">Sign in or create an account to play</p>
        </div>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          theme={theme === 'dark' ? 'dark' : 'default'}
          providers={['google']}
          redirectTo={`${window.location.origin}/`}
        />
      </div>
    </div>
  );
};

export default AuthPage;
