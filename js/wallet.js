import { state } from './state.js?v=55';
import { FALLBACK_WALLET_ADDRESS } from './constants.js?v=55';
import { shortAddress } from './utils.js?v=55';
import { showToast, showTrade, setConnectButtons, applyProfileImage } from './ui.js?v=55';
import { apiGet, refreshPortfolio } from './api.js?v=55';
import { showHome } from './rendering.js?v=55';
import { renderTickets, openHistoryPage } from './trading.js?v=55';
import { describeWalletProvider, getWalletProvider } from './provider.js?v=55';

const WALLET_CONNECTED_KEY = "x-cup-wallet-connected";
const WALLET_DISCONNECTED_KEY = "x-cup-wallet-disconnected";

export function wireConnectButtons() {
  const provider = getWalletProvider();
  provider?.on?.('accountsChanged', accounts => {
    state.account = accounts?.[0] || null;
    state.connected = Boolean(state.account);
    state.balance = null;
    state.portfolio = null;
    if (state.connected) {
      rememberWalletSession();
      applyConnectedWallet();
      refreshPortfolio().then(() => { applyConnectedWallet(); renderTickets(); });
    } else {
      logOutWallet();
    }
  });

  document.querySelectorAll("[data-action='connect']").forEach(button => {
    button.addEventListener("click", async () => {
      if (state.connected) {
        showToast("Wallet already connected");
        return;
      }
      setConnectButtons("Connecting...", true);
      try {
        const provider = getWalletProvider();
        if (!provider) throw new Error("No browser wallet found");
        const config = state.walletConfig || await apiGet('/wallet/config');
        state.walletConfig = config;
        try {
          await provider.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: config.chain.hexId }] });
        } catch (switchError) {
          if (switchError.code === 4902 && config.walletAddEthereumChain) {
            await provider.request({ method: 'wallet_addEthereumChain', params: [config.walletAddEthereumChain] });
          }
        }
        const accounts = await provider.request({ method: 'eth_requestAccounts' });
        state.account = accounts[0];
        state.connected = Boolean(state.account);
        if (state.connected) rememberWalletSession();
        applyConnectedWallet();
        refreshPortfolio().then(() => { applyConnectedWallet(); renderTickets(); });
        showToast("Wallet connected. Live trading enabled.");
      } catch (error) {
        console.warn(error);
        state.account = FALLBACK_WALLET_ADDRESS;
        state.connected = true;
        applyConnectedWallet();
        showToast("Demo wallet connected. Install a browser wallet for live orders.");
      } finally {
        setConnectButtons(null, false);
      }
    });
  });
}

export async function restoreWalletSession() {
  if (localStorage.getItem(WALLET_DISCONNECTED_KEY) === "1") return false;

  const provider = getWalletProvider();
  if (!provider) return false;

  try {
    const accounts = await provider.request({ method: 'eth_accounts' });
    const account = accounts?.[0];
    if (!account) {
      localStorage.removeItem(WALLET_CONNECTED_KEY);
      return false;
    }

    state.account = account;
    state.connected = true;
    state.balance = null;
    state.portfolio = null;
    rememberWalletSession();
    applyConnectedWallet();
    refreshPortfolio().then(() => { applyConnectedWallet(); renderTickets(); });
    return true;
  } catch (error) {
    console.warn("Wallet session restore failed:", error);
    return false;
  }
}

export function applyConnectedWallet() {
  const address = state.account || FALLBACK_WALLET_ADDRESS;
  const loaded = state.balance != null;
  const balanceText = loaded ? `${state.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDC` : "... USDC";
  document.querySelectorAll(".balance-pill").forEach(el => {
    el.hidden = false;
    el.textContent = balanceText;
    el.classList.toggle("loading", !loaded);
  });
  document.querySelectorAll("[data-action='open-portfolio']").forEach(button => {
    button.hidden = false;
  });
  document.querySelectorAll("[data-profile-balance]").forEach(el => {
    el.textContent = balanceText;
  });
  applyProfileImage(generatedWalletAvatar(address));
  document.querySelectorAll(".profile-menu").forEach(profile => (profile.hidden = false));
  document.querySelectorAll(".profile-wallet").forEach(wallet => (wallet.hidden = false));
  document.querySelectorAll("[data-wallet-address]").forEach(node => (node.textContent = shortAddress(address)));
  document.querySelectorAll("[data-action='connect']").forEach(connectButton => {
    connectButton.textContent = connectButton.closest(".trade-slip") ? "Wallet Connected" : "Connect Wallet";
    connectButton.hidden = Boolean(connectButton.closest(".wallet-panel"));
  });
}

