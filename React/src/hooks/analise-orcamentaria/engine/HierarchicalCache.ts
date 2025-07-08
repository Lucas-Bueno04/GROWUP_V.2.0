
/**
 * Sistema de Cache Hierárquico - Gerencia cache de forma coordenada
 */

import type { CalculationContext, CacheStats } from './types';

interface CacheEntry {
  value: number;
  timestamp: number;
  context: {
    dataType: string;
    tipo: string;
    mes?: number;
    isAnnual?: boolean;
  };
  dependencies: string[];
}

export class HierarchicalCache {
  private cache: Map<string, CacheEntry> = new Map();
  private dependencyGraph: Map<string, Set<string>> = new Map();
  private stats = {
    hits: 0,
    misses: 0
  };

  /**
   * Gera chave de cache para fórmula
   */
  generateKey(formula: string, context: CalculationContext): string {
    const contextKey = [
      context.dataType,
      context.tipo,
      context.mes || 'annual',
      context.empresaId || 'default',
      context.ano || 'current'
    ].join('|');
    
    return `formula:${formula}:${contextKey}`;
  }

  /**
   * Gera chave de cache para conta
   */
  generateAccountKey(accountCode: string, context: CalculationContext): string {
    const contextKey = [
      context.dataType,
      context.tipo,
      context.mes || 'annual',
      context.empresaId || 'default'
    ].join('|');
    
    return `account:${accountCode}:${contextKey}`;
  }

  /**
   * Gera chave de cache para grupo
   */
  generateGroupKey(groupId: string, context: CalculationContext): string {
    const contextKey = [
      context.dataType,
      context.tipo,
      context.mes || 'annual',
      context.empresaId || 'default'
    ].join('|');
    
    return `group:${groupId}:${contextKey}`;
  }

  /**
   * Obtém valor do cache
   */
  get(key: string): number | undefined {
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.stats.misses++;
      return undefined;
    }

    // Verificar se não expirou (cache por 5 minutos)
    if (Date.now() - entry.timestamp > 5 * 60 * 1000) {
      this.cache.delete(key);
      this.stats.misses++;
      return undefined;
    }

    this.stats.hits++;
    console.log('💾 Cache hit:', key, '→', entry.value);
    return entry.value;
  }

  /**
   * Define valor no cache
   */
  set(key: string, value: number, context: CalculationContext): void {
    const entry: CacheEntry = {
      value,
      timestamp: Date.now(),
      context: {
        dataType: context.dataType,
        tipo: context.tipo,
        mes: context.mes,
        isAnnual: context.isAnnual
      },
      dependencies: this.extractDependencies(key)
    };

    this.cache.set(key, entry);
    this.updateDependencyGraph(key, entry.dependencies);
    
    console.log('💾 Cache set:', key, '→', value);
  }

  /**
   * Métodos específicos para contas
   */
  getAccount(key: string): number | undefined {
    return this.get(key);
  }

  setAccount(key: string, value: number): void {
    const entry: CacheEntry = {
      value,
      timestamp: Date.now(),
      context: { dataType: 'account', tipo: '', mes: undefined, isAnnual: false },
      dependencies: []
    };

    this.cache.set(key, entry);
  }

  /**
   * Métodos específicos para grupos
   */
  getGroup(key: string): number | undefined {
    return this.get(key);
  }

  setGroup(key: string, value: number): void {
    const entry: CacheEntry = {
      value,
      timestamp: Date.now(),
      context: { dataType: 'group', tipo: '', mes: undefined, isAnnual: false },
      dependencies: []
    };

    this.cache.set(key, entry);
  }

  /**
   * Invalida cache por dependências
   */
  invalidateByDependency(dependency: string): void {
    const dependents = this.dependencyGraph.get(dependency) || new Set();
    
    for (const dependent of dependents) {
      this.cache.delete(dependent);
      console.log('🗑️ Cache invalidated:', dependent);
    }

    if (dependents.size > 0) {
      console.log(`🔄 Invalidated ${dependents.size} cache entries for dependency: ${dependency}`);
    }
  }

  /**
   * Limpa cache
   */
  clear(): void {
    const size = this.cache.size;
    this.cache.clear();
    this.dependencyGraph.clear();
    this.stats = { hits: 0, misses: 0 };
    
    console.log(`🧹 Cleared ${size} cache entries`);
  }

  /**
   * Obtém estatísticas do cache
   */
  getStats(): CacheStats {
    return {
      hits: this.stats.hits,
      misses: this.stats.misses,
      size: this.cache.size,
      hitRate: this.stats.hits / (this.stats.hits + this.stats.misses) || 0
    };
  }

  private extractDependencies(key: string): string[] {
    const dependencies: string[] = [];
    
    // Extrair dependências baseadas na chave
    if (key.includes('G')) {
      const groups = key.match(/G(\d+)/g) || [];
      dependencies.push(...groups.map(g => `group:${g}`));
    }
    
    if (key.includes('CONTA_')) {
      const accounts = key.match(/CONTA_([\w\d_]+)/g) || [];
      dependencies.push(...accounts.map(a => `account:${a}`));
    }

    return dependencies;
  }

  private updateDependencyGraph(key: string, dependencies: string[]): void {
    for (const dep of dependencies) {
      if (!this.dependencyGraph.has(dep)) {
        this.dependencyGraph.set(dep, new Set());
      }
      this.dependencyGraph.get(dep)!.add(key);
    }
  }
}
