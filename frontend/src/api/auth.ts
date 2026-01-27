import { apiFetch } from "./client";

export const AuthAPI = {
  me(){
    return apiFetch("/api/auth/me/");
  },
};