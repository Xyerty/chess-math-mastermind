
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { SignIn, SignUp } from '@clerk/clerk-react';
import { Sparkles, Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GuestModeCard } from '@/components/auth/GuestModeCard';
import { AuthToggle } from '@/components/auth/AuthToggle';
import { SignInForm } from '@/components/auth/SignInForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AuthPage = () => {
  const navigate = useNavigate();
  const { isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    if (isSignedIn && isLoaded) {
      navigate('/');
    }
  }, [isSignedIn, isLoaded, navigate]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-100 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70">
            <CardContent className="p-8 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-slate-600 dark:text-slate-400">Loading...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-100 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-700/25 bg-[size:20px_20px] opacity-20" />
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
      
      <div className="w-full max-w-md space-y-8 relative z-10">
        {/* Main Auth Card */}
        <Card className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-white/20 dark:border-slate-700/50 shadow-2xl shadow-black/10 dark:shadow-black/30">
          <CardHeader className="text-center space-y-4 pb-8">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/25 animate-bounce-in">
              <Shield className="h-10 w-10 text-white" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                Welcome to Chess Game
              </CardTitle>
              <CardDescription className="text-lg text-slate-600 dark:text-slate-400">
                Sign in to save your progress and compete
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Primary Clerk Auth */}
            <div className="space-y-4">
              <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="signin">Sign In</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                <TabsContent value="signin" className="mt-6">
                  <div className="flex justify-center">
                    <SignIn 
                      routing="hash"
                      redirectUrl="/"
                      appearance={{
                        elements: {
                          rootBox: "mx-auto",
                          card: "shadow-none border-0 bg-transparent",
                        }
                      }}
                    />
                  </div>
                </TabsContent>
                <TabsContent value="signup" className="mt-6">
                  <div className="flex justify-center">
                    <SignUp 
                      routing="hash"
                      redirectUrl="/"
                      appearance={{
                        elements: {
                          rootBox: "mx-auto",
                          card: "shadow-none border-0 bg-transparent",
                        }
                      }}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200 dark:border-slate-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-slate-900 px-4 text-slate-500 dark:text-slate-400 font-medium">
                  Or continue with
                </span>
              </div>
            </div>
            
            {/* Fallback Supabase Auth - Collapsed by default */}
            <AuthToggle 
              triggerText="Traditional email/password" 
              className="w-full"
            >
              <SignInForm 
                setLoading={() => {}} 
                setError={() => {}} 
                loading={false} 
              />
            </AuthToggle>
          </CardContent>
        </Card>

        {/* Guest Mode Option */}
        <div className="animate-fade-in delay-300">
          <GuestModeCard />
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-slate-500 dark:text-slate-400 animate-fade-in delay-500">
          <p className="flex items-center justify-center gap-2">
            <Sparkles className="h-4 w-4" />
            Powered by Clerk • Secure authentication
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
