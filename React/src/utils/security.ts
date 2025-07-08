
/**
 * Security utilities for input validation, sanitization, and secure operations
 */

import { supabase } from "@/lib/supabase";

// Input validation patterns
export const VALIDATION_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  cnpj: /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$|^\d{14}$/,
  cpf: /^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/,
  phone: /^[\+]?[1-9][\d]{0,15}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  name: /^[a-zA-ZÀ-ÿ\s]{2,50}$/,
  numeric: /^\d+(\.\d{1,2})?$/,
  alphanumeric: /^[a-zA-Z0-9\s]+$/
};

// Rate limiting store (in-memory for demo, use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

/**
 * Validates input against a specific pattern
 */
export function validateInput(value: string, type: keyof typeof VALIDATION_PATTERNS): boolean {
  if (!value || typeof value !== 'string') return false;
  return VALIDATION_PATTERNS[type].test(value.trim());
}

/**
 * Sanitizes input by removing potentially dangerous characters
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .substring(0, 1000); // Limit length
}

/**
 * Rate limiting implementation
 */
export function checkRateLimit(identifier: string, maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);
  
  if (!record || now > record.resetTime) {
    rateLimitStore.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (record.count >= maxAttempts) {
    return false;
  }
  
  record.count++;
  return true;
}

/**
 * Validates API key format (basic check)
 */
export function validateApiKey(apiKey: string): boolean {
  if (!apiKey || typeof apiKey !== 'string') return false;
  
  // Basic validation - should be alphanumeric with possible special chars
  const isValidFormat = /^[a-zA-Z0-9_-]{10,100}$/.test(apiKey.trim());
  const hasMinLength = apiKey.trim().length >= 10;
  
  return isValidFormat && hasMinLength;
}

/**
 * ISOLATED Secure password verification - ONLY for admin operations
 * This function creates a separate auth context to avoid interfering with main login
 */
export async function verifyUserPasswordIsolated(email: string, password: string): Promise<boolean> {
  try {
    console.log("=== ISOLATED PASSWORD VERIFICATION START ===");
    
    // Input validation
    if (!validateInput(email, 'email') || !password) {
      console.error('Invalid email or password format');
      return false;
    }
    
    // Rate limiting
    const rateLimitKey = `admin_password_verify_${email}`;
    if (!checkRateLimit(rateLimitKey, 3, 15 * 60 * 1000)) {
      console.error('Rate limit exceeded for password verification');
      return false;
    }
    
    // Create a separate Supabase client instance for this verification
    // This prevents interference with the main auth session
    const { createClient } = await import('@supabase/supabase-js');
    const supabaseUrl = 'https://rzjdkpnklhlkabkephsx.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6amRrcG5rbGhsa2Fia2VwaHN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyNjc2MzgsImV4cCI6MjA2Mjg0MzYzOH0.df_9FpvD1fAhugSLyNNq0FDsKQ1j1oRCYa3h3w_J8hM';
    
    const isolatedSupabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        storage: {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {}
        },
        persistSession: false,
        autoRefreshToken: false,
      },
    });
    
    console.log("Using isolated Supabase client for password verification");
    
    // Use the isolated client for password verification
    const { data, error } = await isolatedSupabase.auth.signInWithPassword({
      email: sanitizeInput(email),
      password: password // Don't sanitize passwords, they need exact match
    });
    
    if (error) {
      console.error('Password verification failed:', error.message);
      return false;
    }
    
    // Immediately sign out from the isolated session
    if (data.session) {
      console.log("Signing out from isolated verification session");
      await isolatedSupabase.auth.signOut();
    }
    
    console.log("=== PASSWORD VERIFICATION SUCCESSFUL ===");
    return true;
    
  } catch (error) {
    console.error('Error in isolated password verification:', error);
    return false;
  }
}

/**
 * Backwards compatibility - delegate to isolated function
 * @deprecated Use verifyUserPasswordIsolated for new implementations
 */
export async function verifyUserPassword(email: string, password: string): Promise<boolean> {
  console.warn("verifyUserPassword is deprecated, using isolated version");
  return verifyUserPasswordIsolated(email, password);
}

/**
 * Validates UUID format
 */
export function isValidUUID(uuid: string): boolean {
  return validateInput(uuid, 'uuid');
}

/**
 * Validates email format
 */
export function isValidEmail(email: string): boolean {
  return validateInput(email, 'email');
}

/**
 * Validates CNPJ format (with or without formatting)
 */
export function isValidCNPJ(cnpj: string): boolean {
  return validateInput(cnpj, 'cnpj');
}

/**
 * Formats CNPJ for display
 */
export function formatCNPJ(cnpj: string): string {
  const numbers = cnpj.replace(/\D/g, '');
  if (numbers.length !== 14) return cnpj;
  
  return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}

/**
 * Removes CNPJ formatting for API calls
 */
export function cleanCNPJ(cnpj: string): string {
  return cnpj.replace(/\D/g, '');
}

/**
 * Security headers for API responses
 */
export const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Content-Security-Policy': "default-src 'self'",
};

/**
 * Error messages that don't reveal sensitive information
 */
export const SAFE_ERROR_MESSAGES = {
  INVALID_INPUT: 'Os dados fornecidos são inválidos.',
  UNAUTHORIZED: 'Você não tem permissão para realizar esta ação.',
  RATE_LIMITED: 'Muitas tentativas. Tente novamente em alguns minutos.',
  SERVER_ERROR: 'Ocorreu um erro interno. Tente novamente mais tarde.',
  INVALID_CREDENTIALS: 'Credenciais inválidas.',
  RESOURCE_NOT_FOUND: 'Recurso não encontrado.',
  OPERATION_FAILED: 'Não foi possível completar a operação.',
};

/**
 * Logs security events for monitoring
 */
export function logSecurityEvent(event: string, details: Record<string, any>) {
  console.warn(`[SECURITY] ${event}:`, {
    timestamp: new Date().toISOString(),
    ...details
  });
  
  // In production, send to monitoring service
  // Example: sendToMonitoring({ event, details, timestamp: new Date() });
}
