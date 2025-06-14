
import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { generateMathProblem, MathProblem } from "./math/MathProblemGenerator";
import MathProblemDisplay from "./math/MathProblemDisplay";
import MathTimer from "./math/MathTimer";
import MathAnswerInput from "./math/MathAnswerInput";

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
  const [problem, setProblem] = useState<MathProblem>({ question: '', answer: 0, type: 'arithmetic' });
  const [userAnswer, setUserAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isMounted = useRef(true);
  const [timeLeft, setTimeLeft] = useState(timeLimit);

  // Timer countdown
  useEffect(() => {
    isMounted.current = true;
    setProblem(generateMathProblem(difficulty));
    
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
  }, [timeLimit, onFailure, difficulty]);

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

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md animate-scale-in">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <Calculator className="h-6 w-6" />
            <span>{t('math.title')}</span>
            <MathTimer timeLeft={timeLeft} timeLimit={timeLimit} />
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <MathProblemDisplay problem={problem} difficulty={difficulty} />
          
          <MathAnswerInput
            userAnswer={userAnswer}
            setUserAnswer={setUserAnswer}
            onSubmit={handleSubmit}
            onCancel={onClose}
            isSubmitting={isSubmitting}
            onKeyPress={handleKeyPress}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default MathChallenge;
