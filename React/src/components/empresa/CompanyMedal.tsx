
import React from 'react';
import { cn } from '@/lib/utils';
import { medalConfig, sizeClasses } from './medal/medalConfig';
import { useClassificationImage, useNextLevelInfo } from './medal/useMedalData';
import { MedalBadge } from './medal/MedalBadge';
import { MedalProgress } from './medal/MedalProgress';

interface CompanyMedalProps {
  classification?: string;
  size?: 'sm' | 'md' | 'lg';
  showProgress?: boolean;
  currentRevenue?: number;
  className?: string;
}

export function CompanyMedal({ 
  classification, 
  size = 'md', 
  showProgress = true,
  currentRevenue = 0,
  className 
}: CompanyMedalProps) {
  const { data: customImageUrl } = useClassificationImage(classification);
  const { data: nextLevelInfo } = useNextLevelInfo(classification);
  
  if (!classification || !medalConfig[classification as keyof typeof medalConfig]) {
    return null;
  }

  const config = medalConfig[classification as keyof typeof medalConfig];
  const sizes = sizeClasses[size];

  return (
    <div className={cn('flex flex-col items-center', sizes.container, className)}>
      {/* Sophisticated Badge */}
      <MedalBadge 
        classification={classification}
        customImageUrl={customImageUrl}
        size={size}
      />

      {/* Classification name with sophisticated typography */}
      <div className={cn('font-bold text-center mt-2 leading-tight tracking-wide', sizes.text)}>
        <span 
          className="bg-gradient-to-r bg-clip-text text-transparent font-semibold"
          style={{
            backgroundImage: `linear-gradient(135deg, ${config.colors.primary} 0%, ${config.colors.secondary} 100%)`
          }}
        >
          {config.name}
        </span>
      </div>

      {/* Progress indicator */}
      {showProgress && (
        <MedalProgress
          classification={classification}
          nextLevel={nextLevelInfo?.nextLevel || null}
          nextThreshold={nextLevelInfo?.nextThreshold || null}
          currentRevenue={currentRevenue}
          size={size}
        />
      )}
    </div>
  );
}
