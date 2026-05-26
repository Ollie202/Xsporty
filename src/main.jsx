import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import '@rainbow-me/rainbowkit/styles.css';
import { ConnectButton, RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, http, useAccount } from 'wagmi';
import { defineChain } from 'viem';
import { state } from '../js/state.js';
import { refreshPortfolio } from '../js/api.js';
import { applyConnectedWallet, logOutWallet } from '../js/wallet.js';
import { renderTickets } from '../js/trading.js';
import '../js/main.js';

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
  appName: 'X Cup Markets',
  projectId: walletConnectProjectId,
  chains: [xLayerTestnet],
  transports: {
    [xLayerTestnet.id]: http(xLayerTestnet.rpcUrls.default.http[0]),
  },
});

const queryClient = new QueryClient();

function WalletBridge() {
  const { address, connector, isConnected } = useAccount();

  useEffect(() => {
    let cancelled = false;

    async function syncWallet() {
      if (!isConnected || !address || !connector) {
        if (state.selectedWalletId === 'rainbowkit') logOutWallet();
        return;
      }

      const provider = await connector.getProvider();
      if (cancelled) return;

      state.selectedWalletId = 'rainbowkit';
      state.walletProvider = provider;
      state.account = address;
      state.connected = true;
      state.balance = null;
      state.portfolio = null;

      applyConnectedWallet();
      refreshPortfolio().then(() => {
        applyConnectedWallet();
        renderTickets();
      });
    }

    syncWallet().catch(error => {
      console.warn('RainbowKit wallet sync failed:', error);
    });

    return () => {
      cancelled = true;
    };
  }, [address, connector, isConnected]);

  return <ConnectButton chainStatus="name" accountStatus="address" showBalance={false} />;
}

createRoot(document.getElementById('rainbow-wallet-root')).render(
  <React.StrictMode>
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <WalletBridge />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);
