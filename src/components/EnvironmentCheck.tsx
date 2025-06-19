
import React from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { env, validateEnvironment } from '@/config/environment';

const EnvironmentCheck: React.FC = () => {
  const errors = validateEnvironment();
  const hasErrors = errors.length > 0;

  if (!env.isDevelopment && !hasErrors) {
    return null; // Don't show in production unless there are errors
  }

  return (
    <Card className="mb-4 border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {hasErrors ? (
            <AlertTriangle className="text-red-500" />
          ) : (
            <CheckCircle className="text-green-500" />
          )}
          Environment Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p><strong>Environment:</strong> {import.meta.env.MODE}</p>
          <p><strong>Python Engine:</strong> {env.features.pythonEngine ? 'Enabled' : 'Disabled'}</p>
          <p><strong>PlayFab:</strong> {env.features.playFab ? 'Enabled' : 'Disabled'}</p>
          <p><strong>Multiplayer:</strong> {env.features.multiplayer ? 'Enabled' : 'Disabled'}</p>
          
          {hasErrors && (
            <Alert className="mt-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-1">
                  <p><strong>Environment Configuration Issues:</strong></p>
                  {errors.map((error, index) => (
                    <p key={index} className="text-sm">• {error}</p>
                  ))}
                </div>
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EnvironmentCheck;
