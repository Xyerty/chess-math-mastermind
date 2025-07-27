
import React from 'react';
import { Loader2 } from 'lucide-react';

interface PageLoaderProps {
  message?: string;
}

const PageLoader: React.FC<PageLoaderProps> = ({ 
  message = "Loading..." 
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 dark:from-slate-900 dark:via-teal-900/20 dark:to-slate-900 flex flex-col items-center justify-center p-4">
      <div className="flex flex-col items-center gap-4 text-slate-600 dark:text-slate-400">
        <Loader2 className="h-12 w-12 animate-spin text-teal-600 dark:text-teal-400" />
        <p className="text-lg font-medium">{message}</p>
        {message.includes("authentication") && (
          <p className="text-sm text-center max-w-md">
            If this takes too long, please check your Clerk configuration and refresh the page.
          </p>
        )}
      </div>
    </div>
  );
};

export default PageLoader;
