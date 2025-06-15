
import { Loader2 } from 'lucide-react';

const PageLoader = ({ message = "Loading page..." }: { message?: string }) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4 text-muted-foreground">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-lg font-medium">{message}</p>
      </div>
    </div>
  );
};

export default PageLoader;
