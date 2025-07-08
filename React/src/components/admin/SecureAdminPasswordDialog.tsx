
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
import { useAuth } from "@/hooks/useAuth";
import { verifyUserPasswordIsolated, checkRateLimit, logSecurityEvent, SAFE_ERROR_MESSAGES } from "@/utils/security";

interface SecureAdminPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
  title: string;
  description: string;
  actionType?: string;
}

export function SecureAdminPasswordDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  actionType = 'admin_action'
}: SecureAdminPasswordDialogProps) {
  const [password, setPassword] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const { user } = useAuth();

  const handleConfirm = async () => {
    if (!password || !user?.email) {
      setError('Senha e email são obrigatórios');
      return;
    }

    // Check rate limiting
    const rateLimitKey = `admin_password_${user.id}`;
    if (!checkRateLimit(rateLimitKey, 3, 15 * 60 * 1000)) {
      setError(SAFE_ERROR_MESSAGES.RATE_LIMITED);
      logSecurityEvent('ADMIN_PASSWORD_RATE_LIMITED', { 
        userId: user.id, 
        email: user.email,
        actionType,
        attempts: attempts + 1
      });
      return;
    }

    setIsVerifying(true);
    setError(null);

    try {
      logSecurityEvent('ADMIN_PASSWORD_VERIFICATION_ATTEMPT', { 
        userId: user.id, 
        email: user.email,
        actionType,
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
          actionType,
          attempts: newAttempts
        });
        
        // Clear password on failed attempt
        setPassword("");
        return;
      }

      logSecurityEvent('ADMIN_PASSWORD_VERIFICATION_SUCCESS', { 
        userId: user.id, 
        email: user.email,
        actionType
      });

      // Password verified successfully
      await onConfirm();
      
      // Reset state and close dialog
      setPassword("");
      setError(null);
      setAttempts(0);
      onOpenChange(false);

    } catch (error) {
      console.error('Error in admin password verification:', error);
      setError(SAFE_ERROR_MESSAGES.SERVER_ERROR);
      
      logSecurityEvent('ADMIN_PASSWORD_VERIFICATION_ERROR', { 
        userId: user.id, 
        email: user.email,
        actionType,
        error
      });
    } finally {
      setIsVerifying(false);
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-red-600" />
            {title}
          </DialogTitle>
          <DialogDescription className="text-sm">
            {description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {attempts > 0 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Tentativas restantes: {attemptsRemaining}
                {attemptsRemaining === 1 && " (Última tentativa!)"}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="admin-password" className="font-medium">
              Confirme sua senha de administrador
            </Label>
            <Input
              id="admin-password"
              type="password"
              placeholder="Digite sua senha atual"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(null); // Clear error when typing
              }}
              autoComplete="current-password"
              disabled={isVerifying}
              className="font-mono"
            />
            <p className="text-xs text-muted-foreground">
              Esta é uma operação sensível que requer confirmação de identidade.
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isVerifying}
            className="w-full sm:w-auto"
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirm}
            disabled={!password || isVerifying || attempts >= maxAttempts}
            variant="destructive"
            className="w-full sm:w-auto"
          >
            {isVerifying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verificando...
              </>
            ) : (
              <>
                <Shield className="mr-2 h-4 w-4" />
                Confirmar Ação
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
