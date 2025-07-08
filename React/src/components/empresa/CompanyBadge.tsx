
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Sprout, Baby, TrendingUp, Crown, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CompanyBadgeProps {
  classification?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const badgeConfig = {
  'Newborn': {
    name: 'Newborn',
    icon: Sprout,
    color: 'bg-amber-100 text-amber-800 border-amber-300',
    description: 'Empresas em fase inicial'
  },
  'Early Walker': {
    name: 'Early Walker',
    icon: Baby,
    color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    description: 'Pequenas empresas em crescimento'
  },
  'Scaler': {
    name: 'Scaler',
    icon: TrendingUp,
    color: 'bg-blue-100 text-blue-800 border-blue-300',
    description: 'Médias empresas em expansão'
  },
  'Authority': {
    name: 'Authority',
    icon: Crown,
    color: 'bg-purple-100 text-purple-800 border-purple-300',
    description: 'Grandes empresas consolidadas'
  },
  'Legacy': {
    name: 'Legacy',
    icon: Star,
    color: 'bg-gold-100 text-gold-800 border-gold-300',
    description: 'Empresas de grande porte'
  }
};

export function CompanyBadge({ 
  classification, 
  size = 'md', 
  showLabel = true,
  className 
}: CompanyBadgeProps) {
  if (!classification || !badgeConfig[classification as keyof typeof badgeConfig]) {
    return null;
  }

  const config = badgeConfig[classification as keyof typeof badgeConfig];
  const IconComponent = config.icon;
  
  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-xs px-2 py-1',
    lg: 'text-sm px-2.5 py-1.5'
  };

  const iconSizes = {
    sm: 10,
    md: 12,
    lg: 14
  };

  return (
    <Badge 
      variant="outline" 
      className={cn(
        config.color,
        sizeClasses[size],
        'flex items-center gap-1 font-medium',
        className
      )}
      title={config.description}
    >
      <IconComponent size={iconSizes[size]} />
      {showLabel && config.name}
    </Badge>
  );
}
