
import { useState, useMemo, useEffect } from 'react';
import { BudgetAnalysisData } from '@/hooks/analise-orcamentaria';

interface TrendChartOption {
  value: string;
  label: string;
  color: string;
}

export function useTrendChartData(data: BudgetAnalysisData) {
  const [selectedGroup1, setSelectedGroup1] = useState<string>('');
  const [selectedGroup2, setSelectedGroup2] = useState<string>('');

  // Create available options from actual groups data
  const availableOptions = useMemo(() => {
    console.log('TrendChart - Processing groups data:', data.dadosHierarquicos.grupos);
    
    const options = data.dadosHierarquicos.grupos.map(grupo => ({
      value: grupo.id,
      label: `${grupo.codigo} - ${grupo.nome}`,
      color: `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`
    }));

    console.log('TrendChart - Available options:', options);
    return options;
  }, [data.dadosHierarquicos.grupos]);

  // Set default selections if not set and options are available
  useEffect(() => {
    if (availableOptions.length > 0 && !selectedGroup1) {
      setSelectedGroup1(availableOptions[0].value);
    }
    if (availableOptions.length > 1 && !selectedGroup2) {
      setSelectedGroup2(availableOptions[1].value);
    }
  }, [availableOptions, selectedGroup1, selectedGroup2]);

  const getDataForSelection = (selection: string, monthIndex: number) => {
    const mes = monthIndex + 1;
    
    console.log(`TrendChart - Getting data for selection: ${selection}, month: ${mes}`);
    
    // Find the specific group data
    const grupo = data.dadosHierarquicos.grupos.find(g => g.id === selection);
    if (grupo) {
      console.log(`TrendChart - Found group: ${grupo.nome}`, grupo);
      
      // Try to get monthly data for this group
      const monthData = grupo.dadosMensais?.find(m => m.mes === mes);
      if (monthData) {
        console.log(`TrendChart - Found monthly data for ${grupo.nome}, month ${mes}:`, monthData);
        return Math.abs(monthData.realizado || 0);
      } else {
        console.log(`TrendChart - No monthly data found for ${grupo.nome}, month ${mes}, using annual/12`);
        // Fallback: use annual data divided by 12
        return Math.abs(grupo.realizado / 12);
      }
    }
    
    console.log(`TrendChart - No data found for selection: ${selection}`);
    return 0;
  };

  const trendChartData = useMemo(() => {
    if (!data.dadosMensais || data.dadosMensais.length === 0) {
      console.log('TrendChart - No monthly data available');
      return [];
    }

    console.log('TrendChart - Building chart data with selections:', { selectedGroup1, selectedGroup2 });
    
    const option1 = availableOptions.find(opt => opt.value === selectedGroup1);
    const option2 = availableOptions.find(opt => opt.value === selectedGroup2);
    
    if (!option1 || !option2) {
      console.log('TrendChart - Missing selections, returning empty data');
      return [];
    }

    const chartData = data.dadosMensais.map((item, index) => {
      const value1 = getDataForSelection(selectedGroup1, index);
      const value2 = getDataForSelection(selectedGroup2, index);
      
      console.log(`TrendChart - Month ${item.mesNome}: ${option1.label} = ${value1}, ${option2.label} = ${value2}`);
      
      return {
        mes: item.mesNome.substring(0, 3),
        [option1.label]: value1,
        [option2.label]: value2
      };
    });

    console.log('TrendChart - Final chart data:', chartData);
    return chartData;
  }, [data.dadosMensais, data.dadosHierarquicos.grupos, selectedGroup1, selectedGroup2, availableOptions]);

  const getLineColor = (selection: string) => {
    const option = availableOptions.find(opt => opt.value === selection);
    return option?.color || '#8884d8';
  };

  const getLineLabel = (selection: string) => {
    const option = availableOptions.find(opt => opt.value === selection);
    return option?.label || 'Série';
  };

  return {
    selectedGroup1,
    selectedGroup2,
    setSelectedGroup1,
    setSelectedGroup2,
    availableOptions,
    trendChartData,
    getLineColor,
    getLineLabel
  };
}
