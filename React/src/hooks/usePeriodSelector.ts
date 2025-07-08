
import { useState } from 'react';

export function usePeriodSelector() {
  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);

  return {
    selectedYear,
    selectedMonth,
    setSelectedYear,
    setSelectedMonth,
  };
}
