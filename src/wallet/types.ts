export type WalletState = {
  connected: boolean;
  address?: string;
};

export type WalletActions = {
  openConnectModal?: () => void;
  disconnect?: () => void;
};
