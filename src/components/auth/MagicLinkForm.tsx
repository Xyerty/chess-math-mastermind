
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { validateEmail } from '@/lib/auth/validation';
import { cleanupAuthState } from '@/lib/auth/utils';

interface MagicLinkFormProps {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  setError: (error: string) => void;
}

export const MagicLinkForm = ({ loading, setLoading, setError }: MagicLinkFormProps) => {
  const [email, setEmail] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleMagicLinkSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      setLoading(true);
      cleanupAuthState();

      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          shouldCreateUser: true,
        },
      });

      if (error) {
        console.error('Magic link error:', error);
        if (error.message.includes('rate limit')) {
          setError('Too many login attempts. Please wait a few minutes before trying again.');
        } else if (error.message.includes('Invalid email')) {
          setError('Please enter a valid email address.');
        } else {
          setError(error.message || 'Failed to send login link.');
        }
        toast.error(error.message || 'Failed to send login link.');
      } else {
        setError('');
        setIsEmailSent(true);
        toast.success('Login link sent! Please check your email (including spam folder).');
      }
    } catch (err: any) {
      console.error('Unexpected magic link error:', err);
      setError('An unexpected error occurred. Please try again.');
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (isEmailSent) {
    return (
      <div className="text-center space-y-4 animate-scale-in">
        <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            Check your email
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            We've sent a magic link to <strong>{email}</strong>
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEmailSent(false)}
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Use a different email
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleMagicLinkSignIn} className="space-y-6">
      <div className="space-y-3">
        <Label htmlFor="magic-email" className="text-base font-semibold text-slate-900 dark:text-white">
          Email address
        </Label>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          We'll send you a secure login link - no password needed
        </p>
        <div className="relative group">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <Input
            id="magic-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="pl-12 h-14 text-base bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all duration-200 hover:bg-white/80 dark:hover:bg-slate-800/80"
            required
            disabled={loading}
          />
        </div>
      </div>
      
      <Button 
        type="submit" 
        className="w-full h-14 text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]" 
        disabled={loading || !email}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Sending magic link...
          </>
        ) : (
          <>
            Send magic link
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </Button>
      
      <div className="text-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          No account? No problem! We'll create one automatically.
        </p>
      </div>
    </form>
  );
};
