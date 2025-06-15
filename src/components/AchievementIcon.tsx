
import React from 'react';
import {
  Award, BarChart3, Book, BookOpen, Bot, BrainCircuit, BrainCog, Castle,
  ChevronsUp, Crown, Diamond, Flag, Flame, Gem, Globe, GraduationCap,
  Hourglass, Medal, MoveHorizontal, Package, Play, Rocket, Shield, 
  ShieldAlert, ShieldCheck, Sigma, Skull, Sparkles, Star, Swords,
  Target, Timer, TrendingUp, Trophy, Undo, Wand, Zap
} from 'lucide-react';
import { LucideProps } from 'lucide-react';

const iconMap: { [key: string]: React.FC<LucideProps> } = {
  Play, Trophy, Crown, Timer, Flag, Medal, ChevronsUp, Castle, Wand, Undo, Book,
  TrendingUp, Star, Calculator: Sigma, // Map 'Calculator' to 'Sigma' icon
  Zap, BrainCircuit, Rabbit: Rocket, BookOpen, GraduationCap, Bot,
  MoveHorizontal, Hourglass, Rocket, Sparkles, Package, Flame, Gem, Target, Sigma, Skull,
  Award, BarChart3, ShieldCheck, Swords, BrainCog, ShieldAlert, Diamond, Globe, Shield,
  ChessKnight: Award, // Placeholder for custom icon
  ChessBishop: Award, // Placeholder for custom icon
  ChessRook: Award,   // Placeholder for custom icon
  ChessPawn: Award,   // Placeholder for custom icon
  Podium: Trophy,     // Use Trophy instead of non-existent Podium
};

interface AchievementIconProps {
  iconName: string;
  className?: string;
}

const AchievementIcon: React.FC<AchievementIconProps> = ({ iconName, className }) => {
  const IconComponent = iconMap[iconName];
  if (!IconComponent) {
    return <Award className={className} />; // Default icon
  }
  return <IconComponent className={className} />;
};

export default AchievementIcon;
