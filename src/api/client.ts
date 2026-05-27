import type { MarketCardsResponse, PortfolioResponse, WalletConfigResponse } from './types';

const DEFAULT_API_BASE_URL = 'https://x-cup-backend-production.up.railway.app';

export function getApiBaseUrl() {
  return (
    window.XCUP_API_BASE_URL ||
    localStorage.getItem('x-cup-api-base-url') ||
    DEFAULT_API_BASE_URL
  ).replace(/\/$/, '');
}

export async function apiRequest<TResponse>(path: string, options: RequestInit = {}) {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message =
      payload && typeof payload === 'object' && 'error' in payload
        ? String(payload.error)
        : `${response.status} ${response.statusText}`;
    throw new Error(message);
  }
  return payload as TResponse;
}

export const marketApi = {
  walletConfig: () => apiRequest<WalletConfigResponse>('/wallet/config'),
  marketCards: (query = 'status=open&limit=250&sort=kickoff_time') =>
    apiRequest<MarketCardsResponse>(`/markets/cards?${query}`),
  worldCupCards: () =>
    apiRequest<MarketCardsResponse>(
      '/markets/cards?sport=football&competitionName=World%20Cup&status=open&limit=100&sort=kickoff_time'
    ),
  playerFutureCards: () =>
    apiRequest<MarketCardsResponse>(
      '/markets/cards?category=player_future&status=open&limit=100&sort=newest_activity'
    ),
  portfolio: (address: string) =>
    apiRequest<PortfolioResponse>(`/portfolio/${encodeURIComponent(address)}`),
  portfolioOrders: (address: string) =>
    apiRequest<PortfolioResponse>(`/portfolio/${encodeURIComponent(address)}/orders`),
  portfolioTrades: (address: string) =>
    apiRequest<PortfolioResponse>(`/portfolio/${encodeURIComponent(address)}/trades`),
  portfolioPositions: (address: string) =>
    apiRequest<PortfolioResponse>(`/portfolio/${encodeURIComponent(address)}/positions`),
};
