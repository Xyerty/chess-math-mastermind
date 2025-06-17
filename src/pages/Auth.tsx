
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Crown, Loader2, Sparkles, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import TechLogos from '@/components/TechLogos';
import GoogleSignInButton from '@/components/auth/GoogleSignInButton';
import SignInForm from '@/components/auth/SignInForm';
import SignUpForm from '@/components/auth/SignUpForm';
import { Button } from '@/components/ui/button';

const AuthPage = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const [authView, setAuthView] = useState<'signin' | 'signup'>('signin');
  const [initializationTimeout, setInitializationTimeout] = useState(false);
  const navigate = useNavigate();

  // Add debugging for auth page
  console.log("📄 Auth Page - isLoaded:", isLoaded, "isSignedIn:", isSignedIn);

  // Set a timeout for initialization
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isLoaded) {
        console.warn("⚠️ Clerk initialization taking longer than expected");
        setInitializationTimeout(true);
      }
    }, 10000); // 10 seconds timeout

    return () => clearTimeout(timer);
  }, [isLoaded]);

  // Redirect authenticated users immediately
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      console.log("✅ User is authenticated, redirecting to main menu");
      navigate('/', { replace: true });
    }
  }, [isLoaded, isSignedIn, navigate]);

  if (!isLoaded) {
    console.log("⏳ Auth page waiting for Clerk to load...");
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 dark:from-slate-900 dark:via-teal-900/20 dark:to-slate-900 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4 text-slate-600 dark:text-slate-400">
          {initializationTimeout ? (
            <>
              <AlertTriangle className="h-12 w-12 text-amber-600 dark:text-amber-400" />
              <p className="text-lg font-medium">Initialization taking longer than expected</p>
              <p className="text-sm text-center max-w-md">
                Please check your Clerk configuration and refresh the page.
              </p>
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline" 
                className="mt-4"
              >
                Refresh Page
              </Button>
            </>
          ) : (
            <>
              <Loader2 className="h-12 w-12 animate-spin text-teal-600 dark:text-teal-400" />
              <p className="text-lg font-medium">Initializing authentication...</p>
              <p className="text-sm">Please wait while we prepare the board.</p>
            </>
          )}
        </div>
      </div>
    );
  }

  // If user is signed in, they shouldn't see this page (will be redirected)
  if (isSignedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 dark:from-slate-900 dark:via-teal-900/20 dark:to-slate-900 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-700/25 bg-[size:20px_20px] opacity-10" />
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-teal-400/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
      
      <div className="w-full max-w-md space-y-6 relative z-10 flex-grow flex flex-col justify-center">
        {/* Main Auth Card */}
        <Card className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-white/20 dark:border-slate-700/50 shadow-2xl shadow-black/10 dark:shadow-black/30 animate-scale-in">
          <CardHeader className="text-center space-y-4 pb-6">
            <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/25 animate-bounce-in">
              <Crown className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                Mathematical Chess
              </CardTitle>
              <CardDescription className="text-base sm:text-lg text-slate-600 dark:text-slate-400">
                {authView === 'signin' ? 'Welcome back! Sign in to continue.' : 'Create an account to start playing.'}
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="px-4 sm:px-6 space-y-6">
            <GoogleSignInButton />

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or continue with email
                </span>
              </div>
            </div>

            {authView === 'signin' ? <SignInForm /> : <SignUpForm />}
          </CardContent>
        </Card>
        
        <div className="text-center">
           <Button variant="link" onClick={() => setAuthView(authView === 'signin' ? 'signup' : 'signin')}>
            {authView === 'signin'
              ? "Don't have an account? Sign Up"
              : 'Already have an account? Sign In'}
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400 animate-fade-in delay-500">
          <p className="flex items-center justify-center gap-2">
            <Sparkles className="h-4 w-4" />
            Secure authentication by Clerk
          </p>
        </div>
      </div>
      
      <div className="w-full max-w-md relative z-10 animate-fade-in delay-700">
        <TechLogos />
      </div>
    </div>
  );
};

export default AuthPage;
