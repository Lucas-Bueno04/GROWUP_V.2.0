
import React from "react";

export function DatabaseInstructions() {
  return (
    <div className="mt-6 p-6 bg-yellow-50 border border-yellow-200 rounded-md">
      <h3 className="font-semibold text-yellow-800 mb-2">Pendência de Função de Banco de Dados</h3>
      <p className="text-yellow-700 mb-2">
        É necessário criar uma função <code>get_all_profiles()</code> no banco de dados que retorna todos os perfis sem acionar políticas RLS.
        Se você continuar vendo o erro de recursão, verifique se esta função foi criada corretamente.
      </p>
      <p className="text-yellow-700 mb-2">
        Código SQL necessário:
      </p>
      <pre className="bg-yellow-100 p-3 rounded text-sm text-yellow-900 overflow-auto mb-4">
        {`
CREATE OR REPLACE FUNCTION public.get_all_profiles()
RETURNS JSONB AS $$
DECLARE
  user_profiles JSONB;
BEGIN
  SELECT jsonb_agg(p)
  INTO user_profiles
  FROM public.profiles p;
  
  RETURN user_profiles;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
        `}
      </pre>
    </div>
  );
}
