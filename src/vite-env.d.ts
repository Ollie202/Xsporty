/// <reference types="vite/client" />

interface Window {
  XCUP_API_BASE_URL?: string;
  XCUP_WALLETCONNECT_PROJECT_ID?: string;
  XCupMarkets?: {
    openMatchPage: (matchId?: string) => void;
    showHome: () => void;
  };
}
