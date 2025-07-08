
import { createContext, useContext } from "react";
import { AuthContextType } from "./types";

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => ({ data: null, error: null }),
  signOut: async () => {},
  refreshUser: async () => {},
  getUserProfile: async () => {},
  refreshUserProfile: async () => null,
});

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

export { AuthContext };
