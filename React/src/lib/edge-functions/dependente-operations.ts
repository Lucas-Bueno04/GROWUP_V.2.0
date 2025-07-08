
import { callEdgeFunction, EDGE_FUNCTION_URL, processEdgeFunctionResponse, handleEdgeFunctionError, EdgeResponseBase } from "./utils";

interface DependenteResponse extends EdgeResponseBase {
  data?: any;
}

/**
 * Envia solicitação para a edge function para criar um usuário dependente
 */
export async function createDependenteUser(
  userData: {
    email: string;
    nome: string;
    mentoradoId: string;
    cargo?: string;
    tipoDependente?: "mentoria" | "operacional";
    permissionLevel: string;
  }
): Promise<DependenteResponse> {
  try {
    console.log("Enviando solicitação para criar dependente:", userData);
    
    const response = await fetch(EDGE_FUNCTION_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        operation: "createDependenteUser",
        userData: {
          ...userData,
          tipo_dependente: userData.tipoDependente, // Mapeando para o campo correto no backend
          status: "pendente_aprovacao", // Status inicial pendente
          sendEmail: false // Não enviar email automaticamente
        },
      }),
    });

    console.log("Status da resposta:", response.status);
    
    // Verifica se a resposta está vazia
    const responseText = await response.text();
    console.log("Corpo da resposta:", responseText);
    
    let data;
    try {
      // Tenta converter para JSON apenas se houver conteúdo
      data = responseText ? JSON.parse(responseText) : {};
    } catch (e) {
      console.error("Erro ao analisar JSON:", e);
      return {
        success: false,
        message: "Erro ao processar resposta do servidor: formato inválido"
      };
    }

    if (!response.ok) {
      return { 
        success: false, 
        message: data.message || `Erro ${response.status}: ${response.statusText}` 
      };
    }

    return { 
      success: true,
      data
    };
  } catch (error) {
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "Erro desconhecido ao criar usuário dependente" 
    };
  }
}

/**
 * Envia solicitação para a edge function para excluir um dependente
 */
export async function deleteDependente(dependenteId: string): Promise<EdgeResponseBase> {
  return callEdgeFunction("deleteDependente", { dependenteId });
}

/**
 * Envia solicitação para a edge function para listar dependentes pendentes de aprovação
 */
export async function getPendingDependentes(): Promise<DependenteResponse> {
  try {
    const response = await fetch(EDGE_FUNCTION_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        operation: "getPendingDependentes"
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { 
        success: false, 
        message: errorData.message || `Erro ${response.status}: ${response.statusText}` 
      };
    }

    const data = await response.json();
    return { 
      success: true,
      data: data.dependentes || []
    };
  } catch (error) {
    return handleEdgeFunctionError(error);
  }
}

/**
 * Envia solicitação para aprovar um dependente pendente
 */
export async function approveDependente(
  dependenteId: string, 
  permissionLevel: string
): Promise<EdgeResponseBase> {
  return callEdgeFunction("approveDependente", { 
    dependenteId,
    permissionLevel,
    sendEmail: true
  });
}

/**
 * Envia solicitação para rejeitar um dependente pendente
 */
export async function rejectDependente(dependenteId: string): Promise<EdgeResponseBase> {
  return callEdgeFunction("rejectDependente", { dependenteId });
}
