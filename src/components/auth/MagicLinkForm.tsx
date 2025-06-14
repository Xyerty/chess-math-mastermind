
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, ArrowRight } from 'lucide-react';
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

  return (
    <form onSubmit={handleMagicLinkSignIn} className="space-y-4">
      <div>
        <Label htmlFor="magic-email" className="text-base font-medium">
          Email address
        </Label>
        <p className="text-sm text-muted-foreground mb-2">
          We'll send you a secure login link - no password needed
        </p>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="magic-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="pl-10 h-12"
            required
            disabled={loading}
          />
        </div>
      </div>
      
      <Button 
        type="submit" 
        className="w-full h-12 text-base font-medium" 
        disabled={loading || !email}
      >
        {loading ? (
          'Sending login link...'
        ) : (
          <>
            Send login link
            <ArrowRight className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
      
      <div className="text-center text-sm text-muted-foreground">
        <p>No account? No problem! We'll create one automatically.</p>
      </div>
    </form>
  );
};
