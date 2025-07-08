
import { callEdgeFunction, EdgeResponseBase } from "./utils";

/**
 * Envia solicitação para a edge function resetar a senha do usuário
 */
export async function resetUserPassword(email: string): Promise<EdgeResponseBase> {
  return callEdgeFunction("resetPassword", { data: { email } });
}

/**
 * Envia solicitação para a edge function bloquear um usuário
 */
export async function blockUser(userId: string): Promise<EdgeResponseBase> {
  return callEdgeFunction("blockUser", { userId });
}

/**
 * Envia solicitação para a edge function desbloquear um usuário
 */
export async function unblockUser(userId: string): Promise<EdgeResponseBase> {
  return callEdgeFunction("unblockUser", { userId });
}

/**
 * Função para alternar o estado de bloqueio de um usuário (block/unblock)
 */
export async function toggleUserBlock(userId: string, block: boolean): Promise<EdgeResponseBase> {
  if (block) {
    return blockUser(userId);
  } else {
    return unblockUser(userId);
  }
}

/**
 * Envia solicitação para a edge function excluir um usuário
 */
export async function deleteUser(userId: string): Promise<EdgeResponseBase> {
  return callEdgeFunction("deleteUser", { userId });
}

/**
 * Envia solicitação para a edge function para verificar senha do administrador
 */
export async function verifyAdminPassword(userId: string, password: string): Promise<EdgeResponseBase> {
  return callEdgeFunction("verifyAdminPassword", { userId, password });
}
