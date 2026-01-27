import { createContext, useContext, useEffect, useState } from "react";
import { AuthAPI } from "../api/auth";
import { clearTokens } from "../auth/tokens";

type User = {
  id: number;
  email: string;
  created_at?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function refreshUser() {
    try {
      const me = await AuthAPI.me();
      setUser(me);
    } catch {
      setUser(null);
      clearTokens();
    }
  }

  useEffect(() => {
    refreshUser().finally(() => setLoading(false));
  }, []);

  function logout() {
    clearTokens();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
