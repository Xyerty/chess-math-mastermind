
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, CheckCircle, XCircle, Calculator } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

interface MathChallengeProps {
  onSuccess: () => void;
  onFailure: () => void;
  onClose: () => void;
  difficulty?: 'easy' | 'medium' | 'hard';
  timeLimit?: number;
}

type ProblemType = 'arithmetic' | 'algebraic' | 'mixed';

interface MathProblem {
  question: string;
  answer: number;
  type: ProblemType;
  explanation?: string;
}

const MathChallenge: React.FC<MathChallengeProps> = ({
  onSuccess,
  onFailure,
  onClose,
  difficulty = 'medium',
  timeLimit = 30
}) => {
  const { t } = useLanguage();
  const [problem, setProblem] = useState<MathProblem>({ question: '', answer: 0, type: 'arithmetic' });
  const [userAnswer, setUserAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isMounted = useRef(true);
  const [timeLeft, setTimeLeft] = useState(timeLimit);

  // Generate math problem based on difficulty with improved variety
  const generateProblem = (): MathProblem => {
    const problemTypes: ProblemType[] = difficulty === 'easy' ? ['arithmetic'] : ['arithmetic', 'algebraic', 'mixed'];
    const selectedType = problemTypes[Math.floor(Math.random() * problemTypes.length)];

    switch (difficulty) {
      case 'easy': {
        const operations = ['+', '-', '×'];
        const op = operations[Math.floor(Math.random() * operations.length)];
        const a = Math.floor(Math.random() * 15) + 1;
        const b = Math.floor(Math.random() * 15) + 1;
        
        let question = '';
        let answer = 0;
        
        if (op === '+') {
          question = `${a} + ${b}`;
          answer = a + b;
        } else if (op === '-') {
          const [larger, smaller] = [Math.max(a, b), Math.min(a, b)];
          question = `${larger} - ${smaller}`;
          answer = larger - smaller;
        } else {
          question = `${a} × ${b}`;
          answer = a * b;
        }
        
        return { question, answer, type: 'arithmetic' };
      }

      case 'medium': {
        if (selectedType === 'algebraic') {
          // Simple algebraic problems: x + a = b, solve for x
          const a = Math.floor(Math.random() * 20) + 1;
          const x = Math.floor(Math.random() * 15) + 1;
          const b = x + a;
          return {
            question: `x + ${a} = ${b}`,
            answer: x,
            type: 'algebraic',
            explanation: `x = ${b} - ${a} = ${x}`
          };
        } else {
          // Mixed operations
          const a = Math.floor(Math.random() * 12) + 2;
          const b = Math.floor(Math.random() * 8) + 2;
          const c = Math.floor(Math.random() * 10) + 1;
          const operations = ['×+', '×-', '÷+', '÷-'];
          const op = operations[Math.floor(Math.random() * operations.length)];
          
          let question = '';
          let answer = 0;
          
          if (op === '×+') {
            question = `${a} × ${b} + ${c}`;
            answer = a * b + c;
          } else if (op === '×-') {
            question = `${a} × ${b} - ${c}`;
            answer = a * b - c;
          } else if (op === '÷+') {
            const dividend = a * b; // Ensure clean division
            question = `${dividend} ÷ ${b} + ${c}`;
            answer = dividend / b + c;
          } else {
            const dividend = a * b;
            question = `${dividend} ÷ ${b} - ${c}`;
            answer = dividend / b - c;
          }
          
          return { question, answer, type: 'mixed' };
        }
      }

      case 'hard': {
        if (selectedType === 'algebraic') {
          // More complex algebra: ax + b = c, solve for x
          const a = Math.floor(Math.random() * 8) + 2;
          const x = Math.floor(Math.random() * 10) + 1;
          const b = Math.floor(Math.random() * 15) + 1;
          const c = a * x + b;
          return {
            question: `${a}x + ${b} = ${c}`,
            answer: x,
            type: 'algebraic',
            explanation: `x = (${c} - ${b}) ÷ ${a} = ${x}`
          };
        } else {
          // Complex mixed operations with parentheses
          const a = Math.floor(Math.random() * 8) + 2;
          const b = Math.floor(Math.random() * 8) + 2;
          const c = Math.floor(Math.random() * 6) + 2;
          const d = Math.floor(Math.random() * 5) + 1;
          
          const patterns = [
            { q: `(${a} + ${b}) × ${c} - ${d}`, a: (a + b) * c - d },
            { q: `${a} × (${b} + ${c}) - ${d}`, a: a * (b + c) - d },
            { q: `(${a} × ${b}) ÷ ${c} + ${d}`, a: Math.floor((a * b) / c) + d },
            { q: `${a}² - ${b}`, a: a * a - b }
          ];
          
          const selected = patterns[Math.floor(Math.random() * patterns.length)];
          return { question: selected.q, answer: selected.a, type: 'mixed' };
        }
      }

      default:
        return { question: '2 + 2', answer: 4, type: 'arithmetic' };
    }
  };

  // Timer countdown
  useEffect(() => {
    isMounted.current = true;
    setProblem(generateProblem());
    
    if (timeLimit === Infinity) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          if (isMounted.current) {
            onFailure();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      isMounted.current = false;
      clearInterval(timer);
    };
  }, [timeLimit, onFailure]);

  const handleSubmit = () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    const numericAnswer = parseInt(userAnswer.trim());
    
    setTimeout(() => {
      if (numericAnswer === problem.answer) {
        onSuccess();
      } else {
        onFailure();
      }
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const getDifficultyColor = () => {
    switch (difficulty) {
      case 'easy': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'hard': return 'text-red-600';
      default: return 'text-primary';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md animate-scale-in">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <Calculator className="h-6 w-6" />
            <span>{t('math.title')}</span>
            {timeLimit !== Infinity && (
              <div className="flex items-center gap-1 text-lg">
                <Clock className="h-5 w-5" />
                <span className={timeLeft <= 10 ? 'text-destructive font-bold' : 'text-primary'}>{timeLeft}s</span>
              </div>
            )}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Problem */}
          <div className="text-center">
            <p className="text-lg text-muted-foreground mb-4">{t('math.instruction')}</p>
            <div className="text-4xl font-bold text-primary bg-accent/20 py-6 px-6 rounded-lg border-2 border-accent/30">
              {problem.question} = ?
            </div>
            {problem.type === 'algebraic' && (
              <p className="text-sm text-muted-foreground mt-2">Solve for x (enter number only)</p>
            )}
          </div>

          {/* Answer Input */}
          <div className="space-y-4">
            <Input
              type="text"
              inputMode="numeric"
              pattern="[0-9-]*"
              placeholder={t('math.enterAnswer')}
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value.replace(/[^0-9-]/g, ''))}
              onKeyPress={handleKeyPress}
              className="text-center text-xl font-semibold h-12"
              autoFocus
              disabled={isSubmitting}
            />

            {/* Buttons */}
            <div className="flex gap-3">
              <Button 
                onClick={handleSubmit}
                disabled={!userAnswer || isSubmitting}
                className="flex-1 h-12 text-lg"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {t('math.checking')}
                  </div>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-5 w-5" />
                    {t('math.submitAnswer')}
                  </>
                )}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={onClose}
                disabled={isSubmitting}
                className="h-12"
              >
                <XCircle className="mr-2 h-5 w-5" />
                {t('math.cancel')}
              </Button>
            </div>
          </div>

          {/* Difficulty and Type Indicator */}
          <div className="text-center text-sm space-y-1">
            <div className="text-muted-foreground">
              {t('math.difficulty')}: <span className={`capitalize font-semibold ${getDifficultyColor()}`}>{t(`math.${difficulty}`)}</span>
            </div>
            <div className="text-muted-foreground">
              Type: <span className="capitalize font-medium">{problem.type}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MathChallenge;
