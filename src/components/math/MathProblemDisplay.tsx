
import React from "react";
import { Calculator } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { MathProblem } from "./MathProblemGenerator";

interface MathProblemDisplayProps {
  problem: MathProblem;
  difficulty: 'easy' | 'medium' | 'hard';
}

const MathProblemDisplay: React.FC<MathProblemDisplayProps> = ({ problem, difficulty }) => {
  const { t } = useLanguage();

  const getDifficultyColor = () => {
    switch (difficulty) {
      case 'easy': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'hard': return 'text-red-600';
      default: return 'text-primary';
    }
  };

  return (
    <div className="text-center">
      <p className="text-lg text-muted-foreground mb-4">{t('math.instruction')}</p>
      <div className="text-4xl font-bold text-primary bg-accent/20 py-6 px-6 rounded-lg border-2 border-accent/30">
        {problem.question} = ?
      </div>
      {problem.type === 'algebraic' && (
        <p className="text-sm text-muted-foreground mt-2">Solve for x (enter number only)</p>
      )}
      <div className="text-center text-sm space-y-1 mt-4">
        <div className="text-muted-foreground">
          {t('math.difficulty')}: <span className={`capitalize font-semibold ${getDifficultyColor()}`}>{t(`math.${difficulty}`)}</span>
        </div>
        <div className="text-muted-foreground">
          Type: <span className="capitalize font-medium">{problem.type}</span>
        </div>
      </div>
    </div>
  );
};

export default MathProblemDisplay;
