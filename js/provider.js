import { state } from './state.js';

const WALLET_DEFINITIONS = [
  { id: "rabby", name: "Rabby", detector: isRabbyProvider },
  { id: "metamask", name: "MetaMask", detector: isMetaMaskProvider },
  { id: "coinbase", name: "Coinbase Wallet", detector: isCoinbaseProvider },
  { id: "okx", name: "OKX Wallet", detector: isOkxProvider },
];

export function getWalletProvider(walletId = state.selectedWalletId) {
  if (state.walletProvider && (!walletId || walletId === "rainbowkit")) return state.walletProvider;
  if (walletId) return findProviderById(walletId);
  return getAvailableWallets().find(wallet => wallet.provider)?.provider || null;
}

export function getAvailableWallets() {
  return WALLET_DEFINITIONS.map(definition => {
    const provider = findProvider(definition.detector);
    return {
      id: definition.id,
      name: definition.name,
      provider,
      installed: Boolean(provider),
    };
  });
}

export function rememberWalletProvider(walletId) {
  state.selectedWalletId = walletId || null;
  if (!walletId) state.walletProvider = null;
}

export function describeWalletProvider(provider = getWalletProvider()) {
  if (!provider) return "none";
  const wallet = WALLET_DEFINITIONS.find(definition => definition.detector(provider));
  return wallet?.name || "unknown injected wallet";
}

function findProviderById(walletId) {
  const definition = WALLET_DEFINITIONS.find(wallet => wallet.id === walletId);
  return definition ? findProvider(definition.detector) : null;
}

function findProvider(detector) {
  return injectedProviders().find(detector) || null;
}

function injectedProviders() {
  return uniqueProviders([
    window.rabby,
    window.okxwallet?.ethereum,
    window.okxwallet,
    window.coinbaseWalletExtension,
    ...(Array.isArray(window.ethereum?.providers) ? window.ethereum.providers : []),
    window.ethereum,
  ].filter(Boolean));
}

function uniqueProviders(providers) {
  const seen = new Set();
  return providers.filter(provider => {
    if (seen.has(provider)) return false;
    seen.add(provider);
    return true;
  });
}

function isRabbyProvider(provider) {
  return Boolean(provider?.isRabby || provider?._isRabby || provider?.isRabbyWallet);
}

function isMetaMaskProvider(provider) {
  return Boolean(provider?.isMetaMask && !isRabbyProvider(provider) && !isCoinbaseProvider(provider) && !isOkxProvider(provider));
}

function isCoinbaseProvider(provider) {
  return Boolean(provider?.isCoinbaseWallet || provider?.isCoinbaseBrowser);
}

function isOkxProvider(provider) {
  return Boolean(provider?.isOKExWallet || provider?.isOkxWallet || provider?.isOKXWallet);
}
