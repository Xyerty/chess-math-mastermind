
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface AuthToggleProps {
  children: React.ReactNode;
  triggerText: string;
  className?: string;
}

export const AuthToggle = ({ children, triggerText, className = '' }: AuthToggleProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={className}>
      <Button
        type="button"
        variant="ghost"
        className="w-full h-12 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/80 font-medium transition-all duration-200 group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="flex-1">{triggerText}</span>
        {isOpen ? (
          <ChevronUp className="ml-2 h-4 w-4 group-hover:scale-110 transition-transform" />
        ) : (
          <ChevronDown className="ml-2 h-4 w-4 group-hover:scale-110 transition-transform" />
        )}
      </Button>
      
      {isOpen && (
        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 animate-fade-in">
          {children}
        </div>
      )}
    </div>
  );
};
