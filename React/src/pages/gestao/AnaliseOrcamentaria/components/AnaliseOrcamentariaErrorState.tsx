
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

interface AnaliseOrcamentariaErrorStateProps {
  title: string;
  description: string;
  errorMessage?: string;
}

export function AnaliseOrcamentariaErrorState({ 
  title, 
  description, 
  errorMessage 
}: AnaliseOrcamentariaErrorStateProps) {
  return (
    <Card className="mt-6">
      <CardContent className="p-6">
        <div className="text-center py-8">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-muted-foreground mb-4">{description}</p>
          {errorMessage && (
            <p className="text-sm text-muted-foreground">{errorMessage}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
