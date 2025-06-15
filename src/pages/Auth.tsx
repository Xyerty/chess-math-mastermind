
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { SignIn, SignUp } from '@clerk/clerk-react';
import { Sparkles, Shield, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
        <div className="flex flex-col items-center gap-4 text-slate-600 dark:text-slate-400">
          <Loader2 className="h-12 w-12 animate-spin text-purple-600 dark:text-purple-400" />
          <p className="text-lg font-medium">Securing your session...</p>
          <p className="text-sm">Please wait while we prepare the board.</p>
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
        <Card className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-white/20 dark:border-slate-700/50 shadow-2xl shadow-black/10 dark:shadow-black/30 animate-scale-in">
          <CardHeader className="text-center space-y-4 pb-8">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/25 animate-bounce-in">
              <Shield className="h-10 w-10 text-white" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                Welcome to Mathematical Chess
              </CardTitle>
              <CardDescription className="text-lg text-slate-600 dark:text-slate-400">
                Sign in or create an account
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent>
            {/* Primary Clerk Auth */}
            <div className="space-y-4">
              <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                  <TabsTrigger value="signin" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950 data-[state=active]:shadow-md rounded-md transition-all duration-300">Sign In</TabsTrigger>
                  <TabsTrigger value="signup" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950 data-[state=active]:shadow-md rounded-md transition-all duration-300">Sign Up</TabsTrigger>
                </TabsList>
                <TabsContent value="signin" className="mt-6">
                  <div className="flex justify-center">
                    <SignIn 
                      routing="hash"
                      afterSignInUrl="/"
                      appearance={{
                        elements: {
                          rootBox: "w-full",
                          card: "shadow-none border-0 bg-transparent w-full",
                          formButtonPrimary: "bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600",
                          footerActionLink: "text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
                        }
                      }}
                    />
                  </div>
                </TabsContent>
                <TabsContent value="signup" className="mt-6">
                  <div className="flex justify-center">
                    <SignUp 
                      routing="hash"
                      afterSignUpUrl="/"
                      appearance={{
                        elements: {
                          rootBox: "w-full",
                          card: "shadow-none border-0 bg-transparent w-full",
                          formButtonPrimary: "bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600",
                          footerActionLink: "text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
                        }
                      }}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </Card>

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
