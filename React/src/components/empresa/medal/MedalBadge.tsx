
import React from 'react';
import { cn } from '@/lib/utils';
import { medalConfig } from './medalConfig';

interface MedalBadgeProps {
  classification: string;
  customImageUrl?: string | null;
  size: 'sm' | 'md' | 'lg';
}

export function MedalBadge({ classification, customImageUrl, size }: MedalBadgeProps) {
  const config = medalConfig[classification as keyof typeof medalConfig];
  const IconComponent = config.icon;
  
  const sizeClasses = {
    sm: { badge: 'w-14 h-14', icon: 18 },
    md: { badge: 'w-18 h-18', icon: 22 },
    lg: { badge: 'w-22 h-22', icon: 26 }
  };

  const sizes = sizeClasses[size];

  return (
    <div 
      className={cn(
        'relative flex items-center justify-center rounded-full border-3 shadow-xl transform transition-all duration-300 hover:scale-110 hover:shadow-2xl',
        sizes.badge
      )}
      style={{
        background: config.colors.background,
        borderColor: config.colors.border,
        boxShadow: `0 8px 25px ${config.colors.shadow}, 0 3px 10px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.6), inset 0 -1px 0 rgba(0,0,0,0.1)`
      }}
      title={config.description}
    >
      {/* Custom image or icon with sophisticated styling */}
      {customImageUrl ? (
        <div className="relative z-10 flex items-center justify-center rounded-full overflow-hidden w-full h-full p-1">
          <img 
            src={customImageUrl} 
            alt={config.name}
            className="w-full h-full object-cover rounded-full"
            onError={(e) => {
              // Fallback to icon if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.nextElementSibling?.classList.remove('hidden');
            }}
          />
          <div className="hidden">
            <div 
              className="flex items-center justify-center rounded-full p-2"
              style={{
                background: `linear-gradient(135deg, ${config.colors.primary} 0%, ${config.colors.secondary} 100%)`,
                boxShadow: `inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.2)`
              }}
            >
              <IconComponent 
                size={sizes.icon} 
                className="text-white drop-shadow-sm" 
              />
            </div>
          </div>
        </div>
      ) : (
        <div 
          className="relative z-10 flex items-center justify-center rounded-full p-2"
          style={{
            background: `linear-gradient(135deg, ${config.colors.primary} 0%, ${config.colors.secondary} 100%)`,
            boxShadow: `inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.2)`
          }}
        >
          <IconComponent 
            size={sizes.icon} 
            className="text-white drop-shadow-sm" 
          />
        </div>
      )}
      
      {/* Subtle outer ring effect */}
      <div 
        className="absolute inset-0 rounded-full border-2 opacity-20 animate-pulse"
        style={{
          borderColor: config.colors.primary,
          animationDuration: '3s'
        }}
      />
      
      {/* Inner highlight */}
      <div 
        className="absolute inset-2 rounded-full opacity-30"
        style={{
          background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8) 0%, transparent 50%)'
        }}
      />
    </div>
  );
}
