
import { callEdgeFunction, EdgeResponseBase } from "./utils";

/**
 * Envia solicitação para a edge function excluir um mentorado e seu usuário associado
 */
export async function deleteMentorado(mentoradoId: string): Promise<EdgeResponseBase> {
  return callEdgeFunction("deleteMentorado", { mentoradoId });
}
