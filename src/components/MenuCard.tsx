
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface MenuCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
  primary?: boolean;
  className?: string;
}

const MenuCard: React.FC<MenuCardProps> = ({
  title,
  description,
  icon: Icon,
  onClick,
  primary = false,
  className = '',
}) => {
  return (
    <Card 
      onClick={onClick}
      className={`
        group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1
        ${primary ? 'bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30' : 'bg-card hover:bg-accent/50'}
        ${className}
      `}
    >
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className={`
            p-3 rounded-lg transition-all duration-300 group-hover:scale-110
            ${primary ? 'bg-primary/20 text-primary' : 'bg-accent text-accent-foreground'}
          `}>
            <Icon className="h-6 w-6" />
          </div>
          <div className="flex-1 space-y-2">
            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MenuCard;
