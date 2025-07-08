
import { Card, CardContent } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

interface AnaliseOrcamentariaEmptyStateProps {
  title: string;
  description: string;
  additionalInfo?: string[];
  debugInfo?: any;
}

export function AnaliseOrcamentariaEmptyState({ 
  title, 
  description, 
  additionalInfo,
  debugInfo 
}: AnaliseOrcamentariaEmptyStateProps) {
  return (
    <Card>
      <CardContent className="p-12">
        <div className="text-center">
          <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-50 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-muted-foreground mb-4">{description}</p>
          
          {additionalInfo && (
            <div className="text-sm text-muted-foreground space-y-1">
              {additionalInfo.map((info, index) => (
                <p key={index}>• {info}</p>
              ))}
            </div>
          )}
          
          {debugInfo && (
            <div className="mt-4 p-3 bg-gray-100 rounded text-xs">
              <p><strong>Debug Info:</strong></p>
              {Object.entries(debugInfo).map(([key, value]) => (
                <p key={key}>{key}: {String(value)}</p>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
