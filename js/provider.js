export function getWalletProvider() {
  const providers = [
    window.rabby,
    ...(Array.isArray(window.ethereum?.providers) ? window.ethereum.providers : []),
    window.ethereum,
  ].filter(Boolean);

  return providers.find(isRabbyProvider) || providers[0] || null;
}

export function describeWalletProvider(provider = getWalletProvider()) {
  if (!provider) return "none";
  if (isRabbyProvider(provider)) return "Rabby";
  if (provider.isMetaMask) return "MetaMask";
  if (provider.isOKExWallet) return "OKX";
  if (provider.isCoinbaseWallet) return "Coinbase";
  return "unknown injected wallet";
}

function isRabbyProvider(provider) {
  return Boolean(provider?.isRabby || provider?._isRabby || provider?.isRabbyWallet);
}
