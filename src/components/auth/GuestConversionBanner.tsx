
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Save, X } from 'lucide-react';

export const GuestConversionBanner = () => {
  const navigate = useNavigate();

  // Since we've simplified to Clerk-only auth, we'll hide this banner for now
  // In the future, this could be used for other conversion purposes
  const isGuest = false;

  const handleSaveProgress = () => {
    navigate('/auth?intent=save');
  };

  const handleDismiss = () => {
    // No guest mode to exit, so this is a no-op
    console.log('Banner dismissed');
  };

  if (!isGuest) return null;

  return (
    <Card className="mb-4 border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Save className="h-5 w-5 text-amber-600" />
            <div>
              <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                Playing as Guest
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-200">
                Create an account to save your progress across devices
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleSaveProgress}
              className="text-amber-700 border-amber-300 hover:bg-amber-100 dark:text-amber-200"
            >
              Save Progress
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleDismiss}
              className="text-amber-600 hover:bg-amber-100 dark:text-amber-300"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
