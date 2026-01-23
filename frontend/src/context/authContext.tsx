import {createContext, useContext, useEffect, useState} from "react"; 
import {apiFetch} from "../api/client";

type User = {
  id: number;
  email: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({children}: {children: React.ReactNode}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/api/auth/me/")
    .then(setUser)
    .catch(() => {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      setUser(null);
    })
    .finally(() => setLoading(false));
  }, []);

  function logout() {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setUser(null);
  }


  return (
    <AuthContext.Provider value={{user, loading, logout}}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if(!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}