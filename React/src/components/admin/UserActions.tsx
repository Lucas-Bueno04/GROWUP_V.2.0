
import React from "react";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/pages/AdminAcessos";
import { Loader2, Trash2, KeyRound, Ban, UserCheck } from "lucide-react";

interface UserActionsProps {
  user: UserProfile;
  onResetPassword: (user: UserProfile) => void;
  onToggleBlock: (user: UserProfile) => void;
  onDelete: (user: UserProfile) => void;
  isLoading?: {
    resetPassword?: boolean;
    toggleBlock?: boolean;
    deleteUser?: boolean;
  };
}

export function UserActions({
  user,
  onResetPassword,
  onToggleBlock,
  onDelete,
  isLoading = {},
}: UserActionsProps) {
  return (
    <div className="flex justify-end gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onResetPassword(user)}
        disabled={isLoading.resetPassword}
      >
        <KeyRound className="h-4 w-4" />
      </Button>
      <Button
        variant={user.is_blocked ? "outline" : "ghost"}
        size="sm"
        onClick={() => onToggleBlock(user)}
        disabled={isLoading.toggleBlock}
      >
        {user.is_blocked ? (
          <UserCheck className="h-4 w-4 text-green-600" />
        ) : (
          <Ban className="h-4 w-4 text-orange-600" />
        )}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="text-red-500 hover:text-red-700 hover:bg-red-50"
        onClick={() => onDelete(user)}
        disabled={isLoading.deleteUser}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
