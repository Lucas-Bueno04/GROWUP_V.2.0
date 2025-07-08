
import { Card, CardContent } from '@/components/ui/card';

export function AnaliseOrcamentariaLoadingState({ message }: { message: string }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>{message}</p>
        </div>
      </CardContent>
    </Card>
  );
}
