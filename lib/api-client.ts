const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

// In-memory access token (avoids XSS risk of localStorage for short-lived token)
let memoryAccessToken: string | null = null;

export function setAccessToken(token: string | null) {
  memoryAccessToken = token;
}

export function getAccessToken(): string | null {
  return memoryAccessToken;
}

export function getStoredRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('statera_refresh_token');
}

export function storeRefreshToken(token: string | null) {
  if (typeof window === 'undefined') return;
  if (token) {
    localStorage.setItem('statera_refresh_token', token);
  } else {
    localStorage.removeItem('statera_refresh_token');
  }
}

export function storeUserId(id: string | null) {
  if (typeof window === 'undefined') return;
  if (id) {
    localStorage.setItem('statera_user_id', id);
  } else {
    localStorage.removeItem('statera_user_id');
  }
}

export function getStoredUserId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('statera_user_id');
}

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  // Deduplicate concurrent refresh attempts
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const refreshToken = getStoredRefreshToken();
    if (!refreshToken) return null;

    try {
      const res = await fetch(`${API_URL}/api/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (!res.ok) {
        storeRefreshToken(null);
        storeUserId(null);
        setAccessToken(null);
        return null;
      }

      const data = await res.json();
      setAccessToken(data.accessToken);
      if (data.refreshToken) storeRefreshToken(data.refreshToken);
      return data.accessToken as string;
    } catch {
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public body?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const makeRequest = async (token: string | null) => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return fetch(`${API_URL}${path}`, { ...options, headers });
  };

  let res = await makeRequest(memoryAccessToken);

  if (res.status === 401) {
    const newToken = await refreshAccessToken();
    if (!newToken) throw new ApiError(401, 'Authentication required');
    res = await makeRequest(newToken);
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, (body as { error?: string }).error ?? 'Request failed', body);
  }

  return res.json() as Promise<T>;
}
