import { apiRequest } from '../api-client';

// ---------------------------------------------------------------------------
// Backend shapes
// ---------------------------------------------------------------------------

export interface BackendReview {
  id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  helpful: number;
  studioResponse: string | null;
  createdAt: string;
  user: { id: string; firstName: string; lastName: string; avatar: string | null };
  class: { id: string; name: string; modality: string; startTime: string } | null;
  instructor: { id: string; firstName: string; lastName: string } | null;
}

// ---------------------------------------------------------------------------
// API calls
// ---------------------------------------------------------------------------

export async function getReviews(params: {
  classId?: string;
  studioId?: string;
  instructorId?: string;
  limit?: number;
  sortBy?: 'createdAt' | 'rating';
}): Promise<BackendReview[]> {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined) qs.set(k, String(v));
  });
  const data = await apiRequest<{ reviews: BackendReview[] }>(
    `/api/reviews?${qs}`
  );
  return data.reviews;
}

export async function markReviewHelpful(reviewId: string): Promise<void> {
  await apiRequest(`/api/reviews/${reviewId}/helpful`, { method: 'POST' });
}
