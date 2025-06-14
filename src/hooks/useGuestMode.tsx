
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const useGuestMode = () => {
  const { user } = useAuth();
  const [isGuest, setIsGuest] = useState(false);
  const [guestProgress, setGuestProgress] = useState<any>(null);

  useEffect(() => {
    const guestMode = localStorage.getItem('guestMode');
    const progress = localStorage.getItem('guestProgress');
    
    if (guestMode === 'true' && !user) {
      setIsGuest(true);
      if (progress) {
        try {
          setGuestProgress(JSON.parse(progress));
        } catch (err) {
          console.error('Error parsing guest progress:', err);
        }
      }
    } else {
      setIsGuest(false);
    }
  }, [user]);

  const saveGuestProgress = (progress: any) => {
    if (isGuest) {
      localStorage.setItem('guestProgress', JSON.stringify(progress));
      setGuestProgress(progress);
    }
  };

  const convertGuestToUser = () => {
    if (isGuest && guestProgress) {
      // This would be called after successful authentication
      localStorage.removeItem('guestMode');
      localStorage.removeItem('guestProgress');
      setIsGuest(false);
      toast.success('Your progress has been saved to your account!');
      return guestProgress;
    }
    return null;
  };

  const exitGuestMode = () => {
    localStorage.removeItem('guestMode');
    localStorage.removeItem('guestProgress');
    setIsGuest(false);
    setGuestProgress(null);
  };

  return {
    isGuest,
    guestProgress,
    saveGuestProgress,
    convertGuestToUser,
    exitGuestMode,
  };
};
