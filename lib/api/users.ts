import { apiRequest } from '../api-client';

export interface BackendUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  role: string;
  creditBalance: number;
  avatar: string | null;
  bio: string | null;
  cyclePhase: string | null;
  currentMood: string | null;
  currentEnergy: string | null;
  preferences: {
    fitnessGoals?: string[];
    favoriteModalities?: string[];
    injuries?: string[];
  } | null;
  createdAt: string;
  _count?: {
    bookings: number;
    reviews: number;
    studioFollows: number;
    instructorFollows: number;
  };
}

export interface UserStats {
  totalBookings: number;
  completedBookings: number;
  completionRate: number;
  studiosVisited: number;
  favoriteModality: string | null;
  totalCreditsSpent: number;
  reviewsCount: number;
}

export async function getUserProfile(userId: string): Promise<BackendUser> {
  const data = await apiRequest<{ user: BackendUser }>(`/api/users/${userId}`);
  return data.user;
}

export async function getUserStats(userId: string): Promise<UserStats> {
  const data = await apiRequest<{ stats: UserStats }>(`/api/users/${userId}/stats`);
  return data.stats;
}

export async function getUserCredits(userId: string): Promise<number> {
  const data = await apiRequest<{ creditBalance: number }>(`/api/users/${userId}/credits`);
  return data.creditBalance;
}

export async function updatePreferences(
  userId: string,
  preferences: {
    fitnessGoals?: string[];
    favoriteModalities?: string[];
    injuries?: string[];
  }
): Promise<BackendUser> {
  const data = await apiRequest<{ user: BackendUser }>(`/api/users/${userId}/preferences`, {
    method: 'PATCH',
    body: JSON.stringify({ preferences }),
  });
  return data.user;
}

export async function followStudio(userId: string, studioId: string): Promise<void> {
  await apiRequest(`/api/users/${userId}/studios/follow`, {
    method: 'POST',
    body: JSON.stringify({ studioId }),
  });
}

export async function unfollowStudio(userId: string, studioId: string): Promise<void> {
  await apiRequest(`/api/users/${userId}/studios/${studioId}/unfollow`, {
    method: 'DELETE',
  });
}
