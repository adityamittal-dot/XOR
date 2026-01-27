import { clearTokens, getAccessToken, getRefreshToken, setTokens } from "../auth/tokens";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

let isRefreshing = false;
let refreshQueue: Array<(token: string | null) => void> = [];

async function refreshAccessToken(): Promise<string> {
  const refresh = getRefreshToken();
  if (!refresh) throw new Error("No refresh token available");

  const res = await fetch(`${API_BASE}/api/auth/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });

  const data = await res.json();

  if (!res.ok || !data?.access) {
    throw new Error("Refresh token invalid/expired");
  }

  setTokens(data.access);
  return data.access;
}

function processQueue(newToken: string | null) {
  refreshQueue.forEach((cb) => cb(newToken));
  refreshQueue = [];
}

export async function apiFetch(path: string, options: RequestInit = {}) {
  const access = getAccessToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(access ? { Authorization: `Bearer ${access}` } : {}),
    ...(options.headers || {}),
  };

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (res.ok) {
    if (res.status === 204) return null;
    return res.json();
  }

  if (res.status === 401) {
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        refreshQueue.push(async (newToken) => {
          if (!newToken) return reject({ detail: "Session expired" });

          try {
            const retryRes = await fetch(`${API_BASE}${path}`, {
              ...options,
              headers: {
                ...headers,
                Authorization: `Bearer ${newToken}`,
              },
            });

            if (!retryRes.ok) {
              const err = await retryRes.json().catch(() => ({}));
              return reject(err);
            }

            if (retryRes.status === 204) return resolve(null);
            resolve(await retryRes.json());
          } catch (e) {
            reject(e);
          }
        });
      });
    }

    isRefreshing = true;

    try {
      const newAccess = await refreshAccessToken();
      processQueue(newAccess);

      const retryRes = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers: {
          ...headers,
          Authorization: `Bearer ${newAccess}`,
        },
      });

      if (!retryRes.ok) {
        const err = await retryRes.json().catch(() => ({}));
        throw err;
      }

      if (retryRes.status === 204) return null;
      return retryRes.json();
    } catch (err) {
      clearTokens();
      processQueue(null);
      throw err;
    } finally {
      isRefreshing = false;
    }
  }
  const errorData = await res.json().catch(() => ({}));
  throw errorData;
}
