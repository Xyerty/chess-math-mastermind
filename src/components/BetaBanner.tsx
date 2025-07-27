
import { Megaphone } from 'lucide-react';

const BetaBanner = () => {
  return (
    <div className="bg-primary text-primary-foreground text-center p-2 text-sm font-semibold flex items-center justify-center gap-2 print:hidden">
      <Megaphone className="h-4 w-4" />
      <span>This application is currently in Beta. Features may change or be incomplete.</span>
    </div>
  );
};

export default BetaBanner;
