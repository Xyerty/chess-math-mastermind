
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from "@/lib/utils";

interface MenuCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
  primary?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const MenuCard: React.FC<MenuCardProps> = ({
  title,
  description,
  icon: Icon,
  onClick,
  primary = false,
  className = '',
  style,
}) => {
  const primaryClasses = `
    bg-gradient-to-br from-primary to-purple-600 dark:to-indigo-600 text-primary-foreground 
    border-transparent shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30
    dark:shadow-black/30 dark:hover:shadow-black/40
  `;
  
  const secondaryClasses = `
    bg-card border border-border/80 hover:border-primary/50 hover:bg-accent/50
  `;

  return (
    <Card 
      onClick={onClick}
      className={cn(
        "group cursor-pointer transition-all duration-300 hover:-translate-y-1.5",
        primary ? primaryClasses : secondaryClasses,
        className
      )}
      style={style}
    >
      <CardContent className="p-6">
        <div className="flex items-center gap-6">
          <div className={cn(
            "p-4 rounded-lg transition-all duration-300 group-hover:scale-110",
            primary ? 'bg-white/20 text-white' : 'bg-accent text-accent-foreground'
          )}>
            <Icon className="h-8 w-8" />
          </div>
          <div className="flex-1 space-y-1">
            <h3 className={cn(
              "text-xl font-bold transition-colors",
              primary ? "text-white" : "text-foreground group-hover:text-primary"
            )}>
              {title}
            </h3>
            <p className={cn(
              "text-sm leading-relaxed",
              primary ? "text-primary-foreground/80" : "text-muted-foreground"
            )}>
              {description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MenuCard;
