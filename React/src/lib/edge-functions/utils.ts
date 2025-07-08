
/**
 * Utility functions for edge function calls
 */

export const EDGE_FUNCTION_URL = "https://rzjdkpnklhlkabkephsx.supabase.co/functions/v1/admin-operations";

export interface EdgeResponseBase {
  success: boolean;
  message?: string;
}

/**
 * Standard error handler for edge function calls
 */
export const handleEdgeFunctionError = (error: unknown): EdgeResponseBase => {
  console.error("Edge function error:", error);
  return { 
    success: false, 
    message: error instanceof Error ? error.message : "Erro desconhecido na comunicação com o servidor" 
  };
};

/**
 * Process response from an edge function
 */
export const processEdgeFunctionResponse = async (response: Response): Promise<EdgeResponseBase> => {
  if (!response.ok) {
    let errorMessage: string;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || `Erro ${response.status}: ${response.statusText}`;
    } catch (e) {
      errorMessage = `Erro ${response.status}: ${response.statusText}`;
    }
    return { success: false, message: errorMessage };
  }
  
  return { success: true };
};

/**
 * Base function to call an edge function
 */
export const callEdgeFunction = async (
  operation: string, 
  data: Record<string, any>
): Promise<EdgeResponseBase> => {
  try {
    const response = await fetch(EDGE_FUNCTION_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        operation,
        ...data
      }),
    });

    return processEdgeFunctionResponse(response);
  } catch (error) {
    return handleEdgeFunctionError(error);
  }
};
