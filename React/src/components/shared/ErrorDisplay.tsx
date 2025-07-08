
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";
import { AppError } from '@/utils/error-handling';

interface ErrorDisplayProps {
  error: AppError | null | unknown;
  onRetry?: () => void;
  title?: string;
  showIcon?: boolean;
  variant?: "default" | "destructive";
  className?: string;
}

export function ErrorDisplay({ 
  error, 
  onRetry, 
  title = "Erro", 
  showIcon = true,
  variant = "destructive",
  className = ""
}: ErrorDisplayProps) {
  // If no error, don't render anything
  if (!error) return null;
  
  // Normalize the error to our standard format
  const normalizedError = typeof error === 'object' && error && 'message' in error 
    ? error as AppError
    : { message: error instanceof Error ? error.message : "Ocorreu um erro desconhecido" };
  
  return (
    <Alert variant={variant} className={`mt-4 ${className}`}>
      {showIcon && <AlertCircle className="h-4 w-4" />}
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="mt-2">
        <div className="text-sm">{normalizedError.message}</div>
        
        {onRetry && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRetry} 
            className="mt-2 flex items-center gap-1"
          >
            <RefreshCw className="h-3 w-3" />
            <span>Tentar novamente</span>
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}
