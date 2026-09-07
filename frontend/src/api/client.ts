import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setTokens,
} from "../auth/tokens";

export const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(status: number, data: unknown) {
    super(messageFromPayload(data) ?? `Request failed (${status})`);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

/** Pull a human-readable message out of a DRF error body. */
function messageFromPayload(data: unknown): string | null {
  if (typeof data === "string") return data;
  if (!data || typeof data !== "object") return null;

  const record = data as Record<string, unknown>;
  const direct = record.detail ?? record.error ?? record.message;
  if (typeof direct === "string") return direct;

  // DRF field errors: { email: ["This field is required."] }
  for (const value of Object.values(record)) {
    if (typeof value === "string") return value;
    if (Array.isArray(value) && typeof value[0] === "string") return value[0];
  }
  return null;
}

let refreshInFlight: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const refresh = getRefreshToken();
  if (!refresh) throw new ApiError(401, { detail: "Session expired" });

  const res = await fetch(`${API_BASE}/api/auth/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data?.access) {
    throw new ApiError(401, { detail: "Session expired" });
  }

  // ROTATE_REFRESH_TOKENS is on, so store the new refresh token when present.
  setTokens(data.access, data.refresh);
  return data.access;
}

/** Share one refresh across concurrent 401s instead of stampeding the endpoint. */
function refreshOnce(): Promise<string> {
  if (!refreshInFlight) {
    refreshInFlight = refreshAccessToken().finally(() => {
      refreshInFlight = null;
    });
  }
  return refreshInFlight;
}

function buildHeaders(options: RequestInit, token: string | null): Headers {
  const headers = new Headers(options.headers);

  // Let the browser set the multipart boundary for FormData bodies.
  if (!(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (token) headers.set("Authorization", `Bearer ${token}`);

  return headers;
}

async function parse(res: Response) {
  if (res.status === 204) return null;
  return res.json().catch(() => null);
}

export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  let res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: buildHeaders(options, getAccessToken()),
  });

  if (res.status === 401 && getRefreshToken()) {
    try {
      const token = await refreshOnce();
      res = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers: buildHeaders(options, token),
      });
    } catch (err) {
      clearTokens();
      throw err;
    }
  }

  if (!res.ok) {
    if (res.status === 401) clearTokens();
    throw new ApiError(res.status, await parse(res));
  }

  return (await parse(res)) as T;
}
