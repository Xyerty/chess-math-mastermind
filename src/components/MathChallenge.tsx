
import React, { useState, useEffect } from "react";
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
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generate math problem based on difficulty
  const generateProblem = () => {
    let a, b, operation, question, answer;
    
    switch (difficulty) {
      case 'easy':
        a = Math.floor(Math.random() * 10) + 1;
        b = Math.floor(Math.random() * 10) + 1;
        operation = Math.random() > 0.5 ? '+' : '-';
        if (operation === '+') {
          question = `${a} + ${b}`;
          answer = a + b;
        } else {
          // Ensure positive result for subtraction
          if (a < b) [a, b] = [b, a];
          question = `${a} - ${b}`;
          answer = a - b;
        }
        break;
        
      case 'medium':
        a = Math.floor(Math.random() * 12) + 1;
        b = Math.floor(Math.random() * 12) + 1;
        operation = ['×', '÷'][Math.floor(Math.random() * 2)];
        if (operation === '×') {
          question = `${a} × ${b}`;
          answer = a * b;
        } else {
          // Ensure clean division
          answer = Math.floor(Math.random() * 12) + 1;
          a = answer * b;
          question = `${a} ÷ ${b}`;
        }
        break;
        
      case 'hard':
        a = Math.floor(Math.random() * 15) + 5;
        b = Math.floor(Math.random() * 15) + 5;
        const operations = ['+', '-', '×'];
        operation = operations[Math.floor(Math.random() * operations.length)];
        if (operation === '+') {
          question = `${a} + ${b}`;
          answer = a + b;
        } else if (operation === '-') {
          if (a < b) [a, b] = [b, a];
          question = `${a} - ${b}`;
          answer = a - b;
        } else {
          question = `${a} × ${b}`;
          answer = a * b;
        }
        break;
    }
    
    setProblem({ question, answer });
  };

  // Timer countdown
  useEffect(() => {
    generateProblem();
    
    if (timeLimit === Infinity) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onFailure();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md animate-scale-in">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <span>{t('math.title')}</span>
            {timeLimit !== Infinity && (
              <div className="flex items-center gap-1 text-lg">
                <Clock className="h-5 w-5" />
                <span className={timeLeft <= 10 ? 'text-red-500' : 'text-primary'}>{timeLeft}s</span>
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
              type="number"
              placeholder={t('math.enterAnswer')}
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
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
