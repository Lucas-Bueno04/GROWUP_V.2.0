
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface EmpresaActionFooterProps {
  showActions: boolean;
  onDecline: () => void;
  onAuthorize: () => void;
}

export function EmpresaActionFooter({ 
  showActions, 
  onDecline, 
  onAuthorize 
}: EmpresaActionFooterProps) {
  if (!showActions) return null;
  
  return (
    <>
      <Separator className="my-4" />
      <div className="flex justify-between flex-col sm:flex-row gap-2">
        <Button onClick={onDecline} variant="destructive">
          Recusar Solicitação
        </Button>
        <Button 
          className="bg-green-600 hover:bg-green-700"
          onClick={onAuthorize}
        >
          Autorizar Empresa
        </Button>
      </div>
    </>
  );
}
