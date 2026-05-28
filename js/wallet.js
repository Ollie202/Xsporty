import { state } from './state.js';
import { shortAddress } from './utils.js';
import { showToast, showTrade, setConnectButtons, applyProfileImage } from './ui.js';
import { apiGet, refreshPortfolio } from './api.js';
import { showHome } from './rendering.js';
import { renderTickets, openHistoryPage } from './trading.js';
import { describeWalletProvider, getAvailableWallets, getWalletProvider, rememberWalletProvider } from './provider.js';

const WALLET_CONNECTED_KEY = "x-cup-wallet-connected";
const WALLET_DISCONNECTED_KEY = "x-cup-wallet-disconnected";
const WALLET_PROVIDER_KEY = "x-cup-wallet-provider";
let walletModal;

export function wireConnectButtons() {
  getAvailableWallets().forEach(wallet => wallet.provider?.on?.('accountsChanged', accounts => {
    if (state.selectedWalletId && wallet.id !== state.selectedWalletId) return;
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
  }));

  document.querySelectorAll("[data-action='connect']").forEach(button => {
    button.addEventListener("click", async () => {
      if (state.connected) {
        showToast("Wallet already connected");
        return;
      }
      openWalletModal();
    });
  });
}

export async function restoreWalletSession() {
  if (localStorage.getItem(WALLET_DISCONNECTED_KEY) === "1") return false;

  state.selectedWalletId = localStorage.getItem(WALLET_PROVIDER_KEY);
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

async function connectWallet(walletId) {
  closeWalletModal();
  setConnectButtons("Connecting...", true);
  try {
    rememberWalletProvider(walletId);
    const provider = getWalletProvider(walletId);
    if (!provider) throw new Error(`${walletName(walletId)} is not installed`);
    const config = state.walletConfig || await apiGet('/wallet/config');
    state.walletConfig = config;
    try {
      await provider.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: config.chain.hexId }] });
    } catch (switchError) {
      if (switchError.code === 4902 && config.walletAddEthereumChain) {
        await provider.request({ method: 'wallet_addEthereumChain', params: [config.walletAddEthereumChain] });
      } else {
        throw switchError;
      }
    }
    const accounts = await provider.request({ method: 'eth_requestAccounts' });
    state.account = accounts?.[0] || null;
    state.connected = Boolean(state.account);
    if (!state.connected) throw new Error("No wallet account selected");
    rememberWalletSession();
    applyConnectedWallet();
    refreshPortfolio().then(() => { applyConnectedWallet(); renderTickets(); });
    showToast(`${describeWalletProvider(provider)} connected. Live trading enabled.`);
  } catch (error) {
    console.warn(error);
    state.connected = false;
    state.account = null;
    rememberWalletProvider(null);
    localStorage.removeItem(WALLET_PROVIDER_KEY);
    showToast(error.message || "Wallet connection failed");
  } finally {
    setConnectButtons(state.connected ? null : "Connect Wallet", false);
  }
}

export function applyConnectedWallet() {
  if (!state.connected || !state.account) {
    applyDisconnectedWalletUi();
    return;
  }
  const address = state.account;
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
  state.walletProvider = null;
  forgetWalletSession();
  applyDisconnectedWalletUi();
  showTrade();
  showToast("Wallet logged out");
}

function applyDisconnectedWalletUi() {
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
  document.querySelectorAll("[data-wallet-address]").forEach(node => (node.textContent = ""));
}

function rememberWalletSession() {
  localStorage.setItem(WALLET_CONNECTED_KEY, "1");
  localStorage.removeItem(WALLET_DISCONNECTED_KEY);
  if (state.selectedWalletId) localStorage.setItem(WALLET_PROVIDER_KEY, state.selectedWalletId);
}

function forgetWalletSession() {
  localStorage.removeItem(WALLET_CONNECTED_KEY);
  localStorage.setItem(WALLET_DISCONNECTED_KEY, "1");
  localStorage.removeItem(WALLET_PROVIDER_KEY);
  rememberWalletProvider(null);
}

function openWalletModal() {
  walletModal = walletModal || createWalletModal();
  renderWalletChoices();
  walletModal.hidden = false;
}

function closeWalletModal() {
  if (walletModal) walletModal.hidden = true;
}

function createWalletModal() {
  const modal = document.createElement("div");
  modal.className = "wallet-modal";
  modal.hidden = true;
  modal.innerHTML = `
    <button class="wallet-modal__backdrop" type="button" data-wallet-close aria-label="Close wallet selection"></button>
    <section class="wallet-modal__panel" role="dialog" aria-modal="true" aria-labelledby="wallet-modal-title">
      <div class="wallet-modal__head">
        <h2 id="wallet-modal-title">Connect wallet</h2>
        <button type="button" data-wallet-close aria-label="Close wallet selection">x</button>
      </div>
      <div class="wallet-choice-list" data-wallet-choices></div>
    </section>
  `;
  modal.addEventListener("click", event => {
    if (event.target.closest("[data-wallet-close]")) closeWalletModal();
    const button = event.target.closest("[data-wallet-id]");
    if (button && !button.disabled) connectWallet(button.dataset.walletId);
  });
  document.body.appendChild(modal);
  return modal;
}

function renderWalletChoices() {
  const list = walletModal?.querySelector("[data-wallet-choices]");
  if (!list) return;
  const wallets = getAvailableWallets();
  list.innerHTML = `
    ${wallets.map(wallet => `
      <button class="wallet-choice" type="button" data-wallet-id="${wallet.id}" ${wallet.installed ? "" : "disabled"}>
        <span>${wallet.name}</span>
        <small>${wallet.installed ? "Detected" : "Not installed"}</small>
      </button>
    `).join("")}
  `;
}

function walletName(walletId) {
  return getAvailableWallets().find(wallet => wallet.id === walletId)?.name || "Wallet";
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
    });
  });

  copyWalletButton?.addEventListener("click", async event => {
    event.stopPropagation();
    if (!state.account) {
      showToast("Connect wallet first");
      return;
    }
    try {
      await navigator.clipboard.writeText(state.account);
      showToast("Wallet address copied");
    } catch {
      showToast("Copy unavailable in this browser");
    }
  });
}

export function initializeProfileImage() {
  localStorage.removeItem("x-cup-profile-image");
  applyProfileImage(generatedWalletAvatar(state.account));
}

function generatedWalletAvatar(address) {
  const seed = String(address || "x-cup-markets").toLowerCase().replace(/^0x/, "");
  const normalized = seed.replace(/[^0-9a-f]/g, "") || Array.from(seed).map(char => char.charCodeAt(0).toString(16)).join("") || "25d8e8";
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
