
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, ArrowRight, Loader2, Wallet } from 'lucide-react';
import { useMagicAuth } from '@/contexts/MagicAuthContext';
import { validateEmail } from '@/lib/auth/validation';

export const MagicEmailForm = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const { signInWithEmail, loading } = useMagicAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    const success = await signInWithEmail(email.trim());
    if (success) {
      // Redirect will be handled by the auth context
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-3">
        <Label htmlFor="magic-email" className="text-base font-semibold text-slate-900 dark:text-white">
          Email address
        </Label>
        <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
          <Wallet className="h-4 w-4 text-purple-500" />
          Sign in with Magic - includes Web3 wallet
        </p>
        <div className="relative group">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
          <Input
            id="magic-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="pl-12 h-14 text-base bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-purple-500/20 dark:focus:ring-purple-400/20 transition-all duration-200 hover:bg-white/80 dark:hover:bg-slate-800/80"
            required
            disabled={loading}
          />
        </div>
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>
      
      <Button 
        type="submit" 
        className="w-full h-14 text-base font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]" 
        disabled={loading || !email}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Signing in with Magic...
          </>
        ) : (
          <>
            <Wallet className="mr-2 h-5 w-5" />
            Sign in with Magic
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </Button>
      
      <div className="text-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Includes dedicated Ethereum wallet • No seed phrases needed
        </p>
      </div>
    </form>
  );
};
