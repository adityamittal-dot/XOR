import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { AuthAPI, type User } from "../api/auth";
import { clearTokens, getAccessToken, getRefreshToken } from "../auth/tokens";

type Credentials = { email: string; password: string };

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (credentials: Credentials) => Promise<void>;
  register: (credentials: Credentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  // Only block the UI on startup when there is actually a session to restore.
  const [loading, setLoading] = useState(
    () => Boolean(getAccessToken() || getRefreshToken())
  );

  const logout = useCallback(async () => {
    await AuthAPI.logout();
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      setUser(await AuthAPI.me());
    } catch {
      clearTokens();
      setUser(null);
    }
  }, []);

  const login = useCallback(async (credentials: Credentials) => {
    setUser((await AuthAPI.login(credentials)).user);
  }, []);

  const register = useCallback(async (credentials: Credentials) => {
    setUser((await AuthAPI.register(credentials)).user);
  }, []);

  useEffect(() => {
    if (!getAccessToken() && !getRefreshToken()) return;

    let cancelled = false;

    (async () => {
      try {
        const me = await AuthAPI.me();
        if (!cancelled) setUser(me);
      } catch {
        clearTokens();
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
