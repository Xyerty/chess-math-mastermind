
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface MissingEnvVarProps {
  varName: string;
  instructions: React.ReactNode;
}

const MissingEnvVar: React.FC<MissingEnvVarProps> = ({ varName, instructions }) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle />
            Configuration Error
          </CardTitle>
          <CardDescription>
            The application cannot start because a required environment variable is missing.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>
              The <code className="font-mono bg-muted px-1.5 py-0.5 rounded">{varName}</code> environment variable is not set.
            </p>
            <div>
              <h3 className="font-semibold mb-2">How to fix this:</h3>
              {instructions}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MissingEnvVar;
