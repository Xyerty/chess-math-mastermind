
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { validateEmail, validatePassword } from '@/lib/auth/validation';
import { cleanupAuthState } from '@/lib/auth/utils';
import { PasswordResetDialog } from './PasswordResetDialog';
import { PasswordInput } from './PasswordInput';
import { FormValidation } from './FormValidation';
import { ForgotPasswordLink } from './ForgotPasswordLink';

interface SignInFormProps {
  setLoading: (loading: boolean) => void;
  setError: (error: string) => void;
  loading: boolean;
}

export const SignInForm = ({ setLoading, setError, loading }: SignInFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLocalError('');
    
    if (!validateEmail(email)) {
      setLocalError('Please enter a valid email address');
      return;
    }
    
    if (!validatePassword(password)) {
      setLocalError('Password must be at least 6 characters long');
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
            setLocalError('Invalid email or password. Please check your credentials.');
            break;
          case 'Email not confirmed':
            setLocalError('Please check your email and click the confirmation link before signing in.');
            break;
          case 'Too many requests':
            setLocalError('Too many login attempts. Please wait a few minutes before trying again.');
            break;
          default:
            setLocalError(error.message || 'An error occurred during sign in');
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
      setLocalError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <FormValidation error={localError} />

      <form onSubmit={handleSignIn} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="signin-email" className="text-sm font-medium text-slate-900 dark:text-white">
            Email
          </Label>
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <Input
              id="signin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="pl-11 h-12 bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all duration-200"
              required
              disabled={loading}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="signin-password" className="text-sm font-medium text-slate-900 dark:text-white">
            Password
          </Label>
          <PasswordInput
            id="signin-password"
            value={password}
            onChange={setPassword}
            placeholder="Enter your password"
            required
            disabled={loading}
          />
          <ForgotPasswordLink 
            onClick={() => setIsResetDialogOpen(true)}
            disabled={loading}
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full h-12 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black dark:from-white dark:to-slate-200 dark:hover:from-slate-100 dark:hover:to-white text-white dark:text-slate-900 shadow-lg shadow-slate-500/25 hover:shadow-slate-500/40 dark:shadow-white/10 dark:hover:shadow-white/20 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] font-medium" 
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            'Sign in with password'
          )}
        </Button>
      </form>

      <PasswordResetDialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen} />
    </div>
  );
};
