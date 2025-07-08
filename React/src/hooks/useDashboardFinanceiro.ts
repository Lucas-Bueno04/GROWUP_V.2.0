
import { useState, useEffect } from 'react';

export function useDashboardFinanceiro() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    receita: 0,
    custos: 0,
    despesas: 0,
    lucro: 0,
  });

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setData({
        receita: 150000,
        custos: 80000,
        despesas: 45000,
        lucro: 25000,
      });
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return { data, loading };
}
