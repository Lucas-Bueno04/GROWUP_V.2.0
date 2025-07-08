
import React, { ReactNode } from "react";
import { AuthGuard } from "./AuthGuard";

type MentorGuardProps = {
  children: ReactNode;
};

const MentorGuard = ({ children }: MentorGuardProps) => {
  return (
    <AuthGuard allowedRoles={['mentor']}>
      {children}
    </AuthGuard>
  );
};

export default MentorGuard;
