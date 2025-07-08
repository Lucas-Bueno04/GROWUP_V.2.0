
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function FinanceiroTab() {
  return (
    <Card>
      <CardContent className="p-6 bg-slate-800 text-white rounded-md">
        <div>
          <h3 className="text-lg font-semibold mb-4">Gestão Financeira do Mentorado</h3>
          <p className="mb-4">Esta área permite:</p>
          <ul className="list-disc ml-5 space-y-1 mb-4">
            <li>Visualizar e gerenciar informações financeiras do mentorado</li>
            <li>Registrar pagamentos e parcelas</li>
            <li>Atribuir produtos/pacotes adquiridos</li>
            <li>Definir datas importantes como início e vencimento</li>
          </ul>
          <p className="text-sm bg-blue-900/50 p-3 rounded-md">
            <strong>Importante:</strong> Os pacotes e produtos disponíveis são configurados na seção "Configuração do Sistema" e então atribuídos aos mentorados nesta tela.
          </p>
        </div>

        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Dados Financeiros</h3>
            <Button variant="outline" size="sm">Atualizar Dados</Button>
          </div>
          <p className="text-gray-300 text-center py-8">Nenhum dado financeiro encontrado</p>
        </div>
      </CardContent>
    </Card>
  );
}
