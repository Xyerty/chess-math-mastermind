
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { validateEmail, validatePassword } from '@/lib/auth/validation';
import { cleanupAuthState } from '@/lib/auth/utils';
import { PasswordResetDialog } from './PasswordResetDialog';
import { PasswordInput } from './PasswordInput';
import { FormValidation } from './FormValidation';
import { SignInInfoNote } from './SignInInfoNote';
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
  
  return (
    <>
      <SignInInfoNote />
      <FormValidation error="" />

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
        
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign in with password'}
        </Button>
      </form>

      <PasswordResetDialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen} />
    </>
  );
};
