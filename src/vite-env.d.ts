/// <reference types="vite/client" />

interface Window {
  XSPORTY_API_BASE_URL?: string;
  XSPORTY_WALLETCONNECT_PROJECT_ID?: string;
  Xsporty?: {
    openMatchPage: (matchId?: string) => void;
    showHome: () => void;
  };
  // Backward-compat aliases.
  XCUP_API_BASE_URL?: string;
  XCUP_WALLETCONNECT_PROJECT_ID?: string;
  XCupMarkets?: {
    openMatchPage: (matchId?: string) => void;
    showHome: () => void;
  };
}
