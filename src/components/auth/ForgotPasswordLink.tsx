
import { Button } from '@/components/ui/button';

interface ForgotPasswordLinkProps {
  onClick: () => void;
  disabled?: boolean;
}

export const ForgotPasswordLink = ({ onClick, disabled = false }: ForgotPasswordLinkProps) => {
  return (
    <div className="mt-2 text-right">
      <Button 
        type="button"
        variant="link"
        className="p-0 h-auto text-sm"
        onClick={onClick}
        disabled={disabled}
      >
        Forgot your password?
      </Button>
    </div>
  );
};