export function logOutWallet() {
  state.connected = false;
  state.pendingTicket = null;
  state.portfolio = null;
  state.balance = null;
  forgetWalletSession();
  document.querySelectorAll(".balance-pill").forEach(balance => (balance.hidden = true));
  document.querySelectorAll("[data-action='open-portfolio']").forEach(button => (button.hidden = true));
  document.querySelectorAll(".profile-menu").forEach(profile => {
    profile.hidden = true;
    profile.querySelector(".profile-dropdown")?.setAttribute("hidden", "");
  });
  document.querySelectorAll(".profile-wallet").forEach(wallet => (wallet.hidden = true));
  document.querySelectorAll("[data-action='connect']").forEach(connectButton => {
    connectButton.disabled = false;
    connectButton.textContent = "Connect Wallet";
    connectButton.hidden = false;
  });
  document.querySelectorAll("[data-profile-balance]").forEach(el => el.textContent = "");
  showTrade();
  showToast("Wallet logged out");
}

function rememberWalletSession() {
  localStorage.setItem(WALLET_CONNECTED_KEY, "1");
  localStorage.removeItem(WALLET_DISCONNECTED_KEY);
}

function forgetWalletSession() {
  localStorage.removeItem(WALLET_CONNECTED_KEY);
  localStorage.setItem(WALLET_DISCONNECTED_KEY, "1");
}

export function wireProfileMenu() {
  const profileButton = document.querySelector("[data-action='profile']");
  const dropdown = document.querySelector(".profile-dropdown");
  const copyWalletButton = document.querySelector("[data-action='copy-wallet']");

  profileButton?.addEventListener("click", event => {
    event.stopPropagation();
    dropdown.hidden = !dropdown.hidden;
  });

  document.querySelectorAll("[data-profile-view]").forEach(button => {
    button.addEventListener("click", event => {
      event.stopPropagation();
      dropdown.hidden = true;
      if (button.dataset.profileView === "history") {
        openHistoryPage();
        return;
      }
      if (button.dataset.profileView === "support") {
        document.querySelector(".footer-socials")?.scrollIntoView({ behavior: "smooth", block: "center" });
        showToast("Scrolled to support socials");
        return;
      }
      if (button.dataset.profileView === "logout") {
        logOutWallet();
      }
    });
  });

  copyWalletButton?.addEventListener("click", async event => {
    event.stopPropagation();
    try {
      await navigator.clipboard.writeText(state.account || FALLBACK_WALLET_ADDRESS);
      showToast("Wallet address copied");
    } catch {
      showToast("Copy unavailable in this browser");
    }
  });
}

export function initializeProfileImage() {
  localStorage.removeItem("x-cup-profile-image");
  applyProfileImage(generatedWalletAvatar(state.account || FALLBACK_WALLET_ADDRESS));
}

function generatedWalletAvatar(address) {
  const normalized = String(address || FALLBACK_WALLET_ADDRESS).toLowerCase().replace(/^0x/, "");
  const hue = parseInt(normalized.slice(0, 6) || "25d8e8", 16) % 360;
  const accent = `hsl(${hue} 78% 48%)`;
  const secondary = `hsl(${(hue + 54) % 360} 72% 42%)`;
  const bg = `hsl(${(hue + 214) % 360} 38% 12%)`;
  const cells = [];
  for (let y = 0; y < 5; y += 1) {
    for (let x = 0; x < 3; x += 1) {
      const bit = parseInt(normalized[(y * 3 + x) % normalized.length] || "0", 16);
      if (bit % 2 === 0) {
        const color = bit % 4 === 0 ? accent : secondary;
        cells.push(`<rect x="${x * 12 + 10}" y="${y * 12 + 10}" width="10" height="10" rx="3" fill="${color}"/>`);
        if (x !== 2) cells.push(`<rect x="${(4 - x) * 12 + 10}" y="${y * 12 + 10}" width="10" height="10" rx="3" fill="${color}"/>`);
      }
    }
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72"><rect width="72" height="72" rx="36" fill="${bg}"/><circle cx="36" cy="36" r="31" fill="none" stroke="rgba(255,255,255,.18)" stroke-width="2"/>${cells.join("")}</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
