
import React from 'react';
import { CompanyClassificationCard } from '../CompanyClassificationCard';
import { CompanyClassificationHistory } from '../CompanyClassificationHistory';
import { ClassificationBadgesList } from '../ClassificationBadgesList';

interface ClassificationTabProps {
  empresaId: string;
}

export function ClassificationTab({ empresaId }: ClassificationTabProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CompanyClassificationCard empresaId={empresaId} />
        <ClassificationBadgesList />
      </div>
      
      <CompanyClassificationHistory empresaId={empresaId} />
    </div>
  );
}
