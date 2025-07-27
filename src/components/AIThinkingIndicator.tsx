
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { BrainCircuit, Loader } from 'lucide-react';

interface AIThinkingIndicatorProps {
  isThinking: boolean;
}

const AIThinkingIndicator: React.FC<AIThinkingIndicatorProps> = ({ 
  isThinking
}) => {
  if (!isThinking) return null;

  return (
    <Card className="border-primary/20 bg-primary/5 animate-pulse">
      <CardContent className="flex items-center gap-3 p-4">
        <div className="flex items-center gap-2">
          <BrainCircuit className="h-5 w-5 text-primary" />
          <Loader className="h-4 w-4 animate-spin text-primary" />
        </div>
        <div>
          <div className="font-semibold text-primary">AI is considering its move...</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIThinkingIndicator;
