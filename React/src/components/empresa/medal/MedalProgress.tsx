
import React from 'react';
import { cn } from '@/lib/utils';
import { medalConfig } from './medalConfig';

interface MedalProgressProps {
  classification: string;
  nextLevel: string | null;
  nextThreshold: number | null;
  currentRevenue: number;
  size: 'sm' | 'md' | 'lg';
}

export function MedalProgress({ 
  classification, 
  nextLevel, 
  nextThreshold, 
  currentRevenue, 
  size 
}: MedalProgressProps) {
  const config = medalConfig[classification as keyof typeof medalConfig];
  
  const sizeClasses = {
    sm: { progress: 'text-xs', progressBar: 'h-1.5' },
    md: { progress: 'text-xs', progressBar: 'h-2' },
    lg: { progress: 'text-sm', progressBar: 'h-2.5' }
  };

  const sizes = sizeClasses[size];

  const calculateProgress = () => {
    if (!nextThreshold || !currentRevenue) return null;
    const progress = (currentRevenue / nextThreshold) * 100;
    return Math.min(progress, 100);
  };

  const formatCurrency = (value: number) => {
    if (value >= 1000000000) return `R$ ${(value / 1000000000).toFixed(1)}B`;
    if (value >= 1000000) return `R$ ${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `R$ ${(value / 1000).toFixed(0)}K`;
    return `R$ ${value.toFixed(0)}`;
  };

  const progress = calculateProgress();

  if (!nextLevel) {
    return (
      <div className={cn('mt-2 text-center', sizes.progress)}>
        <div 
          className="font-bold text-xs bg-gradient-to-r bg-clip-text text-transparent"
          style={{
            backgroundImage: `linear-gradient(135deg, ${config.colors.primary} 0%, ${config.colors.secondary} 100%)`
          }}
        >
          ⭐ Nível Máximo ⭐
        </div>
      </div>
    );
  }

  if (progress === null) return null;

  return (
    <div className={cn('mt-2 text-center w-full space-y-1', sizes.progress)}>
      {/* Compact next level indicator */}
      <div className="text-muted-foreground">
        <div className="text-xs leading-tight">
          <span className="font-medium">Próximo: </span>
          <span className="font-semibold">{nextLevel}</span>
        </div>
      </div>
      
      {/* Compact progress bar */}
      <div className="relative w-full bg-gray-200 rounded-full overflow-hidden h-1.5">
        <div 
          className="h-full rounded-full transition-all duration-500 ease-out relative overflow-hidden"
          style={{ 
            width: `${progress}%`,
            background: `linear-gradient(90deg, ${config.colors.primary} 0%, ${config.colors.secondary} 100%)`,
            boxShadow: `inset 0 1px 2px rgba(255,255,255,0.3), 0 1px 3px ${config.colors.shadow}`
          }}
        >
          {/* Progress bar shine effect */}
          {progress > 0 && (
            <div 
              className="absolute inset-0 opacity-40 animate-pulse"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)',
                animationDuration: '2s'
              }}
            />
          )}
        </div>
      </div>
      
      {/* Compact current vs target values */}
      <div className="text-muted-foreground flex justify-between items-center text-xs">
        <span>{formatCurrency(currentRevenue)}</span>
        <span className="font-medium" style={{ color: config.colors.primary }}>
          {progress.toFixed(1)}%
        </span>
        <span>{formatCurrency(nextThreshold)}</span>
      </div>
    </div>
  );
}
