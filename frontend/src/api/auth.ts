import { apiFetch } from "./client";
import { clearTokens, setTokens } from "../auth/tokens";

export type User = {
  id: number;
  email: string;
  created_at?: string;
};

type Credentials = { email: string; password: string };
type AuthResponse = { user: User; access: string; refresh: string };

async function authenticate(path: string, credentials: Credentials) {
  const data = await apiFetch<AuthResponse>(path, {
    method: "POST",
    body: JSON.stringify(credentials),
  });
  setTokens(data.access, data.refresh);
  return data;
}

export const AuthAPI = {
  login(credentials: Credentials) {
    return authenticate("/api/auth/login/", credentials);
  },

  register(credentials: Credentials) {
    return authenticate("/api/auth/register/", credentials);
  },

  me() {
    return apiFetch<User>("/api/auth/me/");
  },

  logout() {
    clearTokens();
  },
};
