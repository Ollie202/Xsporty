import { useEffect, useRef } from 'react';
import '@rainbow-me/rainbowkit/styles.css';
import { RainbowKitProvider, getDefaultConfig, useConnectModal } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, http, useAccount, useDisconnect } from 'wagmi';
import { defineChain } from 'viem';
import { refreshPortfolio } from '../../js/api.js';
import { state as legacyState } from '../../js/state.js';

type WalletState = {
  connected: boolean;
  address?: string;
};

export type WalletActions = {
  openConnectModal?: () => void;
  disconnect?: () => void;
};

type WalletRuntimeProps = {
  connectRequestId: number;
  onWalletChange: () => void;
  onWalletState: (state: WalletState) => void;
  onActions: (actions: WalletActions) => void;
};

const appState = legacyState as {
  selectedWalletId: string | null;
  walletProvider: unknown;
  account: string | null;
  connected: boolean;
  balance: number | null;
  portfolio: unknown;
  pendingTicket: unknown;
};

const xLayerTestnet = defineChain({
  id: 1952,
  name: 'X Layer Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'OKB',
    symbol: 'OKB',
  },
  rpcUrls: {
    default: {
      http: ['https://testrpc.xlayer.tech'],
    },
  },
  blockExplorers: {
    default: {
      name: 'X Layer Testnet Explorer',
      url: 'https://www.okx.com/web3/explorer/xlayer-test',
    },
  },
  testnet: true,
});

const walletConnectProjectId =
  window.XCUP_WALLETCONNECT_PROJECT_ID ||
  import.meta.env.VITE_WALLETCONNECT_PROJECT_ID ||
  '00000000000000000000000000000000';

const wagmiConfig = getDefaultConfig({
  appName: 'Xsporty',
  projectId: walletConnectProjectId,
  chains: [xLayerTestnet],
  transports: {
    [xLayerTestnet.id]: http(xLayerTestnet.rpcUrls.default.http[0]),
  },
});

const queryClient = new QueryClient();

export function WalletRuntime(props: WalletRuntimeProps) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <WalletBridge {...props} />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

function WalletBridge({
  connectRequestId,
  onWalletChange,
  onWalletState,
  onActions,
}: WalletRuntimeProps) {
  const { address, connector, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { openConnectModal } = useConnectModal();
  const handledConnectRequest = useRef(0);

  useEffect(() => {
    onActions({
      openConnectModal: openConnectModal || undefined,
      disconnect,
    });
  }, [disconnect, onActions, openConnectModal]);

  useEffect(() => {
    if (!connectRequestId || handledConnectRequest.current === connectRequestId || isConnected || !openConnectModal) return;
    handledConnectRequest.current = connectRequestId;
    openConnectModal?.();
  }, [connectRequestId, isConnected, openConnectModal]);

  useEffect(() => {
    let cancelled = false;

    async function syncWallet() {
      if (!isConnected || !address || !connector) {
        if (appState.selectedWalletId === 'rainbowkit') {
          appState.selectedWalletId = null;
          appState.walletProvider = null;
          appState.account = null;
          appState.connected = false;
          appState.balance = null;
          appState.portfolio = null;
          appState.pendingTicket = null;
        }
        onWalletState({ connected: false });
        onWalletChange();
        return;
      }

      const provider = await connector.getProvider();
      if (cancelled) return;

      appState.selectedWalletId = 'rainbowkit';
      appState.walletProvider = provider;
      appState.account = address;
      appState.connected = true;
      appState.balance = null;
      appState.portfolio = null;

      await refreshPortfolio().catch(() => undefined);
      onWalletState({ connected: true, address });
      onWalletChange();
    }

    syncWallet().catch(error => {
      console.warn('Wallet sync failed:', error);
      onWalletChange();
    });

    return () => {
      cancelled = true;
    };
  }, [address, connector, isConnected, onWalletChange, onWalletState]);

  return null;
}
