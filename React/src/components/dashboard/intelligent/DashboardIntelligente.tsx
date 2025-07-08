
import React from 'react';
import { DashboardInteligenteRealtime } from './DashboardInteligenteRealtime';
import { DashboardInteligenteProps } from './types';

export function DashboardIntelligente({ empresaId }: DashboardInteligenteProps) {
  return <DashboardInteligenteRealtime empresaId={empresaId} />;
}
