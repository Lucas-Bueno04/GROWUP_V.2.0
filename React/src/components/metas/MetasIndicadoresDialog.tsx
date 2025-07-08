
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MetaIndicadorForm } from './forms/MetaIndicadorForm';
import { useToast } from '@/hooks/use-toast';

interface MetasIndicadoresDialogProps {
  trigger: React.ReactNode;
  empresaId?: string | null;
}

export function MetasIndicadoresDialog({ trigger, empresaId }: MetasIndicadoresDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedIndicador, setSelectedIndicador] = useState('');
  const [tipoMeta, setTipoMeta] = useState<'mensal' | 'anual'>('mensal');
  const [tipoValor, setTipoValor] = useState<'valor' | 'percentual'>('valor');
  const [ano, setAno] = useState(new Date().getFullYear());
  const [mes, setMes] = useState(new Date().getMonth() + 1);
  const [valorMeta, setValorMeta] = useState('');
  const [descricao, setDescricao] = useState('');
  const [replicarTodosMeses, setReplicarTodosMeses] = useState(false);
  const { toast } = useToast();

  const resetForm = () => {
    setSelectedIndicador('');
    setTipoMeta('mensal');
    setTipoValor('valor');
    setAno(new Date().getFullYear());
    setMes(new Date().getMonth() + 1);
    setValorMeta('');
    setDescricao('');
    setReplicarTodosMeses(false);
  };

  const handleSuccess = () => {
    toast({
      title: "Meta criada",
      description: "Meta criada com sucesso!"
    });
    resetForm();
    setOpen(false);
  };

  const handleCancel = () => {
    resetForm();
    setOpen(false);
  };

  if (!empresaId) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nova Meta de Indicador</DialogTitle>
        </DialogHeader>
        
        <MetaIndicadorForm
          selectedIndicador={selectedIndicador}
          setSelectedIndicador={setSelectedIndicador}
          tipoMeta={tipoMeta}
          setTipoMeta={setTipoMeta}
          tipoValor={tipoValor}
          setTipoValor={setTipoValor}
          ano={ano}
          setAno={setAno}
          mes={mes}
          setMes={setMes}
          valorMeta={valorMeta}
          setValorMeta={setValorMeta}
          descricao={descricao}
          setDescricao={setDescricao}
          replicarTodosMeses={replicarTodosMeses}
          setReplicarTodosMeses={setReplicarTodosMeses}
          empresaId={empresaId}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
}
