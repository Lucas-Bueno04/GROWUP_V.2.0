
import { Card, CardContent } from "@/components/ui/card";
import { BadgeDollarSign, CreditCard, Wallet } from "lucide-react";

type FinanceiroTabProps = {
  mentoradoId?: string;
};

export function FinanceiroTab({ mentoradoId }: FinanceiroTabProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-6">Informações Financeiras</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-slate-800 text-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Wallet className="h-5 w-5" />
                <h4 className="font-medium">Receita Total</h4>
              </div>
              <p className="text-2xl font-bold mt-2">R$ 0,00</p>
              <p className="text-xs text-gray-300 mt-1">Nenhuma receita registrada</p>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800 text-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5" />
                <h4 className="font-medium">Despesas</h4>
              </div>
              <p className="text-2xl font-bold mt-2">R$ 0,00</p>
              <p className="text-xs text-gray-300 mt-1">Nenhuma despesa registrada</p>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800 text-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <BadgeDollarSign className="h-5 w-5" />
                <h4 className="font-medium">Balanço</h4>
              </div>
              <p className="text-2xl font-bold mt-2">R$ 0,00</p>
              <p className="text-xs text-gray-300 mt-1">Saldo neutro</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="border-t border-gray-200 pt-4 mt-4">
          <h4 className="font-medium mb-4">Transações Recentes</h4>
          <div className="text-center text-gray-500 py-8">
            <p>Nenhuma transação registrada para este mentorado.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
