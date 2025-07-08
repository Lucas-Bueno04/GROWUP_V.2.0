
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Copy } from 'lucide-react';

interface OrcamentoGridHeaderRowProps {
  meses: string[];
  onReplicateMonth?: (mes: number) => void;
  podeEditar?: boolean;
  tipo?: 'orcado' | 'realizado';
}

export function OrcamentoGridHeaderRow({ 
  meses, 
  onReplicateMonth, 
  podeEditar = false,
  tipo = 'orcado'
}: OrcamentoGridHeaderRowProps) {
  // Show copy buttons when user can edit
  const showCopyButtons = podeEditar;

  return (
    <tr className="border-b border-gray-700 bg-gray-800">
      <th className="sticky left-0 z-30 bg-gray-800 text-left text-gray-200 font-semibold h-12 px-4 border-r border-gray-700 min-w-[320px] max-w-[320px] w-[320px]">
        Conta
      </th>
      {meses.map((mes, index) => {
        const mesNumero = index + 1;
        const isLastMonth = mesNumero === 12;
        
        return (
          <th key={mesNumero} className="text-center text-gray-200 font-medium h-12 px-2 min-w-[120px] w-[120px] relative">
            <div className="flex items-center justify-center gap-1">
              <span>{mes}</span>
              {showCopyButtons && !isLastMonth && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-5 w-5 p-0 bg-blue-600 hover:bg-blue-700 text-white ml-1"
                        onClick={() => onReplicateMonth?.(mesNumero)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Copiar {mes} para meses seguintes</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </th>
        );
      })}
      <th className="sticky right-0 z-30 bg-gray-800 text-center font-semibold text-gray-200 border-l border-gray-700 min-w-[140px] w-[140px] px-2">
        Total
      </th>
    </tr>
  );
}
