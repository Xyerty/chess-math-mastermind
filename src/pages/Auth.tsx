
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LogIn, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PasswordUpdateForm } from '@/components/auth/PasswordUpdateForm';
import { MagicLinkForm } from '@/components/auth/MagicLinkForm';
import { SignInForm } from '@/components/auth/SignInForm';
import { GuestModeCard } from '@/components/auth/GuestModeCard';
import { AuthToggle } from '@/components/auth/AuthToggle';

const AuthPage = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [view, setView] = useState<'auth' | 'update_password'>('auth');

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes('type=recovery')) {
      setView('update_password');
    } else if (session) {
      navigate('/');
    }
  }, [session, navigate]);

  if (view === 'update_password') {
    return <PasswordUpdateForm />;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Main Auth Card */}
        <Card>
          <CardHeader className="text-center">
            <LogIn className="mx-auto h-12 w-12 text-primary mb-2" />
            <CardTitle className="text-2xl">Welcome to Mathematical Chess</CardTitle>
            <CardDescription>
              The fastest way to sign in is with a magic link
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {/* Primary Magic Link Auth */}
            <MagicLinkForm 
              loading={loading} 
              setLoading={setLoading} 
              setError={setError} 
            />
            
            {/* Fallback Password Auth - Collapsed by default */}
            <AuthToggle 
              triggerText="Use password instead" 
              className="mt-6"
            >
              <SignInForm 
                setLoading={setLoading} 
                setError={setError} 
                loading={loading} 
              />
            </AuthToggle>
          </CardContent>
        </Card>

        {/* Guest Mode Option */}
        <GuestModeCard />
      </div>
    </div>
  );
};

export default AuthPage;
