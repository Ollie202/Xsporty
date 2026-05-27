export type SportId =
  | 'football'
  | 'basketball'
  | 'cricket'
  | 'tennis'
  | 'formula-1'
  | 'ufc'
  | 'esports';

export type MarketSide = 'YES' | 'NO' | 'OVER' | 'UNDER';

export type BackendFixture = {
  id: string;
  sport: string;
  competition?: {
    id?: string;
    kind?: string;
    name?: string;
    season?: string | number;
  };
  homeCompetitor?: string;
  awayCompetitor?: string;
  homeLogoUrl?: string;
  awayLogoUrl?: string;
  kickoffTime?: string;
  status?: string;
};

export type BackendOutcome = {
  id?: string;
  side: MarketSide | string;
  name?: string;
};

export type BackendMarket = {
  id: string;
  fixtureId?: string;
  type?: string;
  title?: string;
  status?: string;
  tradingStatus?: string;
  resolver?: {
    rule?: string;
  };
  outcomes?: BackendOutcome[];
  conditionId?: string;
  template?: {
    category?: string;
    player?: BackendPlayer;
    competition?: {
      name?: string;
      season?: string | number;
    };
  };
};

export type BackendPlayer = {
  playerId?: string | number;
  playerName?: string;
  teamName?: string;
  imageUrl?: string;
};

export type BackendMarketSummary = {
  market?: BackendMarket;
  fixture?: BackendFixture;
  summary?: {
    prices?: Record<string, number | string | null | undefined>;
    openOrderCount?: number;
    tradeCount?: number;
    volume?: number;
    shareVolume?: number;
  };
};

export type BackendMarketCard = {
  type?: string;
  fixture?: BackendFixture;
  player?: BackendPlayer;
  summaries?: BackendMarketSummary[];
};

export type MarketCardsResponse = {
  cards: BackendMarketCard[];
  pagination?: {
    offset: number;
    limit: number;
    total: number;
    hasMore: boolean;
    nextOffset?: number;
  };
};

export type WalletConfigResponse = {
  chainId?: number;
  collateralToken?: string;
  conditionalTokens?: string;
  exchange?: string;
  marketFactory?: string;
  resolver?: string;
  [key: string]: unknown;
};

export type PortfolioResponse = {
  account?: string;
  collateral?: unknown;
  positions?: unknown[];
  orders?: unknown[];
  trades?: unknown[];
  [key: string]: unknown;
};
