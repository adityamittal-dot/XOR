import { apiFetch } from "./client";
import { setTokens } from "../auth/tokens";

export const AuthAPI = {
  async login(credentials: { email: string; password?: string }) {
    const data = await apiFetch("/api/auth/login/", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    if (data.access && data.refresh) {
      setTokens(data.access, data.refresh);
    }
    return data;
  },

  me() {
    return apiFetch("/api/auth/me/");
  },
};