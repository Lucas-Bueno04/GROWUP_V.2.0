
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FileSpreadsheet } from 'lucide-react';

interface OrcamentoEmptyStateProps {
  isMentor?: boolean;
  title: string;
  description: string;
  showCreateButton?: boolean;
  onCreateClick?: () => void;
}

export function OrcamentoEmptyState({ 
  isMentor, 
  title, 
  description, 
  showCreateButton,
  onCreateClick 
}: OrcamentoEmptyStateProps) {
  return (
    <Card>
      <CardContent className="py-12">
        <div className="text-center">
          <FileSpreadsheet className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            {description}
          </p>
          {showCreateButton && isMentor && onCreateClick && (
            <Button onClick={onCreateClick}>
              <Plus className="mr-2 h-4 w-4" />
              Criar Primeiro Orçamento
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
