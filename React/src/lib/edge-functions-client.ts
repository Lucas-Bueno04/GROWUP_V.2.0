
import { handleEdgeFunctionError } from "./edge-functions/utils";

// Use a hardcoded URL since we already have it in the utils file
// This will be imported from the utils.ts file
import { EDGE_FUNCTION_URL } from "./edge-functions/utils";

/**
 * Base response type for edge functions
 */
export interface EdgeResponseBase {
  success: boolean;
  message?: string;
}

/**
 * Helper function to call an edge function
 * @param operation The name of the edge function to call
 * @param payload The payload to send to the edge function
 */
export async function callEdgeFunction<T extends Record<string, any>>(
  operation: string,
  payload: Record<string, any>
): Promise<T & EdgeResponseBase> {
  try {
    const response = await fetch(EDGE_FUNCTION_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ operation, ...payload }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        message: errorData.message || `Erro ${response.status}: ${response.statusText}`,
      } as T & EdgeResponseBase;
    }

    const data = await response.json();
    return { ...data, success: true } as T & EdgeResponseBase;
  } catch (error) {
    return handleEdgeFunctionError(error) as T & EdgeResponseBase;
  }
}

/**
 * Processes the response from an edge function, handling errors and returning data
 * @param response The response from the edge function
 * @returns The data from the edge function, or null if there was an error
 */
export async function processEdgeFunctionResponse<T>(response: Response): Promise<T | null> {
  if (!response.ok) {
    console.error(`Edge Function Error: ${response.status} - ${response.statusText}`);
    try {
      const errorBody = await response.json();
      console.error("Error Body:", errorBody);
    } catch (jsonError) {
      console.error("Failed to parse error body as JSON", jsonError);
    }
    return null;
  }

  try {
    return await response.json() as T;
  } catch (error) {
    console.error("Failed to parse response as JSON", error);
    return null;
  }
}

// Export all functions from the index barrel file
export * from "./edge-functions";
