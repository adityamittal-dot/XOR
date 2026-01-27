import { access } from "fs";

export const tokenKeys = {
  access: "access",
  refresh: "refresh", 
};

export function getAccessToken() {
  return localStorage.getItem(tokenKeys.access);
}

export function getRefreshToken(){
  return localStorage.getItem(tokenKeys.refresh);
}

export function setTokens(access: string, refresh?: string) {
  localStorage.setItem(tokenKeys.access, access);
  if (refresh) {
    localStorage.setItem(tokenKeys.refresh, refresh);
  } 
}

export function clearTokens() {
  localStorage.removeItem(tokenKeys.access);
  localStorage.removeItem(tokenKeys.refresh);
}

