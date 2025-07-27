
import React from "react";
import { Clock } from "lucide-react";

interface MathTimerProps {
  timeLeft: number;
  timeLimit: number;
}

const MathTimer: React.FC<MathTimerProps> = ({ timeLeft, timeLimit }) => {
  if (timeLimit === Infinity) return null;

  return (
    <div className="flex items-center gap-1 text-lg">
      <Clock className="h-5 w-5" />
      <span className={timeLeft <= 10 ? 'text-destructive font-bold' : 'text-primary'}>
        {timeLeft}s
      </span>
    </div>
  );
};

export default MathTimer;
