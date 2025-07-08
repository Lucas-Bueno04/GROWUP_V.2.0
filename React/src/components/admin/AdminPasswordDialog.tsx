
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Shield, AlertTriangle } from "lucide-react";
import { verifyUserPasswordIsolated, checkRateLimit, logSecurityEvent, SAFE_ERROR_MESSAGES } from "@/utils/security";
import { useAuth } from "@/hooks/useAuth";

interface AdminPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (password: string) => Promise<void>;
  title: string;
  description: string;
}

export function AdminPasswordDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  description
}: AdminPasswordDialogProps) {
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const { user } = useAuth();

  const handleConfirm = async () => {
    if (!password || !user?.email) {
      setError('Senha é obrigatória');
      return;
    }

    // Check rate limiting
    const rateLimitKey = `admin_password_${user.id}`;
    if (!checkRateLimit(rateLimitKey, 3, 15 * 60 * 1000)) {
      setError(SAFE_ERROR_MESSAGES.RATE_LIMITED);
      logSecurityEvent('ADMIN_PASSWORD_RATE_LIMITED', { 
        userId: user.id, 
        email: user.email,
        attempts: attempts + 1
      });
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      logSecurityEvent('ADMIN_PASSWORD_VERIFICATION_ATTEMPT', { 
        userId: user.id, 
        email: user.email,
        attempts: attempts + 1
      });

      // Use isolated password verification to avoid session conflicts
      const isValid = await verifyUserPasswordIsolated(user.email, password);
      
      if (!isValid) {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        setError(SAFE_ERROR_MESSAGES.INVALID_CREDENTIALS);
        
        logSecurityEvent('ADMIN_PASSWORD_VERIFICATION_FAILED', { 
          userId: user.id, 
          email: user.email,
          attempts: newAttempts
        });
        
        setPassword("");
        return;
      }

      logSecurityEvent('ADMIN_PASSWORD_VERIFICATION_SUCCESS', { 
        userId: user.id, 
        email: user.email
      });

      // Password verified, proceed with original function
      await onConfirm(password);
      
      // Reset state
      setPassword("");
      setError(null);
      setAttempts(0);

    } catch (error) {
      console.error('Error in admin password verification:', error);
      setError(SAFE_ERROR_MESSAGES.SERVER_ERROR);
      
      logSecurityEvent('ADMIN_PASSWORD_VERIFICATION_ERROR', { 
        userId: user.id, 
        email: user.email,
        error
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setPassword("");
      setError(null);
      setAttempts(0);
    }
    onOpenChange(newOpen);
  };

  const maxAttempts = 3;
  const attemptsRemaining = maxAttempts - attempts;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-orange-600" />
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {attempts > 0 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Tentativas restantes: {attemptsRemaining}
                {attemptsRemaining === 1 && " (Última tentativa!)"}
              </AlertDescription>
            </Alert>
          )}

          <div className="grid gap-2">
            <Label htmlFor="admin-password">Senha de administrador</Label>
            <Input
              id="admin-password"
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(null);
              }}
              autoComplete="current-password"
              disabled={isSubmitting}
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirm}
            disabled={!password || isSubmitting || attempts >= maxAttempts}
            variant="destructive"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verificando...
              </>
            ) : (
              "Confirmar"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
