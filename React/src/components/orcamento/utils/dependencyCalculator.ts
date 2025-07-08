
import type { CalculationCache } from './types';

export function calculateDependencyOrder(groups: any[]): any[] {
  console.log('=== CALCULATING DEPENDENCY ORDER ===');
  console.log('Input groups:', groups.map(g => ({ codigo: g.codigo, tipo: g.tipo_calculo, formula: g.formula })));
  
  const visited = new Set();
  const visiting = new Set();
  const result: any[] = [];
  
  function visit(group: any) {
    if (visiting.has(group.id)) {
      console.warn(`Circular dependency detected for group ${group.codigo}`);
      return; // Circular dependency - skip
    }
    
    if (visited.has(group.id)) {
      return; // Already processed
    }
    
    visiting.add(group.id);
    
    // Find dependencies based on formula
    if (group.tipo_calculo === 'calculado' && group.formula) {
      const dependencies = extractDependencies(group.formula);
      console.log(`Group ${group.codigo} depends on: [${dependencies.join(', ')}]`);
      
      dependencies.forEach(depCode => {
        const depGroup = groups.find(g => g.codigo === depCode);
        if (depGroup) {
          visit(depGroup);
        }
      });
    }
    
    visiting.delete(group.id);
    visited.add(group.id);
    result.push(group);
    console.log(`Added ${group.codigo} to dependency order`);
  }
  
  // Sort groups by ordem first to ensure consistent processing
  const sortedGroups = [...groups].sort((a, b) => (a.ordem || 0) - (b.ordem || 0));
  
  // Visit all groups
  sortedGroups.forEach(group => {
    if (!visited.has(group.id)) {
      visit(group);
    }
  });
  
  console.log('Final dependency order:', result.map(g => g.codigo));
  console.log('=== END CALCULATING DEPENDENCY ORDER ===');
  
  return result;
}

function extractDependencies(formula: string): string[] {
  // Extract G{number} patterns from formula
  const gMatches = formula.match(/\bG(\d+)\b/g);
  if (!gMatches) return [];
  
  return gMatches.map(match => match.replace('G', ''))
    .filter((value, index, self) => self.indexOf(value) === index);
}
