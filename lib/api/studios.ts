import { apiRequest } from '../api-client';
import { mapClass } from './classes';
import type { Studio } from '../types';
import type { FitnessClass } from '../types';

// ---------------------------------------------------------------------------
// Backend shapes
// ---------------------------------------------------------------------------

export interface BackendStudio {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  address: string;
  city: string;
  state: string;
  zipCode: string | null;
  country: string;
  latitude: number | null;
  longitude: number | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  logo: string | null;
  coverImage: string | null;
  photos: string[];
  cancellationPolicy: string | null;
  amenities: string[];
  isActive: boolean;
  isVerified: boolean;
  avgRating: number | null;
  _count: { classes: number; reviews: number; followers: number };
}

// ---------------------------------------------------------------------------
// Mapper: BackendStudio → Studio (for StudioCard)
// ---------------------------------------------------------------------------

export function mapStudio(s: BackendStudio): Studio {
  return {
    id: s.id,
    name: s.name,
    description: s.description ?? '',
    image: s.coverImage ?? s.logo ?? '/placeholder.svg',
    rating: s.avgRating ?? 0,
    reviewCount: s._count.reviews,
    location: `${s.city}, ${s.state}`,
    distance: '',
    categories: [],
    priceRange: '$$',
  };
}

// ---------------------------------------------------------------------------
// API calls
// ---------------------------------------------------------------------------

export async function getStudio(id: string): Promise<BackendStudio> {
  const data = await apiRequest<{ studio: BackendStudio }>(`/api/studios/${id}`);
  return data.studio;
}

export async function searchStudios(
  params: { query?: string; city?: string; state?: string; limit?: number } = {}
): Promise<{ studios: Studio[]; raw: BackendStudio[]; total: number }> {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined) qs.set(k, String(v));
  });
  const data = await apiRequest<{
    studios: BackendStudio[];
    pagination: { total: number };
  }>(`/api/studios?${qs}`);
  return {
    studios: data.studios.map(mapStudio),
    raw: data.studios,
    total: data.pagination.total,
  };
}

export async function getStudioClasses(
  studioId: string,
  limit = 20
): Promise<FitnessClass[]> {
  const data = await apiRequest<{
    classes: Parameters<typeof mapClass>[0][];
  }>(`/api/studios/${studioId}/classes?limit=${limit}`);
  return data.classes.map(mapClass);
}
