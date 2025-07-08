
import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Trash2, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import type { OrcamentoEmpresa } from '@/hooks/useOrcamentoEmpresas';

interface DeleteOrcamentoConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orcamento: OrcamentoEmpresa;
  onConfirm: () => Promise<void>;
}

export function DeleteOrcamentoConfirmationDialog({
  open,
  onOpenChange,
  orcamento,
  onConfirm
}: DeleteOrcamentoConfirmationDialogProps) {
  const [password, setPassword] = useState('');
  const [confirmationText, setConfirmationText] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const expectedConfirmation = `EXCLUIR ${orcamento.nome}`;
  const isConfirmationValid = confirmationText === expectedConfirmation;
  const canProceed = password.length > 0 && isConfirmationValid && !isVerifying;

  const handleConfirm = async () => {
    if (!password || !user?.email || !isConfirmationValid) {
      setError('Preencha todos os campos corretamente');
      return;
    }

    setIsVerifying(true);
    setError(null);

    try {
      // Verificar senha do usuário
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: password,
      });

      if (signInError) {
        setError('Senha incorreta. Verifique e tente novamente.');
        setPassword('');
        return;
      }

      // Senha verificada, prosseguir com a exclusão
      await onConfirm();
      
      // Reset form e fechar dialog
      setPassword('');
      setConfirmationText('');
      setError(null);
      onOpenChange(false);

    } catch (error) {
      console.error('Erro na verificação de senha:', error);
      setError('Erro na verificação. Tente novamente.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setPassword('');
      setConfirmationText('');
      setError(null);
    }
    onOpenChange(newOpen);
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-red-600">
            <Trash2 className="h-5 w-5" />
            Excluir Orçamento Permanentemente
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm space-y-2">
            <div>
              <strong>Atenção:</strong> Esta ação é irreversível e irá excluir permanentemente:
            </div>
            <ul className="list-disc list-inside text-xs space-y-1 text-muted-foreground">
              <li>Orçamento: <strong>{orcamento.nome}</strong></li>
              <li>Todos os valores orçados e realizados</li>
              <li>Valores calculados dos grupos</li>
              <li>Metas vinculadas a este orçamento</li>
            </ul>
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="space-y-4 py-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Esta ação não pode ser desfeita. Todos os dados serão perdidos permanentemente.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label htmlFor="confirmation-text" className="font-medium">
              Digite exatamente: <code className="text-sm bg-gray-100 px-1 rounded">{expectedConfirmation}</code>
            </Label>
            <Input
              id="confirmation-text"
              type="text"
              placeholder={expectedConfirmation}
              value={confirmationText}
              onChange={(e) => {
                setConfirmationText(e.target.value);
                setError(null);
              }}
              disabled={isVerifying}
              className="font-mono"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="font-medium">
              Confirme sua senha para prosseguir
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Digite sua senha atual"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(null);
              }}
              autoComplete="current-password"
              disabled={isVerifying}
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
        
        <AlertDialogFooter className="flex flex-col sm:flex-row gap-2">
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
            disabled={!canProceed}
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
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir Permanentemente
              </>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
