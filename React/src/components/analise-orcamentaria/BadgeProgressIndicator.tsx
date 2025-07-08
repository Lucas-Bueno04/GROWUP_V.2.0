
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { TrendingUp } from 'lucide-react';

interface BadgeProgressIndicatorProps {
  currentRevenue: number;
  nextThreshold: number | null;
  nextLevel: string | null;
  className?: string;
}

export function BadgeProgressIndicator({
  currentRevenue,
  nextThreshold,
  nextLevel,
  className
}: BadgeProgressIndicatorProps) {
  if (!nextThreshold || !nextLevel) {
    return (
      <div className={`text-center ${className}`}>
        <div className="flex items-center justify-center gap-2 text-sm font-bold text-yellow-600">
          <TrendingUp className="h-4 w-4" />
          <span>Nível Máximo Alcançado</span>
        </div>
      </div>
    );
  }

  const progress = Math.min((currentRevenue / nextThreshold) * 100, 100);

  const formatCurrency = (value: number) => {
    if (value >= 1000000000) return `R$ ${(value / 1000000000).toFixed(1)}B`;
    if (value >= 1000000) return `R$ ${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `R$ ${(value / 1000).toFixed(0)}K`;
    return `R$ ${value.toFixed(0)}`;
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Próximo nível: {nextLevel}</span>
        <span className="font-medium">{progress.toFixed(1)}%</span>
      </div>
      
      <Progress value={progress} className="h-2" />
      
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{formatCurrency(currentRevenue)}</span>
        <span>{formatCurrency(nextThreshold)}</span>
      </div>
    </div>
  );
}
