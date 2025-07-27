
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle, XCircle } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";

interface MathAnswerInputProps {
  userAnswer: string;
  setUserAnswer: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

const MathAnswerInput: React.FC<MathAnswerInputProps> = ({
  userAnswer,
  setUserAnswer,
  onSubmit,
  onCancel,
  isSubmitting,
  onKeyPress
}) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <Input
        type="text"
        inputMode="numeric"
        pattern="[0-9-]*"
        placeholder={t('math.enterAnswer')}
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value.replace(/[^0-9-]/g, ''))}
        onKeyPress={onKeyPress}
        className="text-center text-xl font-semibold h-12"
        autoFocus
        disabled={isSubmitting}
      />

      <div className="flex gap-3">
        <Button 
          onClick={onSubmit}
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
          onClick={onCancel}
          disabled={isSubmitting}
          className="h-12"
        >
          <XCircle className="mr-2 h-5 w-5" />
          {t('math.cancel')}
        </Button>
      </div>
    </div>
  );
};

export default MathAnswerInput;
