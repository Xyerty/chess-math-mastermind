
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { validateEmail, validatePassword } from '@/lib/auth/validation';
import { cleanupAuthState } from '@/lib/auth/utils';
import { PasswordResetDialog } from './PasswordResetDialog';

interface SignInFormProps {
  setLoading: (loading: boolean) => void;
  setError: (error: string) => void;
  loading: boolean;
}

export const SignInForm = ({ setLoading, setError, loading }: SignInFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    if (!validatePassword(password)) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      setLoading(true);
      cleanupAuthState();
      
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        console.log('No existing session to sign out');
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      
      if (error) {
        console.error('Sign in error:', error);
        
        switch (error.message) {
          case 'Invalid login credentials':
            setError('Invalid email or password. Please check your credentials.');
            break;
          case 'Email not confirmed':
            setError('Please check your email and click the confirmation link before signing in.');
            break;
          case 'Too many requests':
            setError('Too many login attempts. Please wait a few minutes before trying again.');
            break;
          default:
            setError(error.message || 'An error occurred during sign in');
        }
        return;
      }
      
      if (data.user) {
        console.log('Sign in successful:', data.user.id);
        toast.success('Successfully signed in!');
        
        setTimeout(() => {
          window.location.href = '/';
        }, 100);
      }
      
    } catch (error) {
      console.error('Unexpected sign in error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLinkSignIn = async () => {
    setError('');
    if (!validateEmail(email)) {
      setError('Please enter a valid email to receive a login link.');
      return;
    }

    try {
      setLoading(true);
      cleanupAuthState();

      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) {
        console.error('Magic link error:', error);
        setError(error.message || 'Failed to send magic link.');
        toast.error(error.message || 'Failed to send magic link.');
      } else {
        setPassword('');
        setError('');
        toast.success('Login link sent! Please check your email.');
      }
    } catch (err: any) {
      console.error('Unexpected magic link error:', err);
      setError('An unexpected error occurred. Please try again.');
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <>
      <form onSubmit={handleSignIn} className="space-y-4">
        <div>
          <Label htmlFor="signin-email">Email</Label>
          <Input
            id="signin-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            disabled={loading}
          />
        </div>
        
        <div>
          <Label htmlFor="signin-password">Password</Label>
          <div className="relative">
            <Input
              id="signin-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={loading}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
              onClick={() => setShowPassword(!showPassword)}
              disabled={loading}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          <div className="mt-2 text-right">
            <Button 
              type="button"
              variant="link"
              className="p-0 h-auto text-sm"
              onClick={() => setIsResetDialogOpen(true)}
              disabled={loading}
            >
              Forgot your password?
            </Button>
          </div>
        </div>
        
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or
          </span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleMagicLinkSignIn}
        disabled={loading || !email}
      >
        {loading ? 'Sending link...' : 'Email me a login link'}
      </Button>

      <PasswordResetDialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen} />
    </>
  );
};
