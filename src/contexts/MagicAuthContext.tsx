
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { magic, isLoggedIn, getUserInfo } from '@/lib/magic';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface MagicUser {
  email: string;
  publicAddress: string;
  issuer: string;
}

interface MagicAuthContextType {
  user: MagicUser | null;
  loading: boolean;
  signInWithEmail: (email: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  connectWallet: () => Promise<string | null>;
}

const MagicAuthContext = createContext<MagicAuthContextType | undefined>(undefined);

export const MagicAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<MagicUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUserStatus();
  }, []);

  const checkUserStatus = async () => {
    try {
      setLoading(true);
      const loggedIn = await isLoggedIn();
      
      if (loggedIn) {
        const userInfo = await getUserInfo();
        if (userInfo) {
          setUser({
            email: userInfo.email || '',
            publicAddress: userInfo.publicAddress || '',
            issuer: userInfo.issuer || '',
          });
          await syncWithSupabase(userInfo);
        }
      }
    } catch (error) {
      console.error('Error checking user status:', error);
    } finally {
      setLoading(false);
    }
  };

  const syncWithSupabase = async (userInfo: any) => {
    try {
      // Check if profile exists in Supabase
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userInfo.issuer)
        .single();

      if (!profile) {
        // Create profile in Supabase
        const { error } = await supabase
          .from('profiles')
          .insert({
            id: userInfo.issuer,
            username: userInfo.email?.split('@')[0] || 'User',
            avatar_url: null,
          });

        if (error) {
          console.error('Error creating Supabase profile:', error);
        }
      }
    } catch (error) {
      console.error('Error syncing with Supabase:', error);
    }
  };

  const signInWithEmail = async (email: string): Promise<boolean> => {
    try {
      setLoading(true);
      const didToken = await magic.auth.loginWithEmailOTP({ email });
      
      if (didToken) {
        await checkUserStatus();
        toast.success('Successfully signed in with Magic!');
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Magic sign in error:', error);
      toast.error(error.message || 'Failed to sign in');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const connectWallet = async (): Promise<string | null> => {
    try {
      const accounts = await magic.wallet.connectWithUI();
      return accounts[0] || null;
    } catch (error) {
      console.error('Error connecting wallet:', error);
      return null;
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await magic.user.logout();
      setUser(null);
      toast.success('Successfully signed out!');
      
      // Force page reload for clean state
      setTimeout(() => {
        window.location.href = '/auth';
      }, 100);
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Error signing out');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    signInWithEmail,
    signOut,
    connectWallet,
  };

  return (
    <MagicAuthContext.Provider value={value}>
      {children}
    </MagicAuthContext.Provider>
  );
};

export const useMagicAuth = () => {
  const context = useContext(MagicAuthContext);
  if (context === undefined) {
    throw new Error('useMagicAuth must be used within a MagicAuthProvider');
  }
  return context;
};
