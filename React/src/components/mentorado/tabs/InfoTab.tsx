
import { Card, CardContent } from "@/components/ui/card";
import { Mentorado } from "@/types/mentorado";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type InfoTabProps = {
  mentorado: Mentorado;
};

export function InfoTab({ mentorado }: InfoTabProps) {
  return (
    <Card>
      <CardContent className="p-6 space-y-6 bg-slate-800 text-white rounded-md">
        <div>
          <h3 className="text-lg font-semibold mb-4">Alertas e Lembretes</h3>
          <div className="flex space-x-4 mb-2">
            <label className="flex items-center gap-1">
              <input type="checkbox" checked readOnly />
              <span>Aniversários</span>
            </label>
            <label className="flex items-center gap-1">
              <input type="checkbox" checked readOnly />
              <span>Pagamentos</span>
            </label>
            <label className="flex items-center gap-1">
              <input type="checkbox" checked readOnly />
              <span>Inatividade</span>
            </label>
            <label className="flex items-center gap-1">
              <input type="checkbox" checked readOnly />
              <span>Metas</span>
            </label>
          </div>
          
          <p className="text-sm text-gray-300 mt-4">
            Nenhum alerta ou lembrete para este mentorado
          </p>
          
          <div className="mt-4">
            <h4 className="font-medium mb-2">Como funcionam os alertas?</h4>
            <ul className="text-sm list-disc ml-5">
              <li><strong>Aniversários:</strong> Exibe alertas quando o aniversário do mentorado está a 3 dias ou menos de distância.</li>
              <li><strong>Pagamentos:</strong> Exibe alertas para parcelas que venceram ou vencerão nos próximos 7 dias.</li>
              <li><strong>Inatividade:</strong> Mostra alertas quando o mentorado está há 15 dias ou mais sem acessar a plataforma.</li>
              <li><strong>Metas:</strong> Mostra alertas para metas que estão próximas do prazo ou atrasadas.</li>
            </ul>
            <p className="text-sm mt-2">Alertas de alta prioridade geram notificações automáticas para o mentorado no sistema.</p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Informações Pessoais</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-300">Nome</Label>
              <Input 
                value={mentorado.nome} 
                readOnly 
                className="bg-slate-700 border-slate-600"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">CPF</Label>
              <Input 
                value={mentorado.cpf} 
                readOnly 
                disabled
                className="bg-slate-700 border-slate-600 cursor-not-allowed"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Email</Label>
              <Input 
                value={mentorado.email} 
                readOnly 
                className="bg-slate-700 border-slate-600"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Telefone</Label>
              <Input 
                value={mentorado.telefone} 
                readOnly 
                className="bg-slate-700 border-slate-600"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Data de Nascimento</Label>
              <Input 
                value={mentorado.dataNascimento} 
                readOnly 
                className="bg-slate-700 border-slate-600"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Status</Label>
              <Input 
                value={mentorado.status} 
                readOnly 
                className="bg-slate-700 border-slate-600 text-green-400 font-medium"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
