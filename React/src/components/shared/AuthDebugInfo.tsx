
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function AuthDebugInfo() {
  const { user, loading } = useAuth();

  if (!import.meta.env.DEV) {
    return null;
  }

  return (
    <Card className="border-dashed border-blue-200 bg-blue-50/50 dark:bg-blue-900/10">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-blue-800 dark:text-blue-400">
          Auth Debug Info (DEV)
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
          <div>Loading: {loading ? 'true' : 'false'}</div>
          <div>User ID: {user?.id || 'Not logged in'}</div>
          <div>Email: {user?.email || 'No email'}</div>
          <div>Role: {user?.role || 'No role'}</div>
          <div>Nome: {user?.nome || 'No name'}</div>
        </div>
      </CardContent>
    </Card>
  );
}
