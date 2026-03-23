import { apiRequest } from '../api-client';
import type { FitnessClass } from '../types';

// ---- Backend response shapes ----

interface BackendClass {
  id: string;
  studioId: string;
  name: string;
  description: string | null;
  modality: string;
  difficulty: string;
  intensity: string;
  duration: number;
  startTime: string;
  endTime: string;
  totalSpots: number;
  stateraSpots: number | null;
  bookedSpots: number;
  creditCost: number;
  dropInPrice: number | null;
  tags: string[];
  studio: {
    id: string;
    name: string;
    slug: string;
    address: string;
    city: string;
    state: string;
    logo: string | null;
    latitude: number;
    longitude: number;
  } | null;
  instructor: {
    id: string;
    firstName: string;
    lastName: string;
    photo: string | null;
    bio: string | null;
  } | null;
  _count?: {
    reviews: number;
    bookings: number;
  };
  distanceKm?: number;
}

export interface BackendClassDetail extends BackendClass {
  waitlistPosition?: number | null;
}

export interface ClassSearchResponse {
  classes: BackendClass[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// ---- Difficulty mapper ----
function mapDifficulty(d: string): FitnessClass['difficulty'] {
  const map: Record<string, FitnessClass['difficulty']> = {
    BEGINNER: 'Beginner',
    INTERMEDIATE: 'Intermediate',
    ADVANCED: 'Advanced',
    ALL_LEVELS: 'All Levels',
  };
  return map[d] ?? 'All Levels';
}

// ---- Mapper: backend → FitnessClass ----
export function mapClass(c: BackendClass): FitnessClass {
  const spotsAvailable = Math.max(0, (c.stateraSpots ?? c.totalSpots) - c.bookedSpots);
  return {
    id: c.id,
    name: c.name,
    studioId: c.studio?.id ?? c.studioId,
    studioName: c.studio?.name ?? '',
    instructor: c.instructor
      ? `${c.instructor.firstName} ${c.instructor.lastName}`
      : 'Staff',
    instructorImage: c.instructor?.photo ?? '',
    category: c.modality.toLowerCase(),
    duration: c.duration,
    difficulty: mapDifficulty(c.difficulty),
    price: c.creditCost,
    datetime: c.startTime,
    spotsLeft: spotsAvailable,
    totalSpots: c.stateraSpots ?? c.totalSpots,
    image: c.studio?.logo ?? '',
    description: c.description ?? '',
    tags: c.tags ?? [],
  };
}

// ---- Search params ----
export interface ClassSearchParams {
  query?: string;
  modality?: string;
  difficulty?: string;
  intensity?: string;
  dateFrom?: string;
  dateTo?: string;
  availableOnly?: boolean;
  minCredits?: number;
  maxCredits?: number;
  minDuration?: number;
  maxDuration?: number;
  studioId?: string;
  instructorId?: string;
  lat?: number;
  lng?: number;
  radiusKm?: number;
  sortBy?: 'startTime' | 'creditCost' | 'distance';
  page?: number;
  limit?: number;
}

export async function searchClasses(params: ClassSearchParams = {}): Promise<{
  classes: FitnessClass[];
  pagination: ClassSearchResponse['pagination'];
  raw: BackendClass[];
}> {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== '') {
      qs.set(key, String(val));
    }
  });

  const data = await apiRequest<ClassSearchResponse>(`/api/classes?${qs.toString()}`);
  return {
    classes: data.classes.map(mapClass),
    pagination: data.pagination,
    raw: data.classes,
  };
}

export async function getClass(id: string): Promise<{
  mapped: FitnessClass;
  raw: BackendClassDetail;
  instructorRaw: BackendClass['instructor'];
}> {
  const data = await apiRequest<{ class: BackendClassDetail }>(`/api/classes/${id}`);
  return {
    mapped: mapClass(data.class),
    raw: data.class,
    instructorRaw: data.class.instructor,
  };
}
