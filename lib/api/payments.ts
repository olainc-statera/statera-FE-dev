import { apiRequest } from '../api-client';

export interface CreditPack {
  id: string;
  credits: number;
  priceCents: number;
  label: string;
}

export interface CreditPacksResponse {
  currency: string;
  packs: CreditPack[];
}

export async function getCreditPacks(): Promise<CreditPack[]> {
  const data = await apiRequest<CreditPacksResponse>('/api/payments/credit-packs');
  return data.packs;
}

export async function createPaymentIntent(packId: string): Promise<{
  paymentIntentId: string;
  clientSecret: string;
  pack: CreditPack;
}> {
  return apiRequest('/api/payments/create-intent', {
    method: 'POST',
    body: JSON.stringify({ packId }),
  });
}

export async function purchaseCredits(
  packId: string,
  paymentIntentId: string
): Promise<{
  transaction: { id: string; amount: number; type: string; createdAt: string };
  creditBalance: number;
}> {
  return apiRequest('/api/payments/purchase-credits', {
    method: 'POST',
    body: JSON.stringify({ packId, paymentIntentId }),
  });
}
