
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
        className="w-full h-auto py-2 text-sm text-muted-foreground hover:text-foreground"
        onClick={() => setIsOpen(!isOpen)}
      >
        {triggerText}
        {isOpen ? (
          <ChevronUp className="ml-2 h-4 w-4" />
        ) : (
          <ChevronDown className="ml-2 h-4 w-4" />
        )}
      </Button>
      
      {isOpen && (
        <div className="mt-4 pt-4 border-t">
          {children}
        </div>
      )}
    </div>
  );
};
