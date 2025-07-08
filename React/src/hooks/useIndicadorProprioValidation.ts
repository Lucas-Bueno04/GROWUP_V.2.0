
import { useIndicadoresProprios } from '@/hooks/useIndicadoresProprios';

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export function useIndicadorProprioValidation(empresaId?: string | null) {
  const { indicadoresProprios } = useIndicadoresProprios(empresaId);

  const validateIndicador = (
    codigo: string,
    ordem: number,
    currentIndicadorId?: string
  ): ValidationResult => {
    const errors: string[] = [];
    const indicadores = indicadoresProprios.data || [];

    // Validar código duplicado
    const codigoExistente = indicadores.find(
      indicador => 
        indicador.codigo.toLowerCase() === codigo.toLowerCase() && 
        indicador.id !== currentIndicadorId
    );

    if (codigoExistente) {
      errors.push(`O código "${codigo}" já está sendo usado pelo indicador "${codigoExistente.nome}".`);
    }

    // Validar posição duplicada
    const posicaoExistente = indicadores.find(
      indicador => 
        indicador.ordem === ordem && 
        indicador.id !== currentIndicadorId
    );

    if (posicaoExistente) {
      errors.push(`A posição ${ordem} já está sendo usada pelo indicador "${posicaoExistente.nome}".`);
    }

    // Validar campos obrigatórios
    if (!codigo.trim()) {
      errors.push('O código é obrigatório.');
    }

    if (ordem < 1) {
      errors.push('A posição deve ser um número maior que zero.');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  };

  const getNextAvailablePosition = (): number => {
    const indicadores = indicadoresProprios.data || [];
    const usedPositions = indicadores.map(ind => ind.ordem).sort((a, b) => a - b);
    
    // Encontrar a primeira posição disponível
    for (let i = 1; i <= usedPositions.length + 1; i++) {
      if (!usedPositions.includes(i)) {
        return i;
      }
    }
    
    return usedPositions.length + 1;
  };

  const suggestAlternativeCode = (baseCode: string): string => {
    const indicadores = indicadoresProprios.data || [];
    const existingCodes = indicadores.map(ind => ind.codigo.toLowerCase());
    
    let counter = 1;
    let newCode = baseCode;
    
    while (existingCodes.includes(newCode.toLowerCase())) {
      newCode = `${baseCode}_${counter}`;
      counter++;
    }
    
    return newCode;
  };

  return {
    validateIndicador,
    getNextAvailablePosition,
    suggestAlternativeCode
  };
}
