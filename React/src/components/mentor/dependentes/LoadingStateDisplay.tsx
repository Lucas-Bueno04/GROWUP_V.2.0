
import { Loader2 } from "lucide-react";

export function LoadingStateDisplay() {
  return (
    <div className="flex justify-center items-center p-8">
      <Loader2 className="h-8 w-8 animate-spin mr-2" />
      <span>Carregando solicitações pendentes...</span>
    </div>
  );
}
