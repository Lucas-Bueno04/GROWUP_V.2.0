
import { supabase } from '@/lib/supabase';

/**
 * Function to create the empresa_historico table if it doesn't exist
 */
export const createEmpresaHistoricoTable = async () => {
  try {
    // Check if the table exists
    const { error } = await supabase
      .from('empresa_historico')
      .select('id')
      .limit(1);
    
    // If there's an error, the table likely doesn't exist
    if (error && error.message.includes('relation "empresa_historico" does not exist')) {
      console.log("Creating empresa_historico table...");
      
      // Create the table using RPC
      const { error: createError } = await supabase.rpc('create_empresa_historico_table');
      
      if (createError) {
        console.error("Error creating empresa_historico table:", createError);
        
        // If RPC fails, notify the user that the table couldn't be created
        console.error("Could not create empresa_historico table automatically.");
        console.error("Please run the SQL script to create the table in the Supabase SQL editor:");
        console.error(`
          CREATE TABLE IF NOT EXISTS public.empresa_historico (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
            descricao TEXT NOT NULL,
            data_registro TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
          );
          
          ALTER TABLE public.empresa_historico ENABLE ROW LEVEL SECURITY;
          
          CREATE POLICY "Allow full access to authenticated users" 
            ON public.empresa_historico
            FOR ALL 
            TO authenticated 
            USING (true);
        `);
      } else {
        console.log("empresa_historico table created successfully using RPC");
      }
    }
  } catch (error) {
    console.error("Error checking empresa_historico table:", error);
  }
};

// Create a helper function to add an entry to the history
export const addEmpresaHistoricoEntry = async (empresaId: string, descricao: string) => {
  try {
    // First make sure the table exists
    await createEmpresaHistoricoTable();
    
    // Then try to insert the record
    const { error } = await supabase
      .from('empresa_historico')
      .insert({
        empresa_id: empresaId,
        descricao: descricao,
        data_registro: new Date().toISOString()
      });
      
    if (error) {
      console.error("Error adding empresa history entry:", error);
    }
  } catch (error) {
    console.error("Error in addEmpresaHistoricoEntry:", error);
  }
};
