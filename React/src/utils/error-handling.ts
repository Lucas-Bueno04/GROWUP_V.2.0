
/**
 * Standardized error handling utilities for consistent error management across the application
 */

export interface AppError {
  message: string;
  code?: string;
  originalError?: unknown;
  context?: Record<string, any>;
}

/**
 * Normalizes any error type into our standard AppError format
 * This ensures consistent error handling throughout the application
 */
export function normalizeError(error: unknown, defaultMessage = "Ocorreu um erro desconhecido"): AppError {
  // Error instance handling
  if (error instanceof Error) {
    return {
      message: error.message || defaultMessage,
      originalError: error,
      // Extract PostgreSQL error code if available
      code: (error as any).code,
    };
  }
  
  // Handle string errors
  if (typeof error === 'string') {
    return {
      message: error || defaultMessage,
      originalError: error,
    };
  }
  
  // Handle object-like errors (e.g. from Supabase)
  if (error && typeof error === 'object') {
    const objError = error as Record<string, any>;
    
    // Handle Supabase error format
    if (objError.message || objError.error_description) {
      return {
        message: objError.message || objError.error_description || defaultMessage,
        code: objError.code,
        originalError: error,
      };
    }
  }
  
  // Default case for completely unknown errors
  return {
    message: defaultMessage,
    originalError: error,
  };
}

/**
 * Logs an error with consistent formatting
 */
export function logError(error: unknown, context?: string): AppError {
  const normalizedError = normalizeError(error);
  
  console.error(
    `[${context || 'ERROR'}]`, 
    normalizedError.message,
    { 
      code: normalizedError.code,
      originalError: normalizedError.originalError
    }
  );
  
  return normalizedError;
}
