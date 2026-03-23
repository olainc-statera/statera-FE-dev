import { apiRequest } from '../api-client';

export interface BackendBooking {
  id: string;
  userId: string;
  classId: string;
  status: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW';
  creditsUsed: number;
  checkInCode: string;
  checkedIn: boolean;
  checkedInAt: string | null;
  cancelledAt: string | null;
  cancellationReason: string | null;
  refundedCredits: number;
  createdAt: string;
  class: {
    id: string;
    name: string;
    startTime: string;
    endTime: string;
    duration?: number;
    creditCost?: number;
    modality?: string;
    description?: string;
    tags?: string[];
    studio: {
      id: string;
      name: string;
      city: string;
      state: string;
      logo?: string | null;
    };
    instructor: {
      id: string;
      firstName: string;
      lastName: string;
    } | null;
  };
}

export type FrontendBookingStatus = 'upcoming' | 'completed' | 'cancelled';

export interface MappedBooking {
  id: string;
  classId: string;
  className: string;
  studioId: string;
  studioName: string;
  instructorName: string;
  datetime: string;
  status: FrontendBookingStatus;
  price: number;
  checkInCode: string;
  refundedCredits: number;
  studioLogo: string | null;
}

function mapStatus(s: BackendBooking['status']): FrontendBookingStatus {
  if (s === 'CONFIRMED') return 'upcoming';
  if (s === 'COMPLETED') return 'completed';
  return 'cancelled';
}

export function mapBooking(b: BackendBooking): MappedBooking {
  return {
    id: b.id,
    classId: b.classId,
    className: b.class?.name ?? '',
    studioId: b.class?.studio?.id ?? '',
    studioName: b.class?.studio?.name ?? '',
    instructorName: b.class?.instructor
      ? `${b.class.instructor.firstName} ${b.class.instructor.lastName}`
      : '',
    datetime: b.class?.startTime ?? '',
    status: mapStatus(b.status),
    price: b.creditsUsed,
    checkInCode: b.checkInCode,
    refundedCredits: b.refundedCredits,
    studioLogo: b.class?.studio?.logo ?? null,
  };
}

export async function getUpcomingBookings(): Promise<MappedBooking[]> {
  const data = await apiRequest<{ bookings: BackendBooking[] }>('/api/bookings/upcoming');
  return data.bookings.map(mapBooking);
}

export async function getPastBookings(): Promise<MappedBooking[]> {
  const data = await apiRequest<{ bookings: BackendBooking[] }>('/api/bookings/past');
  return data.bookings.map(mapBooking);
}

export async function createBooking(classId: string): Promise<{
  booking: BackendBooking;
  creditBalance: number;
}> {
  return apiRequest('/api/bookings', {
    method: 'POST',
    body: JSON.stringify({ classId }),
  });
}

export async function cancelBooking(bookingId: string, reason?: string): Promise<{
  booking: BackendBooking;
  refundedCredits: number;
  creditBalance: number;
}> {
  return apiRequest(`/api/bookings/${bookingId}`, {
    method: 'DELETE',
    body: JSON.stringify({ reason }),
  });
}
