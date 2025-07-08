
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { RefreshCw, Shield, CheckCircle } from 'lucide-react';

export const RoleDebugInfo = () => {
  const { user, refreshUserProfile } = useAuth();

  if (process.env.NODE_ENV !== 'development') return null;

  const getStoredRole = () => {
    try {
      const stored = localStorage.getItem('growup_user_role');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  };

  const storedRole = getStoredRole();

  return (
    <Card className="border-yellow-200 bg-yellow-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Role Debug Info (Dev Mode) - Simplified
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <strong>Context Role:</strong>
            <Badge variant={user?.role === 'mentor' ? 'default' : 'secondary'} className="ml-2">
              {user?.role || 'none'}
            </Badge>
          </div>
          
          <div>
            <strong>User Email:</strong>
            <span className="ml-2 font-mono">{user?.email || 'none'}</span>
          </div>

          <div>
            <strong>User ID:</strong>
            <span className="ml-2 font-mono text-xs">{user?.id || 'none'}</span>
          </div>

          <div>
            <strong>User Name:</strong>
            <span className="ml-2">{user?.nome || 'none'}</span>
          </div>

          {storedRole && (
            <>
              <div>
                <strong>Stored Role:</strong>
                <Badge variant="outline" className="ml-2">
                  {storedRole.role}
                </Badge>
              </div>
              
              <div>
                <strong>Stored At:</strong>
                <span className="ml-2">{new Date(storedRole.timestamp).toLocaleTimeString()}</span>
              </div>
            </>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            size="sm"
            variant="outline"
            onClick={refreshUserProfile}
            className="text-xs"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Refresh Profile
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              console.log('=== SIMPLIFIED AUTH DEBUG ===');
              console.log('User:', user);
              console.log('Stored role:', storedRole);
            }}
            className="text-xs"
          >
            <CheckCircle className="h-3 w-3 mr-1" />
            Log Debug Info
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
