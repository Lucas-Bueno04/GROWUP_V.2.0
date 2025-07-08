
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Header } from '@/components/layout/Header';

interface EmptyMentorPageProps {
  title: string;
  description?: string;
}

const EmptyMentorPage: React.FC<EmptyMentorPageProps> = ({ title, description }) => {
  return (
    <div className="h-full">
      <Header
        title={title}
        description={description || `Esta página será implementada em breve.`}
        colorScheme="red"
      />
      
      <div className="p-6">
        <Card>
          <CardContent className="p-6 flex items-center justify-center min-h-[300px]">
            <p className="text-center text-lg text-muted-foreground">
              Página em desenvolvimento. Volte em breve.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmptyMentorPage;
