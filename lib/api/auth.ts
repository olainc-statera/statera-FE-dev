import { apiRequest, setAccessToken, storeRefreshToken, storeUserId, getStoredRefreshToken } from '../api-client';

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  role: string;
  creditBalance: number;
  avatar: string | null;
  bio?: string | null;
  createdAt: string;
  preferences?: {
    fitnessGoals?: string[];
    favoriteModalities?: string[];
    injuries?: string[];
  } | null;
  cyclePhase?: string | null;
  currentMood?: string | null;
  currentEnergy?: string | null;
}

interface AuthResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'}/api/auth/login`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }
  );
  const body = await res.json();
  if (!res.ok) throw new Error(body.error ?? 'Login failed');
  const data = body as AuthResponse;
  setAccessToken(data.accessToken);
  storeRefreshToken(data.refreshToken);
  storeUserId(data.user.id);
  return data;
}

export async function signup(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  phone?: string
): Promise<AuthResponse> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'}/api/auth/signup`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, firstName, lastName, phone }),
    }
  );
  const body = await res.json();
  if (!res.ok) throw new Error(body.error ?? 'Signup failed');
  const data = body as AuthResponse;
  setAccessToken(data.accessToken);
  storeRefreshToken(data.refreshToken);
  storeUserId(data.user.id);
  return data;
}

export async function logout(): Promise<void> {
  const refreshToken = getStoredRefreshToken();
  try {
    await apiRequest('/api/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  } catch {
    // Best-effort logout — clear tokens regardless
  } finally {
    setAccessToken(null);
    storeRefreshToken(null);
    storeUserId(null);
  }
}

export async function getMe(): Promise<AuthUser> {
  const data = await apiRequest<{ user: AuthUser }>('/api/auth/me');
  return data.user;
}

// Restore session from stored refresh token on app load
export async function restoreSession(): Promise<AuthUser | null> {
  const refreshToken = getStoredRefreshToken();
  if (!refreshToken) return null;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'}/api/auth/refresh`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      }
    );

    if (!res.ok) {
      storeRefreshToken(null);
      storeUserId(null);
      return null;
    }

    const data = await res.json();
    setAccessToken(data.accessToken);
    if (data.refreshToken) storeRefreshToken(data.refreshToken);
    if (data.user) {
      storeUserId(data.user.id);
      return data.user as AuthUser;
    }

    // If refresh didn't return user, fetch it
    const meData = await apiRequest<{ user: AuthUser }>('/api/auth/me');
    storeUserId(meData.user.id);
    return meData.user;
  } catch {
    storeRefreshToken(null);
    storeUserId(null);
    return null;
  }
}
