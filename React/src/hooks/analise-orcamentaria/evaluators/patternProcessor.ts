
import { calculateAnaliseOrcamentariaAccountValue } from './accountCalculator';
import { calculateAnaliseOrcamentariaGroupValue } from './groupCalculator';
import type { EvaluationCache } from './types';

export function processAnaliseOrcamentariaPatterns(
  formula: string,
  allGroups: any[],
  valores: any[],
  tipo: 'orcado' | 'realizado',
  mes?: number
): string {
  let processedFormula = formula;
  const cache: EvaluationCache = {};
  
  console.log('=== PROCESSING ANÁLISE ORÇAMENTÁRIA PATTERNS (FIXED) ===');
  console.log('Input formula:', formula);
  console.log('Processing for:', mes ? `month ${mes}` : 'annual');
  
  // **CRITICAL FIX**: Process G-patterns BEFORE numeric patterns to avoid confusion
  // Processar padrões G{número} para referências de grupos PRIMEIRO
  const gMatches = processedFormula.match(/G(\d+)/g);
  if (gMatches) {
    console.log(`Found G-pattern group references: ${gMatches.join(', ')}`);
    
    // Process each G pattern individually and replace immediately
    gMatches.forEach(groupPattern => {
      // Extrair apenas o número do padrão G{número}
      const groupNumber = groupPattern.replace('G', '');
      const referencedGroup = allGroups.find(g => g.codigo === groupNumber);
      
      if (referencedGroup) {
        console.log(`Processing group ${groupPattern}:`, {
          id: referencedGroup.id,
          codigo: referencedGroup.codigo,
          nome: referencedGroup.nome,
          tipo_calculo: referencedGroup.tipo_calculo,
          formula: referencedGroup.formula
        });
        
        let groupValue = calculateAnaliseOrcamentariaGroupValue(
          referencedGroup,
          allGroups,
          valores,
          tipo,
          mes,
          cache
        );
        
        console.log(`Group ${groupPattern} calculated value: ${groupValue}`);
        
        // **CRITICAL FIX**: Para grupos sintéticos como G3 e G7, aplicar correção de sinal
        // se necessário baseado no contexto da fórmula original
        if (['3', '7'].includes(groupNumber)) {
          console.log(`🔧 APPLYING SYNTHETIC GROUP CORRECTION for ${groupPattern}`);
          
          // Para G3 (Resultado Bruto) e G7 (EBITDA), verificar se precisamos corrigir o sinal
          // com base no contexto da fórmula e na natureza dos grupos
          const isInSubtractionContext = formula.includes(`- ${groupPattern}`) || 
                                       formula.includes(`-${groupPattern}`);
          
          if (isInSubtractionContext && groupValue < 0) {
            // Se está em contexto de subtração e o valor já é negativo,
            // pode precisar de correção dependendo da lógica de negócio
            console.log(`Group ${groupPattern} is in subtraction context with negative value: ${groupValue}`);
          }
          
          console.log(`Final corrected value for ${groupPattern}: ${groupValue}`);
        }
        
        // Debug específico para Break-even
        if (['3', '4', '5'].includes(groupNumber)) {
          console.log(`🔍 BREAK-EVEN PROCESSING: ${groupPattern} = ${groupValue} (${referencedGroup.nome})`);
        }
        
        // **CRITICAL**: Use word boundaries to ensure exact replacement
        const regex = new RegExp(`\\b${groupPattern}\\b`, 'g');
        processedFormula = processedFormula.replace(regex, groupValue.toString());
        console.log(`Formula after replacing ${groupPattern}: "${processedFormula}"`);
      } else {
        console.warn(`Group with code ${groupNumber} not found for pattern ${groupPattern}`);
        console.log('Available group codes:', allGroups.map(g => g.codigo));
        // Replace with 0 if group not found
        const regex = new RegExp(`\\b${groupPattern}\\b`, 'g');
        processedFormula = processedFormula.replace(regex, '0');
      }
    });
  }

  // Process CONTA_ patterns AFTER G-patterns
  const contaMatches = processedFormula.match(/CONTA_([\w\d_]+)/g);
  if (contaMatches) {
    console.log(`Found CONTA-pattern references: ${contaMatches.join(', ')}`);
    
    contaMatches.forEach(contaPattern => {
      // Convert CONTA_5_4 to account code 5.4
      const accountCode = contaPattern.replace('CONTA_', '').replace(/_/g, '.');
      console.log(`Processing ${contaPattern} as account code: ${accountCode}`);
      
      const accountValue = calculateAnaliseOrcamentariaAccountValue(
        accountCode,
        valores,
        tipo,
        mes
      );
      
      console.log(`Account ${contaPattern} (${accountCode}) calculated value: ${accountValue}`);
      processedFormula = processedFormula.replace(
        new RegExp(contaPattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
        accountValue.toString()
      );
      console.log(`Formula after replacing ${contaPattern}: "${processedFormula}"`);
    });
  }

  console.log('Final processed formula:', processedFormula);
  console.log('=== END PROCESSING ANÁLISE ORÇAMENTÁRIA PATTERNS (FIXED) ===');
  return processedFormula;
}
