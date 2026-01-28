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

  const logout = () => {
    clearTokens();
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const me: User = await AuthAPI.me();
      setUser(me);
    } catch {
      // token invalid / expired / backend down
      clearTokens();
      setUser(null);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        await refreshUser();
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

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
