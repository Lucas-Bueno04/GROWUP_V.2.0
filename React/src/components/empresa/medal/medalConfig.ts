
import { Sprout, Baby, TrendingUp, Crown, Star } from 'lucide-react';

export const medalConfig = {
  'Newborn': {
    name: 'Newborn',
    icon: Sprout,
    colors: {
      primary: '#22c55e', // Green-500
      secondary: '#16a34a', // Green-600
      background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', // Green gradient
      border: '#22c55e',
      shadow: 'rgba(34, 197, 94, 0.3)'
    },
    description: 'Empresas em fase inicial'
  },
  'Early Walker': {
    name: 'Early Walker',
    icon: Baby,
    colors: {
      primary: '#3b82f6', // Blue-500
      secondary: '#2563eb', // Blue-600
      background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', // Blue gradient
      border: '#3b82f6',
      shadow: 'rgba(59, 130, 246, 0.3)'
    },
    description: 'Pequenas empresas em crescimento'
  },
  'Scaler': {
    name: 'Scaler',
    icon: TrendingUp,
    colors: {
      primary: '#f59e0b', // Amber-500
      secondary: '#d97706', // Amber-600
      background: 'linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%)', // Amber gradient
      border: '#f59e0b',
      shadow: 'rgba(245, 158, 11, 0.3)'
    },
    description: 'Médias empresas em expansão'
  },
  'Authority': {
    name: 'Authority',
    icon: Crown,
    colors: {
      primary: '#8b5cf6', // Violet-500
      secondary: '#7c3aed', // Violet-600
      background: 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)', // Violet gradient
      border: '#8b5cf6',
      shadow: 'rgba(139, 92, 246, 0.3)'
    },
    description: 'Grandes empresas consolidadas'
  },
  'Legacy': {
    name: 'Legacy',
    icon: Star,
    colors: {
      primary: '#dc2626', // Red-600
      secondary: '#b91c1c', // Red-700
      background: 'linear-gradient(135deg, #fecaca 0%, #fca5a5 100%)', // Red gradient
      border: '#dc2626',
      shadow: 'rgba(220, 38, 38, 0.3)'
    },
    description: 'Empresas de grande porte'
  }
};

export const sizeClasses = {
  sm: {
    container: 'w-20 h-auto min-h-24',
    badge: 'w-14 h-14',
    icon: 18,
    text: 'text-xs',
    progress: 'text-xs',
    progressBar: 'h-1.5'
  },
  md: {
    container: 'w-24 h-auto min-h-28',
    badge: 'w-18 h-18',
    icon: 22,
    text: 'text-sm',
    progress: 'text-xs',
    progressBar: 'h-2'
  },
  lg: {
    container: 'w-28 h-auto min-h-32',
    badge: 'w-22 h-22',
    icon: 26,
    text: 'text-base',
    progress: 'text-sm',
    progressBar: 'h-2.5'
  }
};
