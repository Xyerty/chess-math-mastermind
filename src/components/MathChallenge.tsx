
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, CheckCircle, XCircle } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

interface MathChallengeProps {
  onSuccess: () => void;
  onFailure: () => void;
  onClose: () => void;
  difficulty?: 'easy' | 'medium' | 'hard';
  timeLimit?: number;
}

const MathChallenge: React.FC<MathChallengeProps> = ({
  onSuccess,
  onFailure,
  onClose,
  difficulty = 'medium',
  timeLimit = 30
}) => {
  const { t } = useLanguage();
  const [problem, setProblem] = useState<{question: string, answer: number}>({question: '', answer: 0});
  const [userAnswer, setUserAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isMounted = useRef(true);
  const [timeLeft, setTimeLeft] = useState(timeLimit);

  // Generate math problem based on difficulty
  const generateProblem = () => {
    let question = '';
    let answer = 0;

    switch (difficulty) {
      case 'easy': {
        const a = Math.floor(Math.random() * 20) + 1;
        const b = Math.floor(Math.random() * 20) + 1;
        const op = Math.random() > 0.5 ? '+' : '-';
        if (op === '+') {
          question = `${a} + ${b}`;
          answer = a + b;
        } else {
          question = `${Math.max(a, b)} - ${Math.min(a, b)}`;
          answer = Math.max(a, b) - Math.min(a, b);
        }
        break;
      }
      case 'medium': {
        const a = Math.floor(Math.random() * 15) + 1;
        const b = Math.floor(Math.random() * 10) + 2;
        const c = Math.floor(Math.random() * 10) + 1;
        const op = ['×', '÷'][Math.floor(Math.random() * 2)];
        if (op === '×') {
          question = `${a} × ${b} + ${c}`;
          answer = a * b + c;
        } else {
          const product = (Math.floor(Math.random() * 10) + 2) * b; // Ensure clean division
          question = `${product} ÷ ${b} - ${c}`;
          answer = product / b - c;
        }
        break;
      }
      case 'hard': {
        const a = Math.floor(Math.random() * 10) + 2;
        const b = Math.floor(Math.random() * 10) + 2;
        const c = Math.floor(Math.random() * 5) + 2;
        const op = Math.random();
        if (op < 0.5) {
          question = `(${a} + ${b}) × ${c}`;
          answer = (a + b) * c;
        } else {
          question = `${a} × ${b} - ${c}`;
          answer = a * b - c;
        }
        break;
      }
    }
    
    setProblem({ question, answer });
  };

  // Timer countdown
  useEffect(() => {
    isMounted.current = true;
    generateProblem();
    
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
  }, []);

  const handleSubmit = () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    const numericAnswer = parseInt(userAnswer);
    
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

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-sm animate-scale-in">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
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
            <div className="text-4xl font-bold text-primary bg-accent/20 py-4 px-6 rounded-lg">
              {problem.question} = ?
            </div>
          </div>

          {/* Answer Input */}
          <div className="space-y-4">
            <Input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
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

          {/* Difficulty Indicator */}
          <div className="text-center text-sm text-muted-foreground">
            {t('math.difficulty')}: <span className="capitalize font-semibold">{t(`math.${difficulty}`)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MathChallenge;

