
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, TrendingUp, TrendingDown, AlertTriangle, Target } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface HintAnalysis {
  bestMove?: {
    from: { row: number; col: number };
    to: { row: number; col: number };
  };
  evaluation: number;
  threats: string[];
  opportunities: string[];
  advice: string;
}

interface HintDisplayProps {
  hint: HintAnalysis;
  onClose: () => void;
  hintsRemaining: number;
}

const HintDisplay: React.FC<HintDisplayProps> = ({ hint, onClose, hintsRemaining }) => {
  const { t } = useLanguage();

  const formatSquare = (square: { row: number; col: number }) => {
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
    return `${files[square.col]}${ranks[square.row]}`;
  };

  const getEvaluationColor = (evaluation: number) => {
    if (evaluation > 200) return 'text-green-600';
    if (evaluation < -200) return 'text-red-600';
    return 'text-yellow-600';
  };

  const getEvaluationIcon = (evaluation: number) => {
    if (evaluation > 200) return <TrendingUp className="h-4 w-4" />;
    if (evaluation < -200) return <TrendingDown className="h-4 w-4" />;
    return <Target className="h-4 w-4" />;
  };

  return (
    <Card className="w-full max-w-sm animate-fade-in">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Position Analysis</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{hintsRemaining} left</Badge>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {hint.bestMove && (
          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-600" />
              Suggested Move
            </h4>
            <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg">
              <p className="text-sm font-mono">
                {formatSquare(hint.bestMove.from)} → {formatSquare(hint.bestMove.to)}
              </p>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <h4 className="font-semibold flex items-center gap-2">
            {getEvaluationIcon(hint.evaluation)}
            Position Evaluation
          </h4>
          <div className={`${getEvaluationColor(hint.evaluation)} font-semibold`}>
            {hint.evaluation > 0 ? '+' : ''}{(hint.evaluation / 100).toFixed(2)}
          </div>
        </div>

        {hint.threats.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-4 w-4" />
              Threats
            </h4>
            <ul className="text-sm space-y-1">
              {hint.threats.slice(0, 3).map((threat, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">•</span>
                  {threat}
                </li>
              ))}
            </ul>
          </div>
        )}

        {hint.opportunities.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2 text-green-600">
              <TrendingUp className="h-4 w-4" />
              Opportunities
            </h4>
            <ul className="text-sm space-y-1">
              {hint.opportunities.slice(0, 3).map((opportunity, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">•</span>
                  {opportunity}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="space-y-2">
          <h4 className="font-semibold">Strategic Advice</h4>
          <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
            {hint.advice}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default HintDisplay;
