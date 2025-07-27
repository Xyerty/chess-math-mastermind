
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

interface GameErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface GameErrorBoundaryProps {
  children: React.ReactNode;
  onReset?: () => void;
  onGoHome?: () => void;
}

class GameErrorBoundary extends React.Component<GameErrorBoundaryProps, GameErrorBoundaryState> {
  constructor(props: GameErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): GameErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Game Error Boundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <AlertTriangle className="h-12 w-12 text-destructive" />
              </div>
              <CardTitle className="text-xl">Game Error</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-center text-muted-foreground">
                Something went wrong with the chess game. Don't worry, your progress is safe.
              </p>
              
              {this.state.error && (
                <details className="text-xs bg-muted p-3 rounded-lg">
                  <summary className="cursor-pointer font-medium">Technical Details</summary>
                  <pre className="mt-2 whitespace-pre-wrap">
                    {this.state.error.message}
                  </pre>
                </details>
              )}

              <div className="flex flex-col gap-2">
                <Button onClick={this.handleReset} className="w-full">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                
                {this.props.onGoHome && (
                  <Button 
                    variant="outline" 
                    onClick={this.props.onGoHome}
                    className="w-full"
                  >
                    <Home className="h-4 w-4 mr-2" />
                    Go to Main Menu
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default GameErrorBoundary;
